import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const cli=process.argv[2];if(!cli)throw new Error('Pass the installed Vercel CLI entrypoint.');
const text=await readFile(new URL('../.dev.vars',import.meta.url),'utf8');
const vars=Object.fromEntries(text.split(/\r?\n/).filter(l=>/^(AI_API_KEY|AI_BASE_URL|AI_MODEL)=/.test(l)).map(l=>{const at=l.indexOf('=');return[l.slice(0,at),l.slice(at+1).trim().replace(/^["']|["']$/g,'')];}));
if(!vars.AI_API_KEY)throw new Error('The local Hyde API key is missing.');
for(const key of ['AI_API_KEY','AI_BASE_URL','AI_MODEL']){
 const value=vars[key];if(!value)continue;
 const r=spawnSync(process.execPath,[cli,'env','add',key,'--environment','production,preview',key==='AI_API_KEY'?'--sensitive':'--no-sensitive','--yes'],{input:value+'\n',encoding:'utf8',timeout:60000});
 // Never echo CLI output: it can contain a piped value in provider error messages.
 if(r.status!==0)throw new Error(`Could not configure ${key} (exit ${r.status}).`);
 console.log(`${key}: configured for production and preview${key==='AI_API_KEY'?' as a secret':''}.`);
}
