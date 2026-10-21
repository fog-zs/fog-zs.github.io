import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { locales, links, publications as pubs } from './data.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFileSync(resolve(root,path),'utf8');
assert.deepEqual(JSON.parse(read('data/publications.json')),pubs,'Published bibliography matches YAML source');
const files=['index.html','en/index.html','zh/index.html','404.html'];
const pages=new Map(files.map(file=>[file,read(file)]));
const decode=value=>value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
let localLinks=0;
for(const [file,html] of pages) {
  assert.match(html,/<!doctype html>/i,file);
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${file}: exactly one h1`);
  assert.equal((html.match(/<main[\s>]/g)||[]).length,1,`${file}: main landmark`);
  assert(!html.includes('\uFFFD'),`${file}: replacement characters`);
  assert(html.includes('<title>fog</title>'),`${file}: browser tab title`);
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
  assert(html.includes(`rel="canonical" href="https://fog.tik-choco.com${c.path}"`));
  assert(html.includes(c.intro),`${key}: introduction without JS`);
  const sections=['projects','skills','research','timeline','more','about'];
  const positions=sections.map(id=>html.indexOf(`id="${id}"`));
  assert(positions.every((pos,i)=>pos>=0 && (i===0 || pos>positions[i-1])),`${key}: section priority`);
  assert(!/id="motivation"|href="#motivation"/.test(html),`${key}: motivation merged into About`);
  const navigation=html.match(/<nav class="main-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
  const navIds=['projects','skills','research','timeline','about'];
  assert.deepEqual([...navigation.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]),navIds,`${key}: navigation sections`);
  assert.equal(c.nav.length,navIds.length);
  c.nav.forEach(label=>assert(navigation.includes(label),`${key}: localized navigation`));
  const hero=html.match(/<section class="hero wrap"[\s\S]*?<\/section>/)[0];
  const about=html.slice(html.indexOf('<section class="about-section"'));
  for(const block of [hero,about])for(const url of ['mailto:fog8360@gmail.com',links.github,links.x,links.zenn,links.academic]) {
    assert(block.includes(`href="${url.replace(/&/g,'&amp;')}"`),`${key}: hero and About contact ${url}`);
  }
  assert(hero.includes(c.affiliation) && hero.includes('class="portrait-frame"'),`${key}: hero identity`);
  assert(hero.includes(c.tagline.map(line=>`<span>${line}</span>`).join('')),`${key}: retained catchphrase`);
  for(const copy of [c.aboutBody,c.motivationLead,c.motivationBody,c.motivationEnd])assert(about.includes(copy),`${key}: About and motivation copy`);
  const skills=html.slice(html.indexOf('id="skills"'),html.indexOf('id="research"'));
  assert.equal(c.skills.length,5);
  assert.equal((skills.match(/class="skill"/g)||[]).length,5,`${key}: five skill groups`);
  for(const skill of c.skills) {
    assert(skill.evidence.length>0,`${key}: evidence for ${skill.title}`);
    assert(skills.includes(skill.body.replace(/&/g,'&amp;')),`${key}: skill description`);
    for(const evidence of skill.evidence)assert(skills.includes(`>${evidence.label.replace(/&/g,'&amp;')}</a>`),`${key}: linked skill evidence`);
  }
  assert.deepEqual(c.timeline.map(t=>String(t.year)).slice(1),['2026','2026','2026','2026','2025','2025','2024','2024','2023','2023','2023','2022','2022','2020','2019','2018','2018','2016','2015','2015','2014'],`${key}: verified timeline years`);
  assert(!/高等学校|High School|高级中学/.test(JSON.stringify(c.timeline)),`${key}: no high school name in timeline`);
  for(const k of ['linkedin','researchmap'])assert(html.includes(links[k]),k+' profile link');
  const timeline=html.slice(html.indexOf('id="timeline"'),html.indexOf('id="more"'));
  assert.equal((timeline.match(/<li>/g)||[]).length,c.timeline.length,`${key}: timeline rows`);
  const shownYears=[...timeline.matchAll(/class="timeline-year">([^<]+)</g)].map(m=>m[1]);
  assert.equal(shownYears.length,new Set(shownYears).size,`${key}: each year shown once`);
  for(const row of c.timeline.filter(t=>t.label))assert(timeline.includes(`>${row.label}</a>`),`${key}: timeline evidence`);
  const fonts=html.match(/https:\/\/fonts.googleapis.com\/css2\?[^\"]+/)?.[0];
  assert(fonts?.includes('family=Noto+Sans:') && fonts.includes('display=swap'),`${key}: Latin font and font display`);
  assert.equal(fonts.includes('Noto+Sans+JP'),key==='ja');
  assert.equal(fonts.includes('Noto+Sans+SC'),key==='zh');
  assert(!/<(?:h2|h3)\b[^>]*>\s*<svg/.test(html),`${key}: no decorative heading icons`);
  for (const block of [hero,about]) {
    for (const label of ['GitHub','LinkedIn','X','Zenn']) assert(block.includes(`aria-label="${label}" title="${label}"`),`${key}: accessible profile icon ${label}`);
    assert.equal((block.match(/class="profile-icon"/g)||[]).length,4);
  }
  for(const asset of ['linkai-online.png','yuna.jpg','hiyoko.jpg'])assert(html.includes('/static/'+asset),`${key}: project image ${asset}`);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.mainEntity.name,'fog');
  assert.deepEqual(schema.mainEntity.sameAs,[links.github,links.zenn]);
  assert.equal(schema.description,c.description);
  for(const topic of ['WebRTC DataChannel','NAT traversal (STUN/TURN)','Raft','HotStuff','Rust','WebAssembly','TypeScript','Preact','Vite','three.js','VRM','Unity','C#','Technical writing'])assert(schema.mainEntity.knowsAbout.includes(topic),`${key}: structured skill ${topic}`);
  for(const p of pubs) {
    assert(html.includes(p.title),`${key}: original title ${p.id}`);
    for(const author of p.authors)assert(html.includes(author),`${key}: author ${author}`);
    assert(html.includes(c.pubStatus[p.status]),`${key}: status`);
    if(p.doi)assert(html.includes(p.doi));
  }
  assert(html.includes(c.selfNote));
  assert(html.includes(c.unityText));
  assert.deepEqual(c.projects.map(p=>p.id),['mistlib','linkai','mistl']);
  for(const key of ['linkaiPlay','linkai','linkaiBooth','mistl','mistlReleases','consensus','mistai','catalog'])assert(html.includes(links[key]),key+' link');
  for(const text of [c.play,c.launcher,c.releases,c.consensusText,c.mistaiText,c.appsLink])assert(html.includes(text),'Localized project copy');
  assert(!html.includes('tc-home'),'Catalogue replaces TC Home');
  assert(!/[\u2190-\u21ff\u27f0-\u27ff]/u.test(html),'No decorative arrow glyphs');
  assert(html.includes('ICCE-Taiwan 2024</a>'),'Research link text');
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
  const themeColor={isConnected:true};
  context.document.querySelector=()=>themeColor;
  context.getComputedStyle=()=>({getPropertyValue:()=>rootElement.dataset.theme==='dark'?'#0f1c20':'#f6fafa'});
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
const css=read('styles.css');
assert(!/lavender|#(?:5a4fb0|ece9fb|d4ccff|302c55)/i.test(css),'No old purple palette');
assert.equal(css.match(/:root\[data-theme="dark"\] \{([^}]+)\}/)[1],css.match(/:root:not\(\[data-theme="light"\]\) \{([^}]+)\}/)[1],'Explicit and automatic dark palettes stay in sync');
for(const block of [css.match(/:root \{([^}]+)\}/)[1],css.match(/:root\[data-theme="dark"\] \{([^}]+)\}/)[1]]) {
  const palette=Object.fromEntries([...block.matchAll(/--([\w-]+):#([a-f0-9]{6})/g)].map(m=>[m[1],m[2]]));
  for(const name of ['text','muted','accent','sky','mint'])for(const bg of ['bg','paper','surface-muted']) {
    const ratio=contrast(palette[name],palette[bg]);
    assert(ratio>=4.5,`${name}/${bg}: ${ratio}`);minContrast=Math.min(minContrast,ratio);
  }
  for(const name of ['accent','sky','mint']) {
    const ratio=contrast(palette[name==='accent'?'accent-on-soft':name],palette[`${name}-soft`]);
    assert(ratio>=4.5,`${name}: readable tinted chips and buttons`);minContrast=Math.min(minContrast,ratio);
  }
}
assert(css.includes('prefers-reduced-motion'));assert(css.includes(':focus-visible'));assert(css.includes('max-width:560px'));
assert(!/gradient\(|[\u2190-\u21ff\u27f0-\u27ff]/u.test(css),'No decorative gradients or arrows');
assert.match(css,/@media\(prefers-reduced-motion:reduce\)\s*\{[^}]*:hover\s*\{\s*transform:none;/,'Reduced motion disables card hover lift');
console.log(`PASS: ${files.length} HTML files; ${localLinks} local links/assets; 3 locales; ${pubs.length} research entries; structured data; CNAME; CSV parity; theme/storage behavior; minimum text contrast ${minContrast.toFixed(2)}:1.`);
console.log('Not covered: browser rendering, mobile interaction, keyboard/screen-reader use, external app runtime, social-card rendering.');
