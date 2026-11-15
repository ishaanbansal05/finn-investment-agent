import { runtimeEnvironment } from '@/lib/runtime-env';
import type { AIConfig } from './research';
export function aiConfig():AIConfig{
  const e=runtimeEnvironment();
  return {key:e.AI_API_KEY,baseUrl:e.AI_BASE_URL,model:e.AI_MODEL};
}
const requests=new Map<string,{count:number;reset:number}>();
export function gate(request:Request):Response|null{
  const e=runtimeEnvironment();
  if(e.DEMO_ACCESS_CODE && request.headers.get('x-demo-code')!==e.DEMO_ACCESS_CODE)return Response.json({error:'This demo requires an access code for live research.'},{status:401});
  const ip=request.headers.get('cf-connecting-ip')||request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'local';const now=Date.now();
  if(requests.size>500)for(const[k,v]of requests)if(v.reset<now)requests.delete(k);
  const entry=requests.get(ip);if(entry&&entry.reset>now){if(entry.count>=12)return Response.json({error:'Research limit reached. Please retry in a few minutes.'},{status:429});entry.count++;}else requests.set(ip,{count:1,reset:now+600000});
  return null;
}
