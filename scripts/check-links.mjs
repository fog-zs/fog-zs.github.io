// HTTP reachability only; a 200 response does not prove the application works.
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const urls=[...new Set([...html.matchAll(/href="(https:[^"]+)"/g)].map(m=>m[1].replace(/&amp;/g,'&')).filter(u=>new URL(u).hostname!=='fog.tik-choco.com'))];
const results=[];
async function worker(){
  while(urls.length){
    const url=urls.shift();
    try {
      const r=await fetch(url,{signal:AbortSignal.timeout(20000)});
      await r.body?.cancel();
      results.push({url,status:r.status,finalUrl:r.url});
    }catch(e){results.push({url,error:e.message});}
  }
}
await Promise.all([worker(),worker(),worker()]);
results.sort((a,b)=>a.url.localeCompare(b.url)).forEach(r=>console.log(JSON.stringify(r)));
console.log('HTTP responses only. No browser or peer communication tests performed.');
