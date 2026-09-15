import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const code = readFileSync(new URL('../script.js', import.meta.url), 'utf8').split('// Enhance project details only.')[1];
assert(code);
for (const reduced of [false, true]) {
  const nodes = [];
  let active;
  function element(tag) {
    const handlers = {}, classes = new Set();
    const node = { tag, children: [], open: false, attrs: {}, animations: [],
      classList: { add: v => classes.add(v), remove: v => classes.delete(v), contains: v => classes.has(v) },
      append(...children) { this.children.push(...children); },
      setAttribute(k,v) { this.attrs[k] = v; },
      addEventListener(k,fn) { handlers[k] = fn; },
      emit(k, extra={}) { handlers[k]?.({target:this, ...extra}); },
      focus() { active = this; },
      showModal() { this.open = true; },
      close() { this.open = false; this.emit('close'); },
      getBoundingClientRect() { return {left:20,right:200,top:20,bottom:200}; },
      animate(frames,options) { let resolve; const finished=new Promise(r=>resolve=r); const a={frames,options,finished,finish:resolve,cancel(){}};this.animations.push(a);return a; }
    };
    nodes.push(node); return node;
  }
  const content = element('div');
  const details = {dataset:{modal:'mistlib-details'},querySelector:s=>s==='summary'?{textContent:'詳細'}:content,closest:()=>({querySelector:()=>({textContent:'mistlib'})}),replaceWith(row){this.row=row;}};
  const root = element('html'); root.lang='ja';
  const body = element('body');
  vm.runInNewContext('//'+code,{HTMLDialogElement:{prototype:{showModal(){}}},document:{documentElement:root,body,querySelectorAll:()=>[details],createElement:element},window:{matchMedia:()=>({matches:reduced})}});
  const dialog=nodes.find(n=>n.tag==='dialog');
  const trigger=details.row.children[0], close=dialog.children[0].children[1];
  assert.equal(trigger.attrs['aria-controls'],dialog.id);
  assert.equal(dialog.children[1],content,'Move original static content into dialog');
  trigger.emit('click');
  assert(dialog.open); assert.equal(active,close);assert(root.classList.contains('modal-open'));
  assert.equal(dialog.animations.length,reduced?0:1);
  let prevented=false;
  dialog.emit('cancel',{preventDefault(){prevented=true;}});
  assert(prevented);
  if (!reduced) { assert(dialog.open); dialog.animations.at(-1).finish(); await Promise.resolve(); }
  assert(!dialog.open); assert.equal(active,trigger);assert(!root.classList.contains('modal-open'));
  assert(!dialog.classList.contains('is-closing'));
  trigger.emit('click');
  dialog.emit('pointerdown',{clientX:0,clientY:0});
  dialog.emit('click',{clientX:0,clientY:0});
  if(!reduced){dialog.animations.at(-1).finish();await Promise.resolve();}
  assert(!dialog.open);
}
console.log('PASS: dialog open, Escape, backdrop close, focus restoration, animation completion and reduced motion (DOM mocks; not a browser rendering test).');
