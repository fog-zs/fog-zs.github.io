import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { locales, links, publications } from './data.mjs';
import { brandIcon } from './icons.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://fog.tik-choco.com';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url, label, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${esc(url)}">${esc(label)}</a>`;
const target = item => item.target ?? (item.publicationKey ? publications.find(p => p.id === item.publicationKey).url : links[item.linkKey]);
const sentence = item => {
  if (!item.label) return esc(item.text);
  const start = item.text.indexOf(item.label);
  if (start < 0) throw new Error(`Missing timeline link label: ${item.label}`);
  return esc(item.text.slice(0,start)) + link(target(item),item.label) + esc(item.text.slice(start+item.label.length));
};
const profileIcon = (name, label) => `<a class="profile-icon" href="${esc(links[name])}" aria-label="${label}" title="${label}">${brandIcon(name)}</a>`;
const profiles = c => `<nav class="profile-links" aria-label="${esc(c.contactTitle)}"><span class="profile-icons">${profileIcon('github','GitHub')}${profileIcon('linkedin','LinkedIn')}${profileIcon('x','X')}${profileIcon('zenn','Zenn')}</span>${link('mailto:fog8360@gmail.com','fog8360@gmail.com')}${link(links.researchmap,'researchmap')}${link(links.academic,c.profileLink)}</nav>`;
// Groups consecutive timeline rows that share a year, so each year is shown once.
const byYear = rows => rows.reduce((groups, row) => { const last = groups.at(-1); if (last && last[0] === String(row.year)) last[1].push(row); else groups.push([String(row.year), [row]]); return groups; }, []);
const save = (path, body) => { const target = resolve(root, path); mkdirSync(dirname(target), {recursive:true}); writeFileSync(target, body + '\n'); };
const projectIcons = {mistlib:'/static/mistlib.png', linkai:'/static/linkai-online.png', mistl:'/static/mistl.png'};
// Black-on-white logos (mistlib, 零界オンライン) sit on a plain white tile in both themes.
const whiteTiles = new Set(['mistlib', 'linkai']);
const iconTile = (name, image, white = false) => `<span class="card-icon${white ? ' card-icon--white' : ''}" aria-hidden="true">${image ? `<img src="${image}" width="56" height="56" alt="" loading="lazy">` : esc(Array.from(name.trim())[0])}</span>`;
const tags = p => `<ul class="card-tags">${(p.tags ?? p.kind.split(' / ')).map(tag => `<li lang="en">${esc(tag)}</li>`).join('')}</ul>`;

function head(c, url, {noindex = false, structured = true} = {}) {
  const schema = {'@context':'https://schema.org','@type':'ProfilePage','@id':`${url}#profile`,url,name:c.title,description:c.description,inLanguage:c.lang,
    mainEntity:{'@type':'Person','@id':`${origin}/#person`,name:'fog',alternateName:['曉霧','田中勇気','Yuki Tanaka'],url:`${origin}/`,image:`${origin}/static/fog.png`,description:c.intro,
      affiliation:{'@type':'Organization',name:'大分大学大学院 工学研究科'},knowsAbout:['P2P','Distributed systems','Networked virtual environments','WebRTC DataChannel','AOI-based peer selection','Message relaying','NAT traversal (STUN/TURN)','Nostr signaling','Raft','HotStuff','Rust','WebAssembly','TypeScript','Preact','Vite','three.js','VRM','Unity','C#','Technical writing'],sameAs:[links.github,links.zenn]}};
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700${c.lang === 'ja' ? '&amp;family=Noto+Sans+JP:wght@400;500;600;700' : c.lang.startsWith('zh') ? '&amp;family=Noto+Sans+SC:wght@400;500;600;700' : ''}&amp;display=swap">
<title>fog</title><meta name="description" content="${esc(c.description)}">
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
  const ids = ['projects','skills','research','timeline','about'];
  return `<a class="skip-link" href="#main">${c.skip}</a><header class="site-header" id="top"><div class="header-inner">
<a class="brand" href="${c.path}" aria-label="fog"><img src="/static/fog-icon.png" width="32" height="32" alt="">fog</a>
<nav class="main-nav" aria-label="${c.lang === 'ja' ? 'メインナビゲーション' : c.lang === 'en' ? 'Main navigation' : '主导航'}">${c.nav.map((n,i)=>`<a href="#${ids[i]}">${n}</a>`).join('')}</nav>
<div class="controls"><nav class="languages" aria-label="Language">${Object.entries(locales).map(([key,l])=>`<a href="${l.path}" lang="${l.lang}" hreflang="${l.lang}"${l.path===c.path?' aria-current="page"':''}>${{ja:'日本語',en:'EN',zh:'中文'}[key]}</a>`).join('')}</nav><button id="themeToggle" class="theme-toggle" type="button" aria-label="${c.theme}" aria-pressed="false" hidden><svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button></div></div></header>`;
}
function project(p,c) {
  const readMore = c.lang === 'ja' ? '詳細' : c.lang === 'en' ? 'Details' : '详情';
  return `<article class="project" id="${p.id}"><div class="project-heading">${iconTile(p.name,projectIcons[p.id],whiteTiles.has(p.id))}<div><h3>${esc(p.name)}</h3><p class="project-status">${esc(p.badge)}</p></div></div>
<div class="project-body">${tags(p)}<p class="project-purpose">${esc(p.id==='linkai' ? p.purpose : p.subtitle || p.purpose)}</p>
<div class="card-actions"><div class="project-links">${p.playKey?link(links[p.playKey],c.play)+' ':''}${link(links[p.sourceKey],p.id==='linkai'?c.official:c.source)} ${p.roleKey?link(links[p.roleKey],c.history):''} ${p.secondaryKey?link(links[p.secondaryKey],p.id==='linkai'?c.launcher:c.releases):''}${p.id==='mistlib'?` ${link(links.mistnet,c.predecessor)} <a href="#icce2024">ICCE-Taiwan 2024</a>`:''}</div>
<details data-modal="${p.id}-details"><summary>${readMore}</summary><div class="detail-content"><p>${p.purpose}</p><p>${p.role}</p><p>${p.design}</p><p>${p.output}</p><p>${p.status}</p>${p.id==='mistlib'?`<h4>${link(links.mistnet,c.predecessor)}</h4><p>${c.mistnetText}</p><h4>${link(links.examples,'mistlib-examples')}</h4><p>${c.examplesText}</p><h4>${link(links.unity,'mistlib-unity')}</h4><p>${c.unityText}</p><h4>${link(links.consensus,'mistlib-consensus')}</h4><p>${c.consensusText}</p><h4>${link(links.mistai,'mistai')}</h4><p>${c.mistaiText}</p>`:''}</div></details></div></div></article>`;
}
function publication(p,c) {
  return `<li class="publication" id="${p.id}"><div class="pub-year">${p.year}</div><div><span class="pub-status">${c.pubStatus[p.status]}</span><h4 lang="${p.titleLang}">${esc(p.title)}</h4><p class="authors">${p.authors.length?esc(p.authors.join(', ')):`${c.presenter}: ${p.presenter}`}</p><p class="venue">${esc(p.venue)}${p.pages?` · pp. ${p.pages}`:''}</p>
${p.status==='self-reported-presented'?`<p class="self-note">${c.selfNote}</p>`:''}${p.programDate?`<p class="venue">${c.program}</p>`:''}
${p.url?`<p class="pub-link">${link(p.url,p.programDate?c.programLink:c.paperLink)}${p.doi?` <span class="doi">${esc(p.doi)}</span>`:''}</p>`:''}</div></li>`;
}
for (const [key,c] of Object.entries(locales)) {
  save(key==='ja'?'index.html':`${key}/index.html`,`<!doctype html><html lang="${c.lang}"><head>${head(c,origin+c.path)}</head><body>${header(c)}<main id="main">
<section class="hero wrap" aria-labelledby="identity"><div class="hero-copy"><h1 id="identity">fog<span> / 曉霧</span></h1><p class="hero-tagline">${c.tagline.map(line=>`<span>${esc(line)}</span>`).join('')}</p><p class="hero-intro">${c.intro}</p><p class="affiliation">${c.affiliation}</p>${profiles(c)}</div><figure class="hero-portrait"><div class="portrait-frame"><img src="/static/fog.png" width="317" height="538" alt="${c.avatarAlt}" fetchpriority="high"></div></figure></section>
<section class="section wrap" id="projects" aria-labelledby="work-title"><div class="section-heading"><h2 id="work-title">${c.workTitle}</h2></div><div class="project-list">${c.projects.map(p=>project(p,c)).join('\n')}</div><aside class="apps"><div class="project-heading">${iconTile(c.appsTitle,'/static/tc-catalog.svg')}<h3>${c.appsTitle}</h3></div><div class="card-content"><p>${c.appsText}</p><div class="project-links">${link(links.catalog,c.appsLink)}</div></div></aside></section>
<section class="section wrap" id="skills" aria-labelledby="skills-title"><div class="section-heading"><h2 id="skills-title">${esc(c.skillsTitle)}</h2></div><div class="skills-grid">${c.skills.map(s=>`<article class="skill"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p><div class="project-links">${s.evidence.map(e=>link(target(e),e.label)).join('')}</div></article>`).join('\n')}</div></section>
<section class="research-section" id="research" aria-labelledby="research-title"><div class="wrap section research-layout"><div class="section-heading"><h2 id="research-title">${c.researchTitle}</h2><p>${c.researchIntro}</p>${link(links.researchmap,c.researchProfile)}</div><div class="bibliography">${Object.entries(c.pubGroups).map(([category,label])=>`${['workshop','domestic'].includes(category)?`<details class="older-publications"><summary>${label}</summary>`:''}<section class="pub-group" aria-labelledby="group-${category}"><h3 id="group-${category}">${label}</h3><ol>${publications.filter(p=>p.category===category&&p.public).map(p=>publication(p,c)).join('\n')}</ol></section>${['workshop','domestic'].includes(category)?'</details>':''}`).join('\n')}</div></div></section>
<section class="section wrap" id="timeline" aria-labelledby="timeline-title"><div class="section-heading"><h2 id="timeline-title">${esc(c.timelineTitle)}</h2></div><ol class="timeline">${byYear(c.timeline).map(([year,rows])=>`<li class="timeline-group"><span class="timeline-year">${esc(year)}</span><ul class="timeline-events">${rows.map(t=>`<li>${sentence(t)}</li>`).join('')}</ul></li>`).join('\n')}</ol></section>
<section class="section wrap more" id="more" aria-labelledby="more-title"><div class="section-heading"><h2 id="more-title">${c.moreTitle}</h2></div><article class="education" id="education"><div class="project-heading">${iconTile('P2P')}<div><h3>${c.educationTitle}</h3><p class="work-date">${c.educationBadge}</p></div></div><div class="card-content"><p>${c.educationBody}</p><div class="project-links">${link(links.learning,c.educationLink)}${link(links.education,c.educationSource)}</div></div></article><div class="past-work"><article id="yuna"><div class="game-thumbnail"><img src="/static/yuna.jpg" width="300" height="255" alt="${esc(c.yunaTitle)}" loading="lazy"></div><div class="game-content"><h3>${c.yunaTitle}</h3><p class="work-date">${c.yunaDate}</p><p class="game-description">${c.yunaBody}</p><div class="project-links">${link(links.yuna,c.distribution)}</div></div></article><article id="hiyoko"><div class="game-thumbnail"><img src="/static/hiyoko.jpg" width="512" height="288" alt="${esc(c.hiyokoTitle)}" loading="lazy"></div><div class="game-content"><h3>${c.hiyokoTitle}</h3><p class="work-date">${c.hiyokoDate}</p><p class="game-description">${c.hiyokoBody}</p><div class="project-links">${link(links.hiyoko,c.distribution)}</div></div></article></div></section>
<section class="about-section" id="about" aria-labelledby="about-title"><div class="wrap section about-grid"><div><h2 id="about-title">${c.aboutTitle}</h2><p>${c.aboutBody}</p><div class="about-motivation"><p>${c.motivationLead} ${c.motivationBody}</p><p>${c.motivationEnd}</p></div><p class="affiliation">${c.affiliation}</p>${link(links.researchmap,c.affiliationSource)}</div><div><h3>${c.contactTitle}</h3><p>${c.contactBody}</p>${profiles(c)}</div></div></section>
</main><footer class="site-footer wrap"><span>© fog</span><a href="#top">${c.top}</a></footer></body></html>`);
}
save('404.html',`<!doctype html><html lang="ja"><head>${head({...locales.ja,title:'ページが見つかりません | fog',description:'fogのポートフォリオのトップページへ戻れます。'},origin+'/404.html',{noindex:true,structured:false})}</head><body><main class="wrap notfound"><p class="work-date">404 / NOT FOUND</p><h1>ページが見つかりません</h1><p lang="en">This page could not be found.</p><p lang="zh-Hans">未找到此页面。</p><nav aria-label="Language"><a class="button primary" href="/">日本語トップへ</a><a class="button secondary" href="/en/">English</a><a class="button secondary" href="/zh/">中文</a></nav></main></body></html>`);
save('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml`);
save('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Object.values(locales).map(c=>`\n  <url><loc>${origin}${c.path}</loc>${Object.values(locales).map(l=>`<xhtml:link rel="alternate" hreflang="${l.lang}" href="${origin}${l.path}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${origin}/"/></url>`).join('')}\n</urlset>`);
// Preserve the published JSON format: one compact object per line.
save('data/publications.json', '[\n' + publications.map(p => '  ' + JSON.stringify(p)).join(',\n') + '\n]');
// Keep existing data URLs, with original titles and consistent status in every language.
const csv = rows => rows.map(row=>row.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
const pubCsv = csv([['category','authors','title','venue','year','note','url'],...publications.map(p=>[p.category,p.authors.join(', '),p.title,p.venue,p.year,p.status==='self-reported-presented'?'Presented (self-reported); publication unconfirmed':p.status,p.url])]);
for (const key of Object.keys(locales)) {
  const suffix=key==='ja'?'':'.'+key, c=locales[key];
  save(`data/publications${suffix}.csv`,pubCsv);
  save(`data/affiliations${suffix}.csv`,csv([['name','url','note'],[c.affiliation,links.academic,'J-GLOBAL; checked 2026-09-15']]));
  save(`data/projects${suffix}.csv`,csv([['name','url','description'],...c.projects.map(p=>[p.name,links[p.playKey??p.sourceKey],p.purpose+' '+p.badge])]));
}
console.log('Built three language pages, 404, sitemap, robots and compatible CSVs.');
