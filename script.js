// 初期テーマの決定
(function initTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.classList.toggle('dark', saved === 'dark');
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  } catch (_) {
    /* ignore */
  }
})();

// i18n 設定
const I18N_STRINGS = {
  ja: {
    siteTitle: 'fog',
    about: '夢',
    projects: 'やっていること',
    affiliations: '所属',
    publications: '発表',
    pubInternational: '国際会議',
    pubDomestic: '国内学会',
    brand: 'fog',
    themeToggle: 'テーマ切替',
    language: '言語',
    languageButton: '言語',
    languages: {
      en: '英語',
      zh: '中国語',
      ja: '日本語'
    }
  },
  en: {
    siteTitle: 'fog',
    about: 'About',
    projects: 'Projects',
    affiliations: 'Affiliations',
    publications: 'Publications',
    pubInternational: 'International Conferences',
    pubDomestic: 'Domestic Conferences',
    brand: 'fog',
    themeToggle: 'Toggle theme',
    language: 'Language',
    languageButton: 'Language',
    languages: {
      en: 'English',
      zh: 'Chinese',
      ja: 'Japanese'
    }
  },
  zh: {
    siteTitle: '曉霧',
    about: '简介',
    projects: '项目',
    affiliations: '隶属',
    publications: '发表',
    pubInternational: '国际会议',
    pubDomestic: '国内会议',
    brand: 'fog',
    themeToggle: '切换主题',
    language: '语言',
    languageButton: '语言',
    languages: {
      en: '英语',
      zh: '中文',
      ja: '日语'
    }
  }
};

function getInitialLang() {
  try {
    const saved = localStorage.getItem('lang');
    if (saved && (saved === 'ja' || saved === 'en' || saved === 'zh')) return saved;
  } catch (_) {}
  const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  if (nav.startsWith('ja')) return 'ja';
  return 'en';
}

let CURRENT_LANG = getInitialLang();

function setLang(lang) {
  if (!I18N_STRINGS[lang]) return;
  CURRENT_LANG = lang;
  try {
    localStorage.setItem('lang', lang);
  } catch (_) {}
  applyTranslations();
  // 再レンダリング（言語別ファイルの読み分けのため）
  renderAbout();
  renderAffiliations();
  renderProjects();
  renderPublications();
}

function applyTranslations() {
  const dict = I18N_STRINGS[CURRENT_LANG];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key] != null) {
      el.textContent = dict[key];
    }
  });
  // ボタン/セレクタのラベル
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.setAttribute('aria-label', dict.themeToggle);
    themeBtn.setAttribute('title', dict.themeToggle);
  }
  // <html lang="...">
  document.documentElement.setAttribute('lang', CURRENT_LANG);
  // <title> の更新は任意（ここでは siteTitle を使用）
  const titleEl = document.querySelector('head > title');
  if (titleEl && dict.siteTitle) {
    titleEl.textContent = dict.siteTitle.replace(/\/.*$/, '');
  }
  updateLangUI();
}

// トグル
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  } catch (_) {
    /* ignore */
  }
});

function updateLangUI() {
  const dict = I18N_STRINGS[CURRENT_LANG] || I18N_STRINGS.en;
  const names = (dict && dict.languages) || (I18N_STRINGS.en && I18N_STRINGS.en.languages) || { en: 'English', zh: 'Chinese', ja: 'Japanese' };
  const langToggle = document.getElementById('langToggle');
  const langCurrent = document.getElementById('langCurrent');
  const labelText = dict?.languageButton || dict?.language || 'Language';
  if (langToggle) {
    langToggle.setAttribute('aria-label', labelText);
    langToggle.setAttribute('title', labelText);
  }
  if (langCurrent) {
    langCurrent.textContent = names[CURRENT_LANG] || CURRENT_LANG.toUpperCase();
  }
  document.querySelectorAll('[data-lang-option]').forEach(btn => {
    const code = btn.getAttribute('data-lang-option');
    const label = (code && names[code]) || (code ? code.toUpperCase() : '');
    if (label) btn.textContent = label;
    btn.classList.toggle('active', code === CURRENT_LANG);
  });
}

// 年の表示
document.getElementById('year') && (document.getElementById('year').textContent = String(new Date().getFullYear()));

// 汎用: テキスト取得
async function fetchText(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load: ${path}`);
  return await res.text();
}

// dataファイル: .tsv を優先し、無ければ .csv を読む
async function fetchDataFile(basePathWithoutExt) {
  // 例: basePathWithoutExt='data/projects' → 言語別 → デフォルト（無印） → その他言語
  // 日本語UI時に英語版が先に選ばれてしまう問題対策として、無印（デフォルト）を優先
  const allLangs = ['ja', 'en', 'zh'];
  const others = allLangs.filter(l => l !== CURRENT_LANG);
  const tryPaths = [];
  // 1) 現在の言語
  tryPaths.push(`./${basePathWithoutExt}.${CURRENT_LANG}.tsv`, `./${basePathWithoutExt}.${CURRENT_LANG}.csv`);
  // 2) デフォルト（無印）
  tryPaths.push(`./${basePathWithoutExt}.tsv`, `./${basePathWithoutExt}.csv`);
  // 3) その他の言語
  for (const lang of others) {
    tryPaths.push(`./${basePathWithoutExt}.${lang}.tsv`, `./${basePathWithoutExt}.${lang}.csv`);
  }
  let lastErr = null;
  for (const p of tryPaths) {
    try {
      const text = await fetchText(p);
      const delimiter = p.endsWith('.tsv') ? '\t' : ',';
      return { text, delimiter, path: p };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error(`Failed to load data for ${basePathWithoutExt}`);
}

// シンプルCSVパーサ（RFC準拠ではないが、引用符とカンマを扱う）
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cell);
        cell = '';
      } else if (ch === '\r') {
        // skip
      } else if (ch === '\n') {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      } else {
        cell += ch;
      }
    }
  }
  // 最終セル/行
  if (cell.length > 0 || inQuotes || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  // ヘッダ行
  if (rows.length === 0) return [];
  const headers = rows[0];
  return rows.slice(1)
    .filter(r => r.length && r.some(v => String(v).trim().length > 0))
    .map(orig => {
      let r = orig.slice();
      // 列数調整：余分がある場合は著者列（index 1）に結合して揃える
      if (r.length > headers.length) {
        const extra = r.length - headers.length;
        const merged = [r[0], [r[1], ...r.slice(2, 2 + extra + 1)].join(', ')];
        r = merged.concat(r.slice(2 + extra + 1));
      } else if (r.length < headers.length) {
        // 不足分は空文字で埋める
        r = r.concat(Array(headers.length - r.length).fill(''));
      }
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h.trim()] = (r[idx] ?? '').trim();
      });
      return obj;
    });
}

// シンプルTSVパーサ（タブ区切り、引用符処理は行わない想定）
function parseTSV(text) {
  const lines = text.split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines[0].split('\t').map(h => h.trim());
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = line.split('\t');
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] ?? '').trim();
    });
    out.push(obj);
  }
  return out;
}

// Markdown（非常に簡易的：空行区切りで<p>化）
function renderSimpleMarkdownTo(container, markdownText) {
  const blocks = markdownText.split(/\r?\n\r?\n/).map(s => s.trim()).filter(Boolean);
  container.innerHTML = '';
  for (const b of blocks) {
    const p = document.createElement('p');
    // 最低限のリンク自動化（http/https）
    const html = b
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    p.innerHTML = html;
    container.appendChild(p);
  }
}

function createAnchorOrText(text, url) {
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = text;
    return a;
  }
  return document.createTextNode(text);
}

async function renderAbout() {
  const el = document.getElementById('about');
  if (!el) return;
  try {
    let md = '';
    // 現在の言語 → デフォルト（about.md/ABOUT.md） → その他言語 の順
    const allLangs = ['ja', 'en', 'zh'];
    const others = allLangs.filter(l => l !== CURRENT_LANG);
    const tryPaths = [
      `./docs/about.${CURRENT_LANG}.md`,
      `./docs/ABOUT.${CURRENT_LANG}.md`,
      './docs/about.md',
      './docs/ABOUT.md',
      ...others.flatMap(l => [`./docs/about.${l}.md`, `./docs/ABOUT.${l}.md`])
    ];
    for (const p of tryPaths) {
      try {
        md = await fetchText(p);
        if (md) break;
      } catch (_) { /* try next */ }
    }
    if (md) {
      renderSimpleMarkdownTo(el, md);
    }
  } catch (_) {
    // 取得できない場合は何もしない
  }
}

async function renderAffiliations() {
  const list = document.getElementById('affiliations');
  if (!list) return;
  try {
    const { text, delimiter } = await fetchDataFile('data/affiliations');
    const rows = delimiter === '\t' ? parseTSV(text) : parseCSV(text);
    list.innerHTML = '';
    rows.forEach(r => {
      const li = document.createElement('li');
      const name = r.name || '';
      const url = r.url || '';
      const note = r.note || '';
      li.appendChild(createAnchorOrText(name, url));
      if (note) {
        li.appendChild(document.createTextNode(` (${note})`));
      }
      list.appendChild(li);
    });
  } catch (_) {
    // ignore
  }
}

async function renderProjects() {
  const list = document.getElementById('projects');
  if (!list) return;
  try {
    const { text, delimiter } = await fetchDataFile('data/projects');
    const rows = delimiter === '\t' ? parseTSV(text) : parseCSV(text);
    list.innerHTML = '';
    rows.forEach(r => {
      const li = document.createElement('li');
      const name = r.name || '';
      const url = r.url || '';
      const description = r.description || '';
      const linkNode = createAnchorOrText(name, url);
      li.appendChild(linkNode);
      if (description) {
        const span = document.createElement('span');
        span.textContent = ` — ${description}`;
        li.appendChild(span);
      }
      list.appendChild(li);
    });
  } catch (_) {
    // ignore
  }
}

function renderPublicationItem(pub) {
  const li = document.createElement('li');
  const authors = pub.authors || '';
  const title = pub.title || '';
  const venue = pub.venue || '';
  const year = pub.year || '';
  const note = pub.note || '';
  const url = pub.url || '';

  if (authors) {
    li.appendChild(document.createTextNode(`${authors}, `));
  }
  if (title) {
    const a = document.createElement('a');
    a.href = url || '#';
    if (url) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.textContent = title;
    li.appendChild(a);
  }
  const detail = [venue, year].filter(Boolean).join(', ');
  if (detail) {
    li.appendChild(document.createTextNode(`, ${detail}`));
  }
  if (note) {
    li.appendChild(document.createTextNode(` [${note}]`));
  }
  return li;
}

async function renderPublications() {
  const intlList = document.getElementById('pub-international');
  const domList = document.getElementById('pub-domestic');
  if (!intlList && !domList) return;
  try {
    const { text, delimiter } = await fetchDataFile('data/publications');
    const rows = delimiter === '\t' ? parseTSV(text) : parseCSV(text);
    if (intlList) intlList.innerHTML = '';
    if (domList) domList.innerHTML = '';
    rows.forEach(r => {
      const cat = (r.category || '').toLowerCase();
      const li = renderPublicationItem(r);
      if (cat.includes('international')) {
        intlList && intlList.appendChild(li);
      } else {
        domList && domList.appendChild(li);
      }
    });
  } catch (_) {
    // ignore
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  const langMenu = document.getElementById('langMenu');
  const langSwitch = document.querySelector('.lang-switch');

  const setMenuState = (open) => {
    if (!langToggle || !langMenu) return;
    langToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    langMenu.classList.toggle('open', !!open);
  };
  langToggle?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = langMenu?.classList.contains('open');
    setMenuState(!isOpen);
  });
  langMenu?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const lang = target.getAttribute('data-lang-option');
    if (lang) {
      setLang(lang);
      setMenuState(false);
    }
  });
  document.addEventListener('click', (event) => {
    if (!langSwitch) return;
    if (event.target instanceof Node && !langSwitch.contains(event.target)) {
      setMenuState(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  });

  // 言語初期化
  applyTranslations();

  renderAbout();
  renderAffiliations();
  renderProjects();
  renderPublications();
});
