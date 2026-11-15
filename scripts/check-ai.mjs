import {readFile} from 'node:fs/promises';
const vars=Object.fromEntries((await readFile(new URL('../.dev.vars',import.meta.url),'utf8')).split(/\r?\n/).filter(l=>/^[A-Z_]+=/.test(l)).map(l=>{const at=l.indexOf('=');return[l.slice(0,at),l.slice(at+1).trim().replace(/^["']|["']$/g,'')];}));
try{
const r=await fetch(`${vars.AI_BASE_URL}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${vars.AI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:vars.AI_MODEL,max_tokens:600,messages:[{role:'user',content:'Reply with exactly: FINN connected'}]}),signal:AbortSignal.timeout(30000)});
const d=await r.json();console.log(JSON.stringify({status:r.status,model:vars.AI_MODEL,connected:r.ok&&Boolean(d.choices?.[0]?.message?.content),response:r.ok?d.choices?.[0]?.message?.content:undefined}));
}catch(e){console.log(JSON.stringify({connected:false,error:e.message}));}
