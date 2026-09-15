import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { locales, links } from '../data/content.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFileSync(resolve(root,path),'utf8');
const pubs=JSON.parse(read('data/publications.json'));
const files=['index.html','en/index.html','zh/index.html','404.html'];
const pages=new Map(files.map(file=>[file,read(file)]));
const decode=value=>value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
let localLinks=0;
for(const [file,html] of pages) {
  assert.match(html,/<!doctype html>/i,file);
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${file}: exactly one h1`);
  assert.equal((html.match(/<main[\s>]/g)||[]).length,1,`${file}: main landmark`);
  assert(!html.includes('\uFFFD'),`${file}: replacement characters`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${file}: duplicate IDs`);
  const stack=[];
  const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr','path']);
  const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
  for(const token of markup.matchAll(/<(\/?)([a-z][a-z0-9-]*)\b[^>]*>/gi)) {
    const tag=token[2].toLowerCase();
    if(voids.has(tag)||token[0].endsWith('/>'))continue;
    if(token[1])assert.equal(stack.pop(),tag,`${file}: mismatched ${tag}`);else stack.push(tag);
  }
  assert.equal(stack.length,0,`${file}: unclosed elements`);
  for(const m of html.matchAll(/<img\b[^>]*>/g))assert.match(m[0],/\balt="[^"]*"/,`${file}: image alt`);
  for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url=new URL(decode(m[1]),'https://fog.tik-choco.com/'+file);
    if(url.origin!=='https://fog.tik-choco.com')continue;
    const target=decodeURIComponent(url.pathname).slice(1)+(url.pathname.endsWith('/')?'index.html':'');
    assert(existsSync(resolve(root,target)),`${file}: missing ${target}`);
    if(url.hash) {
      const body=pages.get(target)??read(target);
      assert(body.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`${file}: missing anchor ${url.href}`);
    }
    localLinks++;
  }
  assert(!/<(?:iframe|video|canvas)\b/i.test(html),`${file}: no automatic heavy media`);
}
for(const [key,c] of Object.entries(locales)) {
  const html=pages.get(key==='ja'?'index.html':`${key}/index.html`);
  assert.match(html,new RegExp(`<html lang="${c.lang}">`));
  assert(html.includes(`<title>${c.title.replace(/&/g,'&amp;')}</title>`));
  assert(html.includes(`rel="canonical" href="https://fog.tik-choco.com${c.path}"`));
  assert(html.includes(c.intro),`${key}: introduction without JS`);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.mainEntity.name,'fog');
  assert.deepEqual(schema.mainEntity.sameAs,[links.github,links.zenn]);
  assert.equal(schema.description,c.description);
  for(const p of pubs) {
    assert(html.includes(p.title),`${key}: original title ${p.id}`);
    for(const author of p.authors)assert(html.includes(author),`${key}: author ${author}`);
    assert(html.includes(c.pubStatus[p.status]),`${key}: status`);
    if(p.doi)assert(html.includes(p.doi));
  }
  assert(html.includes(c.selfNote));
  assert(html.includes(c.unityText));
  assert.equal(c.projects.length,3);
  assert(statSync(resolve(root,key==='ja'?'index.html':`${key}/index.html`)).size<50000,'HTML size budget');
}
const snpd=pubs.find(p=>p.id==='snpd2026');
assert.equal(snpd.publicationStatus,'unconfirmed');assert.equal(snpd.doi,null);assert.deepEqual(snpd.authors,[]);
assert.equal(read('data/publications.csv'),read('data/publications.en.csv'));
assert.equal(read('data/publications.csv'),read('data/publications.zh.csv'));
assert.equal(read('CNAME').trim(),'fog.tik-choco.com');
assert(read('robots.txt').includes('https://fog.tik-choco.com/sitemap.xml'));
assert(!read('sitemap.xml').includes('404.html'));
for(const c of Object.values(locales))assert(read('sitemap.xml').includes(`https://fog.tik-choco.com${c.path}`));
assert.match(pages.get('404.html'),/name="robots" content="noindex"/);
const js=read('script.js');
assert(!/document\.title|innerHTML|fetch\(/.test(js),'Theme code must not replace titles or load copy');
// Exercise theme behavior when storage is blocked, with saved choices and OS changes.
for(const config of [{saved:null,dark:false},{saved:'dark',dark:false},{saved:'light',dark:true},{saved:null,dark:true,blocked:true}]) {
  let click,change,written;
  const rootElement={dataset:{}};
  const attrs={};
  const button={hidden:true,setAttribute:(k,v)=>attrs[k]=v,addEventListener:(event,fn)=>{if(event==='click')click=fn;}};
  const initial=config.saved===null?config.dark:config.saved==='dark';
  const context={document:{documentElement:rootElement,getElementById:()=>button},window:{matchMedia:()=>({matches:config.dark,addEventListener:(event,fn)=>{change=fn;}})},localStorage:{getItem:()=>{if(config.blocked)throw Error('blocked');return config.saved;},setItem:(key,value)=>{if(config.blocked)throw Error('blocked');written=value;}}};
  vm.runInNewContext(js,context);
  assert.equal(rootElement.dataset.theme,initial?'dark':'light');assert.equal(button.hidden,false);
  change({matches:!initial});
  const before=config.saved===null?!initial:initial;
  assert.equal(rootElement.dataset.theme,before?'dark':'light');
  click();assert.equal(rootElement.dataset.theme,!before?'dark':'light');assert.equal(attrs['aria-pressed'],String(!before));
  if(!config.blocked)assert.equal(written,!before?'dark':'light');
  change({matches:before});assert.equal(rootElement.dataset.theme,!before?'dark':'light');
}
// WCAG relative-luminance formula, testing text colors against actual palette surfaces.
function luminance(hex) {return hex.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);}
function contrast(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
let minContrast=21;
for(const [text,muted,accent,bg,surface,soft,button,onButton] of [
  ['272831','5b5d66','66518b','faf9f6','f0eeea','eeebf3','51406e','ffffff'],
  ['efeee9','b8b9c5','c4b2ea','191a21','22242d','302b3e','c4b2ea','211b30']]) {
  for(const fg of [text,muted,accent])for(const background of [bg,surface,soft]){const ratio=contrast(fg,background);assert(ratio>=4.5,`${fg}/${background}: ${ratio}`);minContrast=Math.min(minContrast,ratio);}
  assert(contrast(button,onButton)>=4.5);
}
const css=read('styles.css');assert(css.includes('prefers-reduced-motion'));assert(css.includes(':focus-visible'));assert(css.includes('max-width:560px'));
console.log(`PASS: ${files.length} HTML files; ${localLinks} local links/assets; 3 locales; ${pubs.length} research entries; structured data; CNAME; CSV parity; theme/storage behavior; minimum text contrast ${minContrast.toFixed(2)}:1.`);
console.log('Not covered: browser rendering, mobile interaction, keyboard/screen-reader use, external app runtime, social-card rendering.');
