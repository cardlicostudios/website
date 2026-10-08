import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
function node(){return {textContent:'',children:[],attrs:{},events:{},append(child){this.children.push(child);},replaceChildren(){this.children=[];},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},addEventListener(k,v){this.events[k]=v;}};}
function setup(fetch){
 const elements=Object.fromEntries(['ranking-results','ranking-rows','ranking-table','ranking-status','ranking-refresh','ranking-board-title'].map(id=>[id,node()]));
 const buttons=['relaxed','normal','hard','expert','memory'].map(c=>({...node(),dataset:{category:c},querySelector:()=>({textContent:c[0].toUpperCase()+c.slice(1)})}));
 runInNewContext(readFileSync('leaderboard.js','utf8'),{document:{querySelectorAll:()=>buttons,getElementById:id=>elements[id],createElement:()=>node()},fetch,AbortController,setTimeout,clearTimeout});
 return {elements,buttons};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
test('renders names as text and populated table, without HTML insertion',async()=>{
 const ui=setup(async()=>({ok:true,json:async()=>({category:'relaxed',entries:[{rank:1,name:'A & B',score:1234,cards:21}]})}));await settle();
 assert.equal(ui.elements['ranking-table'].hidden,false);assert.equal(ui.elements['ranking-rows'].children[0].children[1].textContent,'A & B');assert.equal(ui.elements['ranking-board-title'].textContent,'Relaxed rankings');assert.equal(ui.elements['ranking-refresh'].disabled,false);
});
test('network failure shows retry, refresh recovers empty state',async()=>{
 let fail=true;const ui=setup(async()=>{if(fail)throw Error('offline');return {ok:true,json:async()=>({category:'relaxed',entries:[]})};});await settle();assert.match(ui.elements['ranking-status'].textContent,/unavailable/);fail=false;await ui.elements['ranking-refresh'].events.click();await settle();assert.match(ui.elements['ranking-status'].textContent,/No scores yet/);assert.equal(ui.elements['ranking-table'].hidden,true);
});
test('late previous response never replaces newly selected board',async()=>{
 const pending=[];const ui=setup(()=>new Promise(resolve=>pending.push(resolve)));
 ui.buttons[4].events.click();assert.equal(ui.elements['ranking-refresh'].disabled,true);
 pending[1]({ok:true,json:async()=>({category:'memory',entries:[]})});await settle();
 pending[0]({ok:true,json:async()=>({category:'relaxed',entries:[{rank:1,name:'Old',score:1,cards:1}]})});await settle();
 assert.equal(ui.elements['ranking-board-title'].textContent,'Memory rankings');assert.equal(ui.elements['ranking-rows'].children.length,0);assert.match(ui.elements['ranking-status'].textContent,/Memory/);
});

test('cutoff notice appears only for an actual continuing tie and preserves shared ranks',async()=>{
 for(const hasMoreTiedPlayers of [true,false]){
 const ui=setup(async()=>({ok:true,json:async()=>({category:'relaxed',hasMoreTiedPlayers,entries:[{rank:1,name:'A',score:100,cards:2},{rank:1,name:'B',score:100,cards:9}]})}));await settle();
 assert.deepEqual(ui.elements['ranking-rows'].children.map(r=>r.children[0].textContent),['1','1']);
 assert.equal(ui.elements['ranking-status'].textContent.includes('More players share rank 1'),hasMoreTiedPlayers);
 }
});
