import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { locales, links } from '../data/content.mjs';
import { icon } from './icons.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://fog.tik-choco.com';
const publications = JSON.parse(readFileSync(resolve(root, 'data/publications.json'), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url, label, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${esc(url)}">${icon(url.includes('github.com')?'code':url.includes('booth.pm')?'download':url.includes('doi.org')||url.includes('jstage')||url.includes('jglobal')?'book':'external')}<span>${esc(label)}</span></a>`;
const save = (path, body) => { const target = resolve(root, path); mkdirSync(dirname(target), {recursive:true}); writeFileSync(target, body + '\n'); };

function head(c, url, {noindex = false, structured = true} = {}) {
  const schema = {'@context':'https://schema.org','@type':'ProfilePage','@id':`${url}#profile`,url,name:c.title,description:c.description,inLanguage:c.lang,
    mainEntity:{'@type':'Person','@id':`${origin}/#person`,name:'fog',alternateName:['曉霧','田中勇気','Yuki Tanaka'],url:`${origin}/`,image:`${origin}/static/fog.png`,description:c.intro,
      affiliation:{'@type':'Organization',name:'大分大学大学院 工学研究科'},knowsAbout:['P2P','Distributed systems','Networked virtual environments'],sameAs:[links.github,links.zenn]}};
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.title)}</title><meta name="description" content="${esc(c.description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
${structured ? Object.values(locales).map(l => `<link rel="alternate" hreflang="${l.lang}" href="${origin}${l.path}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${origin}/">` : ''}
<meta property="og:type" content="website"><meta property="og:site_name" content="fog">
<meta property="og:title" content="${esc(c.title)}"><meta property="og:description" content="${esc(c.description)}">
<meta property="og:url" content="${url}"><meta property="og:locale" content="${c.ogLocale}">
<meta property="og:image" content="${origin}/static/fog.png"><meta property="og:image:width" content="317"><meta property="og:image:height" content="538"><meta property="og:image:alt" content="${esc(c.avatarAlt)}">
<meta name="twitter:card" content="summary"><meta name="twitter:image" content="${origin}/static/fog.png"><meta name="twitter:image:alt" content="${esc(c.avatarAlt)}">
<meta name="color-scheme" content="light dark"><link rel="icon" href="/static/fog-icon.png"><link rel="stylesheet" href="/styles.css"><script src="/script.js" defer></script>
${structured ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>` : ''}`;
}
function header(c) {
  const ids = ['projects','research','motivation','about'];
  return `<a class="skip-link" href="#main">${c.skip}</a><header class="site-header" id="top"><div class="header-inner">
<a class="brand" href="${c.path}" aria-label="fog"><img src="/static/fog-icon.png" width="32" height="32" alt="">fog</a>
<nav class="main-nav" aria-label="${c.lang === 'ja' ? 'メインナビゲーション' : c.lang === 'en' ? 'Main navigation' : '主导航'}">${c.nav.map((n,i)=>`<a href="#${ids[i]}">${n}</a>`).join('')}</nav>
<div class="controls"><nav class="languages" aria-label="Language">${Object.entries(locales).map(([key,l])=>`<a href="${l.path}" lang="${l.lang}" hreflang="${l.lang}"${l.path===c.path?' aria-current="page"':''}>${{ja:'日本語',en:'EN',zh:'中文'}[key]}</a>`).join('')}</nav><button id="themeToggle" class="theme-toggle" type="button" aria-label="${c.theme}" aria-pressed="false" hidden><svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button></div></div></header>`;
}
function project(p,c) {
  const readMore = c.lang === 'ja' ? '詳細' : c.lang === 'en' ? 'Details' : '详情';
  return `<article class="project" id="${p.id}"><div class="project-heading"><span class="project-icon">${icon({mistlib:'network',mistnet:'cube',linkai:'game'}[p.id])}</span><h3>${p.name}</h3><span class="badge">${p.badge}</span></div>
<div class="project-body"><p class="project-purpose">${p.purpose}</p><dl class="project-facts"><div><dt>${c.role}</dt><dd>${p.role}</dd></div></dl>
<ul class="tech-tags">${({mistlib:['Rust','WebRTC','WebAssembly','MPL-2.0'],mistnet:['Unity','WebRTC','MIT'],linkai:['Linkai Online','BOOTH']}[p.id]).map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
<div class="project-links">${link(links[p.sourceKey],p.id==='linkai'?c.official:c.source)} ${p.roleKey?link(links[p.roleKey],c.history):''} ${p.secondaryKey?link(links[p.secondaryKey],c.distribution):''}${p.id==='mistnet'?` <a href="#icce2024">ICCE-Taiwan 2024 <span aria-hidden="true">↓</span></a>`:''}</div>
<details data-modal="${p.id}-details"><summary>${readMore}</summary><div class="detail-content"><h4>${c.output}</h4><p>${p.output}</p><h4>${c.design}</h4><p>${p.design}</p><h4>${c.status}</h4><p>${p.status}</p>${p.id==='mistlib'?`<h4>${link(links.examples,'mistlib-examples')}</h4><p>${c.examplesText}</p><h4>${link(links.unity,'mistlib-unity')}</h4><p>${c.unityText}</p>`:''}</div></details></div></article>`;
}
function publication(p,c) {
  return `<li class="publication" id="${p.id}"><div class="pub-year">${p.year}</div><div><span class="pub-status">${c.pubStatus[p.status]}</span><h4 lang="${p.titleLang}">${esc(p.title)}</h4><p class="authors">${p.authors.length?esc(p.authors.join(', ')):`${c.presenter}: ${p.presenter}`}</p><p class="venue">${esc(p.venue)}${p.pages?` · pp. ${p.pages}`:''}</p>
${p.status==='self-reported-presented'?`<p class="self-note">${c.selfNote}</p>`:''}${p.programDate?`<p class="venue">${c.program}</p>`:''}
${p.url?`<p class="pub-link">${link(p.url,p.programDate?c.programLink:c.paperLink)}${p.doi?` <span class="doi">${esc(p.doi)}</span>`:''}</p>`:''}</div></li>`;
}
for (const [key,c] of Object.entries(locales)) {
  save(key==='ja'?'index.html':`${key}/index.html`,`<!doctype html><html lang="${c.lang}"><head>${head(c,origin+c.path)}</head><body>${header(c)}<main id="main">
<section class="hero wrap" aria-labelledby="identity"><div class="hero-copy"><h1 id="identity">fog<span> / 曉霧</span></h1><p class="hero-tagline">${c.tagline[0]}<br>${c.tagline[1]}</p><p class="hero-intro">${c.intro}</p><p class="affiliation">${c.affiliation}</p><div class="hero-actions"><a class="button primary" href="#projects">${c.actions[0]} <span aria-hidden="true">↘</span></a><a class="button secondary" href="#research">${c.actions[1]} <span aria-hidden="true">↓</span></a></div></div><figure class="hero-portrait"><div class="portrait-frame"><img src="/static/fog.png" width="317" height="538" alt="${c.avatarAlt}" fetchpriority="high"></div></figure></section>
<section class="section wrap" id="projects" aria-labelledby="work-title"><div class="section-heading"><h2 class="icon-heading" id="work-title">${icon('code')}${c.workTitle}</h2><p>${c.workIntro}</p></div><div class="project-grid">${c.projects.map(p=>project(p,c)).join('\n')}</div><aside class="apps"><div><h3 class="icon-heading">${icon('window')}${c.appsTitle}</h3><p>${c.appsText}</p></div><div class="apps-action">${link(links.apps,c.appsLink,'button secondary')}</div></aside></section>
<section class="research-section" id="research" aria-labelledby="research-title"><div class="wrap section research-layout"><div class="section-heading"><h2 class="icon-heading" id="research-title">${icon('book')}${c.researchTitle}</h2><p>${c.researchIntro}</p>${link(links.academic,c.researchProfile)}</div><div class="bibliography">${Object.entries(c.pubGroups).map(([category,label])=>`${['workshop','domestic'].includes(category)?`<details class="older-publications"><summary>${label}</summary>`:''}<section class="pub-group" aria-labelledby="group-${category}"><h3 id="group-${category}">${label}</h3><ol>${publications.filter(p=>p.category===category&&p.public).map(p=>publication(p,c)).join('\n')}</ol></section>${['workshop','domestic'].includes(category)?'</details>':''}`).join('\n')}</div></div></section>
<section class="motivation wrap section" id="motivation" aria-labelledby="motivation-title"><div><h2 class="icon-heading" id="motivation-title">${icon('spark')}${c.motivationTitle}</h2></div><div class="motivation-copy"><p class="motivation-lead">${c.motivationLead}</p><p>${c.motivationBody}</p><p>${c.motivationEnd}</p></div></section>
<section class="section wrap more" aria-labelledby="more-title"><div class="section-heading"><h2 class="icon-heading" id="more-title">${icon('pen')}${c.moreTitle}</h2></div><article class="education"><div><p class="eyebrow">${c.educationBadge}</p><h3 class="icon-heading">${icon('network')}${c.educationTitle}</h3></div><div><p>${c.educationBody}</p><div class="project-links">${link(links.learning,c.educationLink)}${link(links.education,c.educationSource)}</div></div></article><div class="past-work"><article><p class="eyebrow">${c.yunaDate}</p><h3 class="icon-heading">${icon('game')}${c.yunaTitle}</h3><p>${c.yunaBody}</p>${link(links.yuna,c.distribution)}</article><article><p class="eyebrow">${c.hiyokoDate}</p><h3 class="icon-heading">${icon('game')}${c.hiyokoTitle}</h3><p>${c.hiyokoBody}</p>${link(links.hiyoko,c.distribution)}</article></div></section>
<section class="about-section" id="about" aria-labelledby="about-title"><div class="wrap section about-grid"><div><h2 class="icon-heading" id="about-title">${icon('person')}${c.aboutTitle}</h2><p>${c.aboutBody}</p><p class="affiliation">${c.affiliation}</p>${link(links.academic,c.affiliationSource)}</div><div><h3>${c.contactTitle}</h3><p>${c.contactBody}</p><nav class="profile-links" aria-label="${c.contactTitle}"><a href="mailto:fog8360@gmail.com">${icon('mail')}<span>fog8360@gmail.com</span></a>${link(links.github,'GitHub / fog-zs')}${link(links.x,'X / @zs_fog')}${link(links.zenn,'Zenn / fog')}</nav></div></div></section>
</main><footer class="site-footer wrap"><span>© fog</span><a href="#top">${c.top} ↑</a></footer></body></html>`);
}
save('404.html',`<!doctype html><html lang="ja"><head>${head({...locales.ja,title:'ページが見つかりません | fog',description:'fogのポートフォリオのトップページへ戻れます。'},origin+'/404.html',{noindex:true,structured:false})}</head><body><main class="wrap notfound"><p class="eyebrow">404 / NOT FOUND</p><h1>ページが見つかりません</h1><p lang="en">This page could not be found.</p><p lang="zh-Hans">未找到此页面。</p><nav aria-label="Language"><a class="button primary" href="/">日本語トップへ</a><a class="button secondary" href="/en/">English</a><a class="button secondary" href="/zh/">中文</a></nav></main></body></html>`);
save('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml`);
save('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Object.values(locales).map(c=>`\n  <url><loc>${origin}${c.path}</loc>${Object.values(locales).map(l=>`<xhtml:link rel="alternate" hreflang="${l.lang}" href="${origin}${l.path}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${origin}/"/></url>`).join('')}\n</urlset>`);
// Keep existing data URLs, with original titles and consistent status in every language.
const csv = rows => rows.map(row=>row.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
const pubCsv = csv([['category','authors','title','venue','year','note','url'],...publications.map(p=>[p.category,p.authors.join(', '),p.title,p.venue,p.year,p.status==='self-reported-presented'?'Presented (self-reported); publication unconfirmed':p.status,p.url])]);
for (const key of Object.keys(locales)) {
  const suffix=key==='ja'?'':'.'+key, c=locales[key];
  save(`data/publications${suffix}.csv`,pubCsv);
  save(`data/affiliations${suffix}.csv`,csv([['name','url','note'],[c.affiliation,links.academic,'J-GLOBAL; checked 2026-09-15']]));
  save(`data/projects${suffix}.csv`,csv([['name','url','description'],...c.projects.map(p=>[p.name,links[p.sourceKey],p.purpose+' '+p.badge])]));
}
console.log('Built three language pages, 404, sitemap, robots and compatible CSVs.');
