import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
test('all pages have large 1200x630 share metadata and dated sitemap',()=>{
 for(const file of readdirSync('.').filter(f=>f.endsWith('.html'))){const html=readFileSync(file,'utf8');assert(html.includes('https://cardlico.com/assets/social-card.png'));assert(html.includes('summary_large_image'));}
 const png=readFileSync('assets/social-card.png');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
 assert.equal((readFileSync('sitemap.xml','utf8').match(/<lastmod>2026-10-08<\/lastmod>/g)||[]).length,5);
});

import {auditInlineScripts} from '../scripts/inline-policy.mjs';
import {renderPage} from '../scripts/templates.mjs';
test('only approved factual JSON-LD is permitted and its CSP hash matches',()=>{
 const html=renderPage(readFileSync('index.html','utf8'));
 const csp=JSON.parse(readFileSync('vercel.json')).headers.flatMap(r=>r.headers).find(h=>h.key==='Content-Security-Policy').value;
 auditInlineScripts(html,'index.html',csp);
 assert.throws(()=>auditInlineScripts(html+'<script>alert(1)</script>','index.html',csp));
 assert.throws(()=>auditInlineScripts(html.replace('"name":"Cardlico"','"name":"Other"'),'index.html',csp));
 assert.throws(()=>auditInlineScripts(html,'index.html',"script-src 'self'"));
 assert.throws(()=>auditInlineScripts(html,'privacy.html',csp));
 assert(!csp.includes('unsafe-inline'));
});
