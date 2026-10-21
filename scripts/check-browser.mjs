// Optional real-browser QA: run the preview server first, then node scripts/check-browser.mjs.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync,mkdtempSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const out=join(process.env.TEMP,'portfolio-p4');
mkdirSync(out,{recursive:true});
const profile=mkdtempSync(join(out,'chrome-qa-'));
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',[
  '--headless=new','--hide-scrollbars','--no-first-run','--no-default-browser-check',
  '--remote-debugging-port=9334',`--user-data-dir=${profile}`,'about:blank'
],{windowsHide:true,stdio:'ignore'});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
let socket;
try {
  let targets;
  for(let i=0;i<100;i++) { try { targets=await (await fetch('http://127.0.0.1:9334/json/list')).json(); if(targets.some(t=>t.type==='page'))break; } catch {} await pause(100); }
  socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise(r=>socket.addEventListener('open',r,{once:true}));
  let id=0; const pending=new Map();
  socket.addEventListener('message',e=>{const m=JSON.parse(e.data); if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}});
  const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
  const evaluate=async(expression)=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true}); if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  await send('Page.enable');
  for(const [name,path,width,scheme] of [['ja-light','/',1280,'light'],['en-dark','/en/',1280,'dark'],['zh-mobile','/zh/',390,'light'],['ja-mobile','/',390,'light'],['en-mobile','/en/',390,'dark']]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:3200,deviceScaleFactor:1,mobile:false});
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:scheme}]});
    await send('Page.navigate',{url:`http://127.0.0.1:4173${path}`});
    for(let i=0;i<100;i++){await pause(100);if(await evaluate(`document.readyState==='complete' && document.documentElement.lang==='${path==='/en/'?'en':path==='/zh/'?'zh-Hans':'ja'}'`))break;}
    await evaluate('document.fonts.ready');
    await evaluate(`Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));`);
    const state=await evaluate(`(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,theme:document.documentElement.dataset.theme,font:getComputedStyle(document.body).fontFamily,fontSize:getComputedStyle(document.body).fontSize,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family),overflow:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1 && e.tagName!=='DIALOG').map(e=>[e.tagName,e.className,e.getBoundingClientRect().right]),images:[...document.images].map(i=>[i.getAttribute('src'),i.naturalWidth,i.naturalHeight]),minFont:Math.min(...[...document.querySelectorAll('main p,main a,main span,main h2,main h3,main h4,main button')].map(e=>parseFloat(getComputedStyle(e).fontSize)))}))()`);
    state.fonts=[...new Set(state.fonts)];
    console.log(name,JSON.stringify(state));
    assert.equal(state.scrollWidth,width,`${name}: horizontal overflow`);
    assert.equal(state.theme,scheme);
    assert(state.minFont>=11,'Card metadata may use 11px text');
    assert(state.images.every(i=>i[1]>0));
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.project-links a')).textDecorationLine`),'none');
    await evaluate(`document.querySelector('.detail-trigger button').click()`);
    assert(await evaluate(`document.querySelector('dialog').open`));
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await pause(250);
    assert(await evaluate(`!document.querySelector('dialog').open && document.activeElement===document.querySelector('.detail-trigger button')`));
    await evaluate('document.activeElement.blur()');
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    writeFileSync(join(out,`${name}-qa.png`),Buffer.from(shot.data,'base64'));
    const metrics=await send('Page.getLayoutMetrics');
    const full=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:metrics.cssContentSize.height,scale:1}});
    writeFileSync(join(out,`${name}-full.png`),Buffer.from(full.data,'base64'));
    await evaluate(`document.getElementById('themeToggle').click()`);
    assert.equal(await evaluate('document.documentElement.dataset.theme'),scheme==='dark'?'light':'dark');
    await send('Page.reload'); await pause(500);
    assert.equal(await evaluate('document.documentElement.dataset.theme'),scheme==='dark'?'light':'dark');
    await evaluate(`localStorage.removeItem('theme')`);
  }
  console.log('PASS: real Chrome viewport, images, font sizes, links, dialogs/Escape/focus, and saved theme.');
  await send('Browser.close');
} finally { socket?.close(); chrome.kill(); }
