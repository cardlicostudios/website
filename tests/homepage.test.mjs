import {renderPage} from '../scripts/templates.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('homepage has one store group, five boards and distinct rule heading',()=>{
 const html=renderPage(readFileSync('index.html','utf8'));
 assert(html.includes('Four suits. Four directions.'));
 for(const board of ['Relaxed','Normal','Hard','Expert','Memory'])assert(html.includes(board));
 assert.equal((html.match(/data-store="play"/g)||[]).length,1);
 assert.equal((html.match(/class="mode-icon"><svg/g)||[]).length,3);
 assert(html.includes('Join the waitlist'));
});
