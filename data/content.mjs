// Portfolio copy by locale. Bibliography lives in publications.json.
export const links = {
  github: 'https://github.com/fog-zs', x: 'https://x.com/zs_fog/', zenn: 'https://zenn.dev/fog',
  academic: 'https://jglobal.jst.go.jp/detail?JGLOBAL_ID=202501021061357297',
  mistlib: 'https://github.com/tik-choco-lab/mistlib', mistnet: 'https://github.com/tik-choco-lab/mistnet',
  examples: 'https://github.com/tik-choco-lab/mistlib-examples', unity: 'https://github.com/tik-choco-lab/mistlib-unity',
  apps: 'https://tik-choco.github.io/tc-home/', education: 'https://tik-choco.com/ja/about/',
  learning: 'https://tik-choco.com/ja/', linkai: 'https://tik-choco.github.io/tc-website/',
  linkaiBooth: 'https://booth.pm/ja/items/7607803', yuna: 'https://booth.pm/ja/items/1764954', hiyoko: 'https://booth.pm/ja/items/2053649',
  mistlibRole: 'https://github.com/tik-choco-lab/mistlib/commit/614c27037fc7fbb35e3c04b2a872e1ded3ab0646',
  mistnetRole: 'https://github.com/tik-choco-lab/mistnet/commit/2b1b3563a63d2a3c6b711c4f61a09e7e6e6e0bd2'
};

export const locales = {
  ja: {
    lang: 'ja', path: '/', ogLocale: 'ja_JP',
    title: 'fog / 田中勇気 — P2P・分散システムの研究と仮想世界づくり',
    description: 'fog（曉霧 / 田中勇気）のポートフォリオ。P2P・分散システムの研究、mistlib・MistNet、零界オンライン、技術解説とゲーム制作を、担当範囲と公開資料とともに紹介します。',
    skip: '本文へ', nav: ['取り組み', '研究', '制作の背景', 'About'], theme: 'ダークテーマ',
    tagline: ['異世界で、', '暮らしたい。'],
    intro: 'P2P・分散システムを研究し、仮想世界の通信基盤とアプリケーションを開発しています。',
    affiliation: '大分大学大学院 工学研究科 博士後期課程', affiliationSource: '研究者プロフィール',
    actions: ['代表的な取り組み', '研究業績を見る'], avatarAlt: 'fogのアバター。猫耳のキャラクター', workTitle: 'つくっているもの', workIntro: '通信ライブラリや、その上で動くアプリケーション、異世界で暮らすためのゲームを開発しています。',
    purpose: '目的', role: '担当', design: '設計・技術', output: '公開しているもの', status: '現在の状態', source: 'GitHub', history: '開発履歴', official: '公式紹介', distribution: '配布ページ',
    projects: [
      {id:'mistlib', number:'01', kind:'P2P / RUST', name:'mistlib', subtitle:'広い3D共有空間のための通信基盤', badge:'開発中 / API未安定',
        purpose:'仮想空間の参加者同士が、近くの相手と情報を共有するためのP2P通信ライブラリ。',
        role:'Rustコア・ネイティブ版・WebAssembly版の実装とテストに取り組んでいます。',
        design:'READMEでは、位置とAOI（周囲の関心領域）に基づき近傍と各方向の接続相手を選択。直接つながらない相手へのメッセージは、参加者の接続網を通じて中継します。',
        output:'Rust / WebRTC DataChannel。ネイティブライブラリとブラウザ用WebAssembly、npm @tik-choco/mistlib。MPL-2.0。',
        status:'NostrリレーやSTUN、必要に応じてTURNを利用します。既定の接続数30は各ノードの接続予算です。全体の参加人数や保証性能を表しません。',
        sourceKey:'mistlib', roleKey:'mistlibRole'},
      {id:'mistnet', number:'02', kind:'P2P / UNITY', name:'MistNet', subtitle:'Unityのオブジェクトを通信でつなぐ', badge:'OSS / MIT',
        purpose:'Unity上の仮想空間で、参加者間の通信とオブジェクトの同期を扱うWebRTCベースのライブラリ。',
        role:'Unityの通信処理と、接続相手を選ぶ処理を実装しています。',
        design:'READMEでは位置・アニメーション・変数の同期やRPCを説明。初期接続にシグナリングサーバーを使い、必要に応じてTURNを利用します。',
        output:'Unity用ソースコードと導入手順。ライセンスはMIT。',
        status:'Rust版mistlibとは別の実装です。導入・設定の詳細はMistNetのREADMEを参照してください。',
        sourceKey:'mistnet', roleKey:'mistnetRole'},
      {id:'linkai', number:'03', kind:'GAME / WORLD', name:'零界オンライン', subtitle:'Linkai Online — 異世界で暮らすために', badge:'開発中',
        purpose:'魔法のある異世界で生活するオンラインゲームを目指しています。',
        role:'ゲームを開発しています。',
        design:'VRMアバターでの参加、村づくり、魔法開発など、目指している体験や機能を配布ページで紹介しています。',
        output:'公式サイトで作品を紹介し、BOOTHでランチャーを配布しています。',
        status:'現在開発中です。作品の紹介と配布物は、公式サイト・BOOTHにまとめています。',
        sourceKey:'linkai', secondaryKey:'linkaiBooth'}
    ],
    relatedTitle:'mistlibの関連資料', examplesText:'Python・Web・Unity向けクライアントと使用例。エンジンは別途必要です。Apache-2.0。READMEではWeb/WASM、Python・Unity/nativeの構成を説明しています。',
    unityText:'実験的なUnityバインディング。Unity 6000.0以降、Windows/Linux x86_64、macOS Apple silicon向け。Android・iOS・WebGLは非対応。バインディング等はApache-2.0、ネイティブエンジンはMPL-2.0。Editorの再実行にも制限があります。',
    appsTitle:'ブラウザアプリ', appsText:'通信ライブラリを使ったアプリも開発しています。TC Space・TC Town・TC Chat・TC Storageなどへの入口を、TC Homeにまとめています。', appsLink:'TC Homeでアプリを探す',
    researchTitle:'研究', researchIntro:'専門はP2P、分散システム、ネットワーク仮想環境。参加者の位置に応じた接続や、位置情報の共有・整合性を研究しています。',
    researchProfile:'研究者情報 / J-GLOBAL', pubGroups:{presentation:'最近の発表',international:'国際会議論文',workshop:'研究会発表',domestic:'国内会議録・発表概要集'},
    pubStatus:{'self-reported-presented':'発表済み','bibliography-verified':'会議録掲載','program-verified':'公式プログラム掲載'},
    selfNote:'SNPD 2026で発表しました。', presenter:'発表者', program:'2025-12-24 / セッション7', paperLink:'書誌・DOI', programLink:'公式プログラム',
    motivationTitle:'異世界で暮らしたい', motivationLead:'夢は、異世界で生活することです。',
    motivationBody:'その実現に向けて、参加者が通信や状態の共有を担う仕組みを研究し、通信ライブラリや仮想世界を開発しています。',
    motivationEnd:'人と出会い、何かをつくり、生活を積み重ねられる場所へ。通信の遅延、状態の整合性、不正への対策、世界を維持する仕組みは、これからも向き合う課題です。',
    moreTitle:'技術解説と、これまでの制作', educationTitle:'P2Pのしくみ', educationBadge:'技術解説 / 共同運営',
    educationBody:'Nawashiroと一緒に、P2Pのしくみを学べるサイトを運営しています。私は主に記事の執筆とTypeScriptのシミュレーション実装を担当しています。専門家でなくても、図や動きを通じて通信のしくみを理解できる解説を目指しています。', educationLink:'P2Pを図解と教材で学ぶ', educationSource:'運営・担当について',
    yunaTitle:'魔法使いユーナ', yunaDate:'2019-12-31 公開', yunaBody:'魔法で敵と戦うRPGです。私はシナリオ・プログラム・音楽を担当しました。キャラクターデザインはロロロ、広報はTuckyです。',
    hiyokoTitle:'ひよこ村', hiyokoDate:'2018 文化祭で公開', hiyokoBody:'大学生になって初めて制作したゲームです。2018年の文化祭で公開し、現在はBOOTHで配布しています。',
    aboutTitle:'fog / 曉霧', aboutBody:'fogです。曉霧とも名乗っています。研究では田中勇気 / Yuki Tanakaの名前を使っています。',
    contactTitle:'プロフィール・連絡先', contactBody:'日々の活動はGitHubやX、Zennに載せています。OSSに関する質問や不具合の報告は、各リポジトリのIssueへどうぞ。',
    top:'ページの先頭へ',
  },
  en: {
    lang:'en', path:'/en/', ogLocale:'en_US', title:'fog / Yuki Tanaka — P2P research, distributed systems & virtual worlds',
    description:'Research and projects by fog (曉霧 / Yuki Tanaka): P2P networking, mistlib, MistNet, Linkai Online, technical education and games, with contributions, status and public sources.',
    skip:'Skip to content', nav:['Projects','Research','Motivation','About'], theme:'Dark theme',
    tagline:['I want to live', 'in another world.'], intro:'I research P2P and distributed systems, and develop communication infrastructure and applications for virtual worlds.',
    affiliation:'Doctoral program, Graduate School of Engineering, Oita University', affiliationSource:'Researcher profile', actions:['Explore projects','View research'], avatarAlt:'fog’s avatar, a character with cat ears', workTitle:'What I’m building', workIntro:'I develop networking libraries, applications that use them, and a game for living in another world.',
    purpose:'Purpose', role:'My contribution', design:'Design & technology', output:'Available', status:'Current status', source:'GitHub', history:'Development history', official:'Official introduction', distribution:'Distribution page',
    projects:[
      {id:'mistlib',number:'01',kind:'P2P / RUST',name:'mistlib',subtitle:'Networking for large shared 3D spaces',badge:'In development / Unstable API',purpose:'A P2P communication library for participants in virtual spaces to share information with nearby peers.',role:'I work on the implementation and tests for the Rust core, native library and WebAssembly build.',design:'The README describes selecting peers by position and area of interest (AOI), including nearby peers and peers in each direction. Messages to other peers travel through the resulting network of connections.',output:'Rust / WebRTC DataChannel. Native library and browser WebAssembly; npm @tik-choco/mistlib. MPL-2.0.',status:'Uses Nostr relays, STUN and TURN when needed. The default of 30 is a connection budget per node, not a total participant limit or a performance guarantee.',sourceKey:'mistlib',roleKey:'mistlibRole'},
      {id:'mistnet',number:'02',kind:'P2P / UNITY',name:'MistNet',subtitle:'Connecting Unity objects across peers',badge:'Open source / MIT',purpose:'A WebRTC library for peer communication and object synchronization in Unity virtual spaces.',role:'I work on Unity networking and peer selection.',design:'The README describes position, animation and variable synchronization, and RPC. Initial connections use a signaling server; TURN can be used when necessary.',output:'Unity source code and setup documentation. MIT license.',status:'A separate implementation from Rust-based mistlib. Refer to the MistNet README for installation and configuration.',sourceKey:'mistnet',roleKey:'mistnetRole'},
      {id:'linkai',number:'03',kind:'GAME / WORLD',name:'Linkai Online',subtitle:'零界オンライン — working toward life in another world',badge:'In development',purpose:'An online game aiming to offer everyday life in a fantasy world with magic.',role:'I am working on the game’s development.',design:'I describe the experiences and features we are working toward, including VRM avatars, village building and magic development, on the distribution page.',output:'I introduce the game on its official site and distribute the launcher on BOOTH.',status:'The game is in development. The official site and BOOTH page have the introduction and available downloads.',sourceKey:'linkai',secondaryKey:'linkaiBooth'}
    ],
    relatedTitle:'Explore the mistlib ecosystem', examplesText:'Python, Web and Unity clients and usage examples. Requires a separate engine build. Apache-2.0. The README describes Web/WASM and Python or Unity/native setups.', unityText:'Experimental Unity bindings. Unity 6000.0+, Windows/Linux x86_64 and Apple silicon macOS. Android, iOS and WebGL are unsupported. Bindings and samples: Apache-2.0; native engine: MPL-2.0. Repeated Editor sessions also have limitations.',
    appsTitle:'Browser applications', appsText:'I also develop applications using the networking library. TC Home brings together links to TC Space, TC Town, TC Chat, TC Storage and more.',appsLink:'Browse apps on TC Home',
    researchTitle:'Research',researchIntro:'My focus is P2P, distributed systems and networked virtual environments: selecting connections based on participant positions, and sharing consistent position information.',researchProfile:'Researcher profile / J-GLOBAL',pubGroups:{presentation:'Recent presentations',international:'International conference papers',workshop:'Research workshop presentations',domestic:'Domestic proceedings & abstracts'},pubStatus:{'self-reported-presented':'Presented','bibliography-verified':'Published in proceedings','program-verified':'Listed in official program'},selfNote:'I presented this work at SNPD 2026.',presenter:'Presenter',program:'2025-12-24 / Session 7',paperLink:'Bibliography / DOI',programLink:'Official program',motivationTitle:'Why I want to live in another world',motivationLead:'My dream is to live in another world.',motivationBody:'Toward that goal, I research ways for participants to handle communication and shared state, and develop networking libraries and virtual worlds.',motivationEnd:'A place to meet people, make things and build a life. Latency, state consistency, abuse prevention and maintaining a world remain challenges to work on.',
    moreTitle:'Technical writing and earlier games',educationTitle:'P2Pのしくみ / How P2P works',educationBadge:'Technical education / Joint operation',educationBody:'I run this P2P learning site with Nawashiro. I mainly write the articles and implement the TypeScript simulations. I want to make networking understandable through diagrams and interactive examples, even for readers outside the field.',educationLink:'Explore the P2P learning site',educationSource:'Operators & contributions',yunaTitle:'魔法使いユーナ',yunaDate:'Released 2019-12-31',yunaBody:'An RPG about fighting with magic. I wrote the scenario, programmed the game and made the music. Character design is by ロロロ, and publicity by Tucky.',hiyokoTitle:'ひよこ村',hiyokoDate:'Released at a school festival in 2018',hiyokoBody:'The first game I made after starting university. I released it at a school festival in 2018; it is now available on BOOTH.',
    aboutTitle:'fog / 曉霧',aboutBody:'I’m fog, also known as 曉霧. I publish research under the name Yuki Tanaka / 田中勇気.',contactTitle:'Profiles & contact',contactBody:'I share my work on GitHub, X and Zenn. For questions and bug reports about my open-source work, please use the relevant repository’s Issues.',top:'Back to top'
  },
  zh: {
    lang:'zh-Hans',path:'/zh/',ogLocale:'zh_CN',title:'fog / 田中勇気 — P2P、分布式系统研究与虚拟世界开发',description:'fog（曉霧 / 田中勇気）的个人作品集：P2P研究、mistlib、MistNet、零界在线、技术讲解与游戏制作，并列明负责范围、项目状态及公开依据。',
    skip:'跳转至正文',nav:['项目','研究','创作背景','关于'],theme:'深色主题',tagline:['我想在','异世界生活。'],intro:'我研究P2P与分布式系统，开发虚拟世界的通信基础设施和应用。',affiliation:'大分大学大学院 工学研究科 博士后期课程',affiliationSource:'研究者资料',actions:['查看代表项目','查看研究成果'],avatarAlt:'fog的虚拟形象，一位猫耳角色',workTitle:'我正在做的项目',workIntro:'我开发通信库、使用这些库的应用，以及为了在异世界生活而制作的游戏。',purpose:'目的',role:'负责范围',design:'设计与技术',output:'成果物',status:'当前状态',source:'GitHub',history:'开发记录',official:'官方介绍',distribution:'发布页面',
    projects:[
      {id:'mistlib',number:'01',kind:'P2P / RUST',name:'mistlib',subtitle:'面向大型共享3D空间的通信基础',badge:'开发中 / API尚未稳定',purpose:'让虚拟空间中的参与者与附近节点共享信息的P2P通信库。',role:'我参与Rust核心、原生库与WebAssembly版的实现和测试。',design:'README说明：根据位置和AOI（周围的关注区域）选择附近及各方向的连接对象。发送给其他节点的消息经由参与者构成的连接网络转发。',output:'Rust / WebRTC DataChannel。原生库与浏览器WebAssembly，npm @tik-choco/mistlib。MPL-2.0。',status:'使用Nostr中继、STUN及必要时的TURN。默认连接数30是每个节点的连接预算，不是总参与人数或性能保证。',sourceKey:'mistlib',roleKey:'mistlibRole'},
      {id:'mistnet',number:'02',kind:'P2P / UNITY',name:'MistNet',subtitle:'通过通信连接Unity中的对象',badge:'开源 / MIT',purpose:'用于Unity虚拟空间中节点通信及对象同步的WebRTC库。',role:'我参与Unity通信及连接对象选择的实现。',design:'README介绍了位置、动画、变量同步和RPC。初次建立连接使用信令服务器，必要时可使用TURN。',output:'Unity源码和安装说明。MIT许可。',status:'与Rust版mistlib是不同的实现。安装及配置详情见MistNet README。',sourceKey:'mistnet',roleKey:'mistnetRole'},
      {id:'linkai',number:'03',kind:'GAME / WORLD',name:'零界オンライン',subtitle:'Linkai Online — 迈向异世界生活',badge:'开发中',purpose:'目标是在有魔法的异世界中生活的在线游戏。',role:'我正在参与这款游戏的开发。',design:'在发布页面中，我介绍了VRM形象、村庄建设、魔法开发等希望实现的体验与功能。',output:'我在官网介绍作品，并在BOOTH发布启动器。',status:'游戏仍在开发中。作品介绍与可下载的内容整理在官网及BOOTH页面。',sourceKey:'linkai',secondaryKey:'linkaiBooth'}
    ],
    relatedTitle:'mistlib相关资料',examplesText:'Python、Web、Unity客户端及使用示例。需要另行取得引擎。Apache-2.0。README说明了Web/WASM以及Python或Unity/native的配置。',unityText:'实验性Unity绑定。要求Unity 6000.0以上，面向Windows/Linux x86_64和Apple silicon macOS。不支持Android、iOS、WebGL。绑定等采用Apache-2.0，原生引擎采用MPL-2.0。重复运行Editor会话也有限制。',appsTitle:'浏览器应用',appsText:'我也在开发使用通信库的应用。TC Home汇集了TC Space、TC Town、TC Chat、TC Storage等应用的入口。',appsLink:'在TC Home浏览应用',
    researchTitle:'研究',researchIntro:'研究重点是P2P、分布式系统和网络虚拟环境：根据参与者位置选择连接，以及位置信息的共享与一致性。',researchProfile:'研究者资料 / J-GLOBAL',pubGroups:{presentation:'近期报告',international:'国际会议论文',workshop:'研究会报告',domestic:'国内会议录与摘要集'},pubStatus:{'self-reported-presented':'已作报告','bibliography-verified':'会议录刊载','program-verified':'官方日程列载'},selfNote:'我在SNPD 2026报告了这项研究。',presenter:'报告人',program:'2025-12-24 / 第7场',paperLink:'书目 / DOI',programLink:'官方日程',motivationTitle:'想在异世界生活',motivationLead:'我的梦想是在异世界生活。',motivationBody:'为此，我研究让参与者承担通信和状态共享的机制，并开发通信库与虚拟世界。',motivationEnd:'一个可以相遇、创造、积累生活的地方。通信延迟、状态一致性、防止作弊以及维持世界的机制，仍是需要继续面对的课题。',
    moreTitle:'技术讲解与过去的游戏作品',educationTitle:'P2Pのしくみ / P2P的工作原理',educationBadge:'技术讲解 / 共同运营',educationBody:'我与Nawashiro共同运营这个P2P学习网站。我主要负责文章撰写和TypeScript模拟程序的实现，希望通过图解与交互示例，让非专业读者也能理解通信机制。',educationLink:'通过图解与教材学习P2P',educationSource:'运营与分工',yunaTitle:'魔法使いユーナ',yunaDate:'2019-12-31 发布',yunaBody:'这是一款用魔法战斗的RPG。我负责剧本、程序和音乐，角色设计由ロロロ负责，宣传由Tucky负责。',hiyokoTitle:'ひよこ村',hiyokoDate:'2018年文化祭公开',hiyokoBody:'这是我进入大学后制作的第一款游戏，2018年在文化祭公开，现在可在BOOTH下载。',
    aboutTitle:'fog / 曉霧',aboutBody:'我是fog，也叫曉霧。发表研究时使用田中勇気 / Yuki Tanaka这个名字。',contactTitle:'个人资料与联系',contactBody:'我在GitHub、X和Zenn分享日常的开发活动。关于开源项目的问题或错误报告，欢迎使用相应仓库的Issue。',top:'返回顶部'
  }
};
