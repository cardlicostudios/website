import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
function setup(fetcher, valid=true) {
  const button={disabled:false,textContent:'Notify Me'}, status={textContent:''};
  let submit;
  const form={elements:{email:{value:'test@example.invalid'},website:{value:''}},attributes:{},
    querySelector:()=>button,reportValidity:()=>valid,addEventListener:(_,fn)=>{submit=fn;},
    setAttribute(k,v){this.attributes[k]=v;},removeAttribute(k){delete this.attributes[k];},reset(){this.elements.email.value='';}};
  runInNewContext(readFileSync('signup.js','utf8'),{document:{querySelectorAll:()=>[form],getElementById:()=>status},fetch:fetcher,AbortController,setTimeout,clearTimeout});
  return {button,status,form,submit:()=>submit({preventDefault(){}})};
}
test('pending request disables repeated submission, success resets and reenables',async()=>{
  let resolve, calls=0;
  const ui=setup(()=>{calls++;return new Promise(r=>{resolve=r;});});
  const pending=ui.submit(); assert.equal(ui.button.disabled,true);assert.equal(ui.form.attributes['aria-busy'],'true');
  await ui.submit();assert.equal(calls,1);resolve({ok:true});await pending;
  assert.equal(ui.button.disabled,false);assert.equal(ui.form.elements.email.value,'');assert.match(ui.status.textContent,/received/);
});
test('network and HTTP failure preserve input and restore submit control',async()=>{
  for(const fetcher of [async()=>{throw Error('offline');},async()=>({ok:false})]){
    const ui=setup(fetcher);await ui.submit();assert.equal(ui.button.disabled,false);assert.equal(ui.form.elements.email.value,'test@example.invalid');assert.match(ui.status.textContent,/try again/);assert.equal(ui.form.attributes['aria-busy'],undefined);
  }
});
test('invalid form never submits',async()=>{let calls=0;const ui=setup(()=>{calls++;},false);await ui.submit();assert.equal(calls,0);});
