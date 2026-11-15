import {spawnSync} from 'node:child_process';
const lookup=spawnSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\nusername=ishaanbansal05\n\n',encoding:'utf8',env:{...process.env,GCM_INTERACTIVE:'Never'}});
const token=lookup.stdout?.split(/\r?\n/).find(l=>l.startsWith('password='))?.slice(9);
if(!token){console.log(JSON.stringify({authenticated:false}));process.exit(0);}
const r=await fetch('https://api.github.com/user',{headers:{Authorization:`Bearer ${token}`,'User-Agent':'FINN-submission','X-GitHub-Api-Version':'2022-11-28'}});
const d=await r.json();console.log(JSON.stringify({authenticated:r.ok,login:d.login,status:r.status}));
