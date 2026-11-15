import {readFile,writeFile} from 'node:fs/promises';
const file=process.argv[2];if(!file)throw new Error('Pass the actual Codex session JSONL path.');
const rows=(await readFile(file,'utf8')).split('\n').filter(Boolean).map(l=>JSON.parse(l));
const out=['# Actual build conversation\n','Exported from the local Codex session on 15 November 2026. Contains visible user/assistant messages only. System/developer instructions, internal reasoning and raw tool payloads are excluded. Local personal paths are shortened. Secret-like values are redacted. This record ends at export time; subsequent publication status is recorded in the repository.\n'];
let count=0;
for(const row of rows){const p=row.payload;if(row.type!=='event_msg'||!['user_message','agent_message'].includes(p?.type))continue;if(p.type==='agent_message'&&!['commentary','final'].includes(p.phase))continue;
 const role=p.type==='user_message'?'user':'assistant';let text=p.message||'';if(!text.trim())continue;
 if(role==='user'&&/^<(environment_context|external_ide_context|external_codex_apps)/.test(text.trim()))continue;
 text=text.replace(/C:\\Users\\BANSAL/gi,'[local-user]').replace(/sk-[A-Za-z0-9_-]{12,}/g,'[REDACTED API KEY]').replace(/gh[pousr]_[A-Za-z0-9_]+/g,'[REDACTED GITHUB TOKEN]');
 out.push(`## ${++count}. ${role==='user'?'Ishaan':'Codex'}\n\n${text}\n`);
}
await writeFile('docs/BUILD_CONVERSATION.md',out.join('\n'));console.log(`Exported ${count} visible messages.`);
