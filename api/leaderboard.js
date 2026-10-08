export const categories = ['relaxed', 'normal', 'hard', 'expert', 'memory'];

export function createHandler({ env = process.env, fetcher = fetch } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const fail = (status, message) => res.status(status).json({ message });
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return fail(405, 'Method not allowed');
    }
    const query = new URL(req.url, 'https://cardlico.com').searchParams;
    const category = query.get('category') ?? 'relaxed';
    if (!categories.includes(category) || query.getAll('category').length > 1 || [...query.keys()].some(key => key !== 'category')) return fail(400, 'Invalid category');
    if (!env.SUPABASE_ANON_KEY) return fail(503, 'Rankings unavailable');
    const url = new URL('https://ddbanhygcaynmnmjjndk.supabase.co/rest/v1/rpc/website_public_board');
    try {
      const response = await fetcher(url, {
        method: 'POST',
        body: JSON.stringify({ p_category: category }),
        headers: { 'Content-Type': 'application/json', apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_ANON_KEY}` },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return fail(503, 'Rankings unavailable');
      const rows = await response.json();
      if (!Array.isArray(rows) || rows.length > 51) return fail(503, 'Rankings unavailable');
      let rank = 0;
      const ranked = rows.map((row, index) => {
        const name = row?.player_name;
        if (typeof name !== 'string' || !name.trim() || [...name].length > 20 || /[<>\u0000-\u001f\u007f]/.test(name)
          || !Number.isSafeInteger(row.high_score) || row.high_score <= 0
          || !Number.isSafeInteger(row.best_cards) || row.best_cards < 0) throw new Error('Invalid row');
        if (index === 0 || row.high_score !== rows[index - 1].high_score) rank = index + 1;
        return { rank, name, score: row.high_score, cards: row.best_cards };
      });
      const entries = ranked.slice(0, 50);
      const hasMoreTiedPlayers = ranked.length > 50 && ranked[50].score === ranked[49].score;
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
      return res.status(200).json({ category, entries, hasMoreTiedPlayers });
    } catch { return fail(503, 'Rankings unavailable'); }
  };
}

export default createHandler();
