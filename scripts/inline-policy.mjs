import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export function auditInlineScripts(html, file, csp) {
 const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
 let dataBlocks=0;
 for(const [,attrs,body] of scripts){
  if(/\bsrc="[^"]+"/.test(attrs)){assert(!body.trim(),'External script must not have inline content');continue;}
  assert(file==='index.html' && attrs.trim()==='type="application/ld+json"','Inline executable script forbidden');
  assert.equal(++dataBlocks,1);
  const data=JSON.parse(body);
  assert.deepEqual(Object.keys(data).sort(),['@context','@type','description','name','url']);
  assert.equal(data['@context'],'https://schema.org');assert.equal(data['@type'],'WebSite');
  assert.equal(data.name,'Cardlico');assert.equal(data.url,'https://cardlico.com/');
  assert.equal(data.description,html.match(/<meta name="description" content="([^"]+)"/)?.[1]);
  const hash=createHash('sha256').update(body).digest('base64');
  assert(csp.split(';').find(d=>d.trim().startsWith('script-src '))?.includes(`'sha256-${hash}'`),'JSON-LD CSP hash mismatch');
 }
 assert.equal(dataBlocks,file==='index.html'?1:0);
}
