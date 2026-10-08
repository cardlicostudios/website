import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../api/signup.js';
const env = { SUPABASE_SERVICE_ROLE_KEY:'test-only', SIGNUP_HASH_SECRET:'test-only-secret', VERCEL_URL:'preview.example' };
function request(overrides={}) { return {method:'POST', headers:{origin:'https://cardlico.com','content-type':'application/json','x-vercel-forwarded-for':'192.0.2.1'},body:{email:'Tester@example.com',website:''},...overrides}; }
async function run(req=request(), fetcher=async()=>({ok:true,json:async()=>'accepted'}), config=env) {
  const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  await createHandler({env:config,fetcher})(req,res); return res;
}
test('success normalizes email and never transmits raw IP or returns subscriber data',async()=>{
  let body;
  const result=await run(request(),async(url,options)=>{body=JSON.parse(options.body);assert(url.includes('ddbanhygcaynmnmjjndk'));return {ok:true,json:async()=>'accepted'};});
  assert.equal(result.code,200); assert.equal(body.p_email,'tester@example.com');assert.match(body.p_network_hash,/^[a-f0-9]{64}$/);assert(!JSON.stringify(body).includes('192.0.2.1'));assert.deepEqual(result.body,{message:'Request received'});
});
test('unexpected database payload never leaks to public caller',async()=>{const result=await run(request(),async()=>({ok:true,json:async()=>({email:'private@example.invalid'})}));assert.equal(result.code,503);assert(!JSON.stringify(result.body).includes('private'));});
test('invalid email and malformed input rejected',async()=>{for(const body of [{email:'bad',website:''},null,[],{email:'a@b.co'},'{']) assert.equal((await run(request({body}))).code,400);});
test('honeypot succeeds without contacting storage',async()=>{assert.equal((await run(request({body:{email:'bot@example.com',website:'spam'}}),()=>{throw Error('must not call');})).code,200);});
test('network and upstream errors fail closed',async()=>{assert.equal((await run(request(),async()=>{throw Error('network');})).code,503);assert.equal((await run(request(),async()=>({ok:false}))).code,503);});
test('missing server secret fails closed',async()=>{assert.equal((await run(request(),undefined,{})).code,503);});
test('database rate limit returns 429',async()=>{assert.equal((await run(request(),async()=>({ok:true,json:async()=>'limited'}))).code,429);});
test('method, origin, content type and size checks',async()=>{
 assert.equal((await run(request({method:'GET'}))).code,405);
 for(const origin of ['https://attacker.example',undefined]) assert.equal((await run(request({headers:{...request().headers,origin}}))).code,403);
 assert.equal((await run(request({headers:{...request().headers,'content-type':'text/plain'}}))).code,415);
 assert.equal((await run(request({body:{email:'x'.repeat(3000),website:''}}))).code,413);
});
