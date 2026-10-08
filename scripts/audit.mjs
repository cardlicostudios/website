import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import {renderPage} from './templates.mjs';
import {auditInlineScripts} from './inline-policy.mjs';
const csp=JSON.parse(readFileSync('vercel.json')).headers.flatMap(r=>r.headers).find(h=>h.key==='Content-Security-Policy').value;
for (const file of ['nav.js','signup.js','site-config.js','api/signup.js','api/leaderboard.js','leaderboard.js']) execFileSync(process.execPath,['--check',file]);
for (const file of readdirSync('.').filter(f => f.endsWith('.html'))) {
  const html = renderPage(readFileSync(file, 'utf8'));
  auditInlineScripts(html, file, csp);
  assert(!/\s(?:style|on\w+)\s*=/i.test(html), `${file}: inline style or event`);
  assert(!/supabase-js|xawrfuqdafipquveemxe|—|[←↑→↓]/.test(html), `${file}: obsolete or prohibited content`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  for (const required of ['rel="canonical"','og:image','id="main-content"','href="/delete-account"']) assert(html.includes(required), `${file}: ${required}`);
  for (const [,link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    let target = link.split(/[?#]/)[0].replace(/^\//,'') || 'index.html';
    if (!target.includes('.')) target += '.html';
    assert(existsSync(target), `${file}: missing ${target}`);
  }
}
const headers=JSON.parse(readFileSync('vercel.json')).headers.flatMap(rule => rule.headers);
assert(headers.find(h=>h.key==='Content-Security-Policy')?.value.includes("object-src 'none'"));
assert(!headers.some(h=>h.value.includes('unsafe-inline')));
assert.equal(readFileSync('app-ads.txt','utf8').trim(),'google.com, pub-9255693906990271, DIRECT, f08c47fec0942fa0');
assert(!/All-Time|<h[1-6][^>]*>Daily|Daily.*rankings/.test(readFileSync('leaderboard.html','utf8')));
console.log('Static page, link, metadata, script and header audit passed.');
