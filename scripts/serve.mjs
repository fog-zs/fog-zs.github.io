import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=new URL('../',import.meta.url);
const allowed=new Set(['index.html','en/index.html','zh/index.html','404.html','styles.css','script.js','static/fog.png','static/fog-icon.png','robots.txt','sitemap.xml','data/publications.json',...['publications','projects','affiliations'].flatMap(n=>['','.en','.zh'].map(l=>`data/${n}${l}.csv`))]);
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',json:'application/json; charset=utf-8',png:'image/png',txt:'text/plain; charset=utf-8',xml:'application/xml; charset=utf-8',csv:'text/csv; charset=utf-8'};
createServer(async(req,res)=>{
  try {
    const path=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const file=path.slice(1)+(path.endsWith('/')?'index.html':'');
    const found=allowed.has(file),target=found?file:'404.html';
    const body=await readFile(fileURLToPath(new URL(target,root)));
    res.writeHead(found?200:404,{'Content-Type':types[target.split('.').pop()]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:body);
  } catch {res.writeHead(400);res.end('Bad request');}
}).listen(4173,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:4173 (Ctrl+C to stop)'));
