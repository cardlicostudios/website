import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, categories } from '../api/leaderboard.js';
async function run(url='/api/leaderboard', rows=[], overrides={}) {
  let requested, options;
  const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(data){this.data=data;}};
  const handler=createHandler({env:{SUPABASE_ANON_KEY:'test-only'},fetcher:async(url,init)=>{requested=url;options=init;return {ok:true,json:async()=>rows};},...overrides});
  await handler({method:overrides.method||'GET',url},res);return {...res,requested,options};
}
test('five boards use a bounded fixed projection and return only public fields',async()=>{
 for(const c of categories){const r=await run(`/api/leaderboard?category=${c}`,[{high_score:1200,best_cards:34,player_name:'Gamer',email:'private@example.invalid',user_id:'private-id'}]);
 assert.equal(r.code,200);assert.deepEqual(r.data,{category:c,entries:[{rank:1,name:'Gamer',score:1200,cards:34}],hasMoreTiedPlayers:false});
 assert.equal(r.requested.pathname,'/rest/v1/rpc/website_public_board');assert.equal(r.requested.search,'');assert.equal(r.options.method,'POST');assert.deepEqual(JSON.parse(r.options.body),{p_category:c});assert.equal(r.options.headers.apikey,'test-only');assert.equal(r.options.headers.Authorization,'Bearer test-only');assert.equal(r.options.headers['Content-Type'],'application/json');assert.match(r.headers['Cache-Control'],/s-maxage=60/);}
});
test('empty board is a successful empty result',async()=>{assert.deepEqual((await run()).data.entries,[]);});
test('invalid categories, extra parameters and write methods rejected',async()=>{
 for(const q of ['category=daily','category=all-time','category=relaxed&category=hard','select=*','category=normal%26select=*'])assert.equal((await run('/api/leaderboard?'+q)).code,400);
 assert.equal((await run(undefined,[],{method:'POST'})).code,405);
});
test('bad upstream rows and errors fail closed without leaking data',async()=>{
 for(const rows of [null,{},[{high_score:1,best_cards:2,player_name:'<script>'}],[{high_score:-1,best_cards:0,player_name:'Gamer'}]]){const r=await run(undefined,rows);assert.equal(r.code,503);assert.equal(r.headers['Cache-Control'],'no-store');}
 for(const fetcher of [async()=>{throw Error('private upstream error');},async()=>({ok:false})])assert.equal((await run(undefined,[],{fetcher})).code,503);
 assert.equal((await run(undefined,[],{env:{}})).code,503);
});

const scoreRow = (score, cards=1) => ({high_score:score,best_cards:cards,player_name:'Gamer'});
test('equal scores share competition ranks on every board regardless of cards',async()=>{
 for(const category of categories){
  const r=await run('/api/leaderboard?category='+category,[scoreRow(100,1),scoreRow(90,2),scoreRow(90,999),scoreRow(80,3)]);
  assert.deepEqual(r.data.entries.map(e=>e.rank),[1,2,2,4]);
  assert.equal(r.data.hasMoreTiedPlayers,false);
 }
});
test('cutoff detects additional tied players without returning the 51st player',async()=>{
 const tied=await run(undefined,Array.from({length:51},()=>scoreRow(100)));
 assert.equal(tied.data.entries.length,50);assert.ok(tied.data.entries.every(e=>e.rank===1));assert.equal(tied.data.hasMoreTiedPlayers,true);
 const lower=await run(undefined,[...Array.from({length:50},()=>scoreRow(100)),scoreRow(90)]);
 assert.equal(lower.data.entries.length,50);assert.equal(lower.data.hasMoreTiedPlayers,false);
 const exact=await run(undefined,Array.from({length:50},()=>scoreRow(100)));
 assert.equal(exact.data.hasMoreTiedPlayers,false);
 const empty=await run();assert.equal(empty.data.hasMoreTiedPlayers,false);
});

test('never falls back to the service-role credential',async()=>{
 let calls=0;
 const r=await run(undefined,[],{env:{SUPABASE_SERVICE_ROLE_KEY:'must-not-use'},fetcher:async()=>{calls++;throw Error('unexpected');}});
 assert.equal(r.code,503);assert.equal(calls,0);assert.equal(r.requested,undefined);
 const both=await run(undefined,[],{env:{SUPABASE_ANON_KEY:'public-reader',SUPABASE_SERVICE_ROLE_KEY:'must-not-use'}});
 assert.equal(both.options.headers.apikey,'public-reader');
 assert.equal(both.options.headers.Authorization,'Bearer public-reader');
});

test('RPC response is bounded and malformed private projections fail closed',async()=>{
 for(const rows of [Array.from({length:52},()=>scoreRow(1)),[{high_score:1,best_cards:1,player_profiles:{player_name:'Gamer'}}],[{...scoreRow(1),best_cards:-1}],[{...scoreRow(1),player_name:' '}],[{...scoreRow(1),high_score:Number.MAX_SAFE_INTEGER+1}]]) {
  const r=await run(undefined,rows);assert.equal(r.code,503);assert.deepEqual(r.data,{message:'Rankings unavailable'});
 }
});
