#!/usr/bin/env node
import fs from "node:fs/promises";
const file="data/apis.json";
const apis=JSON.parse(await fs.readFile(file,"utf8"));
const timeout=7000;
async function check(url){
  if(!url) return {status:"unknown"};
  const start=performance.now();
  try{
    const r=await fetch(url,{method:"HEAD",redirect:"follow",signal:AbortSignal.timeout(timeout),headers:{"user-agent":"ApiVanta/2.0 verifier"}});
    return {status:r.ok?"online":"offline",http_status:r.status,response_ms:Math.round(performance.now()-start)};
  }catch{
    try{
      const r=await fetch(url,{method:"GET",redirect:"follow",signal:AbortSignal.timeout(timeout),headers:{"user-agent":"ApiVanta/2.0 verifier"}});
      return {status:r.ok?"online":"offline",http_status:r.status,response_ms:Math.round(performance.now()-start)};
    }catch{return {status:"offline",response_ms:Math.round(performance.now()-start)}}
  }
}
for(let i=0;i<apis.length;i++){
  const a=apis[i];
  const result=await check(a.base_url||a.docs||a.website);
  Object.assign(a,result,{last_checked:new Date().toISOString()});
  if(i%25===0) console.log(`${i+1}/${apis.length}`);
}
await fs.writeFile(file,JSON.stringify(apis,null,2)+"\n");
