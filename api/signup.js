import { createHmac } from 'node:crypto';

export function createHandler({ env = process.env, fetcher = fetch } = {}) {
  return async function signup(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');
    const reply = (status, message) => res.status(status).json({ message });
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return reply(405, 'Method not allowed');
    }
    const allowed = ['https://cardlico.com', 'https://www.cardlico.com'];
    if (env.VERCEL_URL) allowed.push(`https://${env.VERCEL_URL}`);
    if (!allowed.includes(req.headers.origin)) return reply(403, 'Request not allowed');
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return reply(415, 'JSON required');
    if (Number(req.headers['content-length']) > 2048) return reply(413, 'Request too large');
    let body;
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!raw || Buffer.byteLength(raw) > 2048) return reply(413, 'Request too large');
      body = JSON.parse(raw);
    } catch { return reply(400, 'Invalid request'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, 'Invalid request');
    if (typeof body.website !== 'string') return reply(400, 'Invalid request');
    if (body.website) return reply(200, 'Request received');
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(400, 'Invalid email');
    // Vercel overwrites this header at its trusted edge. Never trust a caller's X-Forwarded-For.
    const ip = req.headers['x-vercel-forwarded-for'];
    if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.SIGNUP_HASH_SECRET || typeof ip !== 'string' || !ip) return reply(503, 'Please try later');
    const hash = createHmac('sha256', env.SIGNUP_HASH_SECRET).update(ip).digest('hex');
    try {
      const result = await fetcher('https://ddbanhygcaynmnmjjndk.supabase.co/rest/v1/rpc/website_signup', {
        method: 'POST',
        headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_email: email, p_network_hash: hash }),
        signal: AbortSignal.timeout(8000),
      });
      if (!result.ok) return reply(503, 'Please try later');
      const outcome = await result.json();
      if (outcome === 'limited') return reply(429, 'Please try later');
      if (outcome !== 'accepted') return reply(503, 'Please try later');
      return reply(200, 'Request received');
    } catch { return reply(503, 'Please try later'); }
  };
}

export default createHandler();
