import {readFile,writeFile} from 'node:fs/promises';
const table=new Map();for(let i=0;i<256;i++)table.set(String.fromCodePoint(i),i);
const special={128:'€',130:'‚',131:'ƒ',132:'„',133:'…',134:'†',135:'‡',136:'ˆ',137:'‰',138:'Š',139:'‹',140:'Œ',142:'Ž',145:'‘',146:'’',147:'“',148:'”',149:'•',150:'–',151:'—',152:'˜',153:'™',154:'š',155:'›',156:'œ',158:'ž',159:'Ÿ'};for(const[b,c]of Object.entries(special))table.set(c,Number(b));
for(const file of ['components/finn-app.tsx','lib/research.ts']){
 const text=await readFile(file,'utf8');if(!/[Ââ]/.test(text))continue;
 const bytes=Uint8Array.from([...text].filter(c=>c!=='\ufeff').map(c=>{if(!table.has(c))throw new Error(`Unmapped codepoint in ${file}`);return table.get(c);}));
 await writeFile(file,new TextDecoder('utf-8',{fatal:true}).decode(bytes));console.log(`Repaired ${file}`);
}
