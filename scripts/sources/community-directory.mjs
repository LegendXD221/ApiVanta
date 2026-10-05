const USER_AGENT="ApiVantaCatalog/1.0 (+https://github.com/LegendXD221/ApiVanta)";
const MAX_BYTES=3_000_000;

const decode=s=>String(s||"")
  .replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">")
  .replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();
const cleanUrl=value=>{try{const u=new URL(value);return ["http:","https:"].includes(u.protocol)?u.href:""}catch{return ""}};
const markdownLink=cell=>{const m=String(cell||"").match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/i);return m?{label:decode(m[1]),url:cleanUrl(m[2])}:null};
const plainUrl=cell=>{const m=String(cell||"").match(/https?:\/\/[^\s|)>]+/i);return m?cleanUrl(m[0]):""};
const stripMarkdown=cell=>decode(String(cell||"").replace(/!\[[^\]]*\]\([^)]*\)/g,"").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/[`*_~]/g,""));

async function readText(url){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15_000);
  try{
    const response=await fetch(url,{headers:{"user-agent":USER_AGENT,"accept":"text/markdown,text/html;q=0.9,*/*;q=0.5"},signal:controller.signal});
    if(!response.ok)throw Error(`${response.status} ${response.statusText}`);
    const length=Number(response.headers.get("content-length")||0);
    if(length>MAX_BYTES)throw Error(`response exceeds ${MAX_BYTES} bytes`);
    const text=await response.text();
    if(Buffer.byteLength(text,"utf8")>MAX_BYTES)throw Error(`response exceeds ${MAX_BYTES} bytes`);
    return text;
  }finally{clearTimeout(timer)}
}

function fromMarkdown(text,url){
  const found=[];
  for(const line of text.split(/\r?\n/)){
    if(!/^\s*\|/.test(line)||/^\s*\|\s*:?-{2,}/.test(line))continue;
    const cells=line.split("|").slice(1,-1).map(x=>x.trim());
    if(cells.length<2||/^api$/i.test(stripMarkdown(cells[0])))continue;
    const first=markdownLink(cells[0]);
    const name=first?.label||stripMarkdown(cells[0]);
    const docs=first?.url||plainUrl(cells[0]);
    const description=stripMarkdown(cells[1]);
    if(!name||!docs||name.length>160||!description||description.length>500)continue;
    found.push({name,description,docs,base_url:docs,type:"REST",auth:"Unknown",pricing:"Unknown",https:docs.startsWith("https://"),cors:"Unknown",tags:["community-listed"],source_url:url,license:"MIT",unofficial:true,officiality:"unofficial"});
  }
  return found;
}

function fromHtml(text,url){
  const found=[];
  const html=text.replace(/<!--[\s\S]*?-->/g," ");
  for(const match of html.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
    const docs=cleanUrl(match[1]);
    const name=decode(match[2]);
    if(!docs||!name||name.length>160||!/(api|rest|graphql|endpoint|docs|developer)/i.test(`${name} ${docs}`))continue;
    found.push({name,description:`Community-listed API discovered from ${url}.`,docs,base_url:docs,type:"REST",auth:"Unknown",pricing:"Unknown",https:docs.startsWith("https://"),cors:"Unknown",tags:["community-listed"],source_url:url,license:"See source terms",unofficial:true,officiality:"unofficial"});
  }
  return found;
}

export async function fetchSource(url){
  const text=await readText(url);
  const markdown=fromMarkdown(text,url);
  const rows=markdown.length?markdown:fromHtml(text,url);
  const unique=new Map(rows.map(x=>[`${x.name.toLowerCase()}|${x.base_url.toLowerCase()}`,x]));
  return [...unique.values()];
}
