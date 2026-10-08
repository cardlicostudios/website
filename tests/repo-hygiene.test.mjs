import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
test('internal records are not tracked in public source and remain ignored',()=>{
 const tracked=execFileSync('git',['ls-files'],{encoding:'utf8'}).split(/\r?\n/);
 assert(!tracked.some(p=>/^(docs|replies|sql)\//.test(p)));
 for(const dir of ['docs','replies','sql'])assert(readFileSync('.gitignore','utf8').includes('/'+dir+'/'));
});
