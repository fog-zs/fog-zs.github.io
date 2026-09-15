# fog — portfolio

GitHub Pagesで公開する日英中のポートフォリオ： https://fog.tik-choco.com/

## ローカル確認

Node.js 20以降。外部依存のインストールは不要です。

```sh
npm run build
npm run check
npm run preview
```

プレビューは http://127.0.0.1:4173/ 。英語は `/en/`、中国語は `/zh/`。
原稿変更後はビルドし直してブラウザを再読み込みしてください。

## 編集

- `data/content.mjs`：日英中の掲載原稿とリンク。
- `data/publications.json`：業績の書誌情報。
- `styles.css` / `script.js`：表示と操作。

生成したHTML・CSV・sitemap・robotsもcommitします。
外部リンクの確認：`node scripts/check-links.mjs`。
