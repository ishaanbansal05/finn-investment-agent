import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
// Keep the existing ignored local configuration usable under both runtimes.
const env={...process.env};
try {
  const text=await readFile(new URL('../.dev.vars',import.meta.url),'utf8');
  for(const line of text.split(/\r?\n/)){
    const match=line.match(/^(AI_API_KEY|AI_BASE_URL|AI_MODEL|DEMO_ACCESS_CODE)=(.*)$/);
    if(match && !env[match[1]])env[match[1]]=match[2].trim().replace(/^["']|["']$/g,'');
  }
} catch(error) { if(error.code!=='ENOENT')throw error; }
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--port','5173'],{env,stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
