import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {renderPage,cssHash} from '../scripts/templates.mjs';
test('five pages expand shared navigation/footer and CSS content hash',()=>{
 for(const file of readdirSync('.').filter(f=>f.endsWith('.html'))){const html=renderPage(readFileSync(file,'utf8'));assert.equal((html.match(/<nav /g)||[]).length,1);assert.equal((html.match(/<footer>/g)||[]).length,1);assert(html.includes('styles.css?v='+cssHash()));assert(!html.includes('partial:'));}
 assert.notEqual(cssHash('a'),cssHash('b'));assert.equal(cssHash('a'),cssHash('a'));
});
test('shared changes propagate and unknown/unresolved templates fail',()=>{
 assert.equal(renderPage('<!-- partial:footer -->',()=>'<footer>New</footer>'),'<footer>New</footer>');
 assert.throws(()=>renderPage('<!-- partial:secret -->'));assert.throws(()=>renderPage('{{missing}}'));
});
