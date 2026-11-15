import {readFile,writeFile} from 'node:fs/promises';
// npm on Windows can omit these exact-version children of an optional WASI
// package. Linux npm ci still validates them before deciding what to install.
const filename=new URL('../package-lock.json',import.meta.url);
const lock=JSON.parse(await readFile(filename,'utf8'));
for(const name of ['core','runtime']){
 const metadata=await(await fetch(`https://registry.npmjs.org/@emnapi/${name}/1.10.0`)).json();
 if(metadata.version!=='1.10.0'||!metadata.dist?.integrity)throw new Error('Registry metadata validation failed.');
 lock.packages[`node_modules/@rolldown/binding-wasm32-wasi/node_modules/@emnapi/${name}`]={version:metadata.version,resolved:metadata.dist.tarball,integrity:metadata.dist.integrity,dev:true,optional:true,license:metadata.license,dependencies:metadata.dependencies};
}
await writeFile(filename,JSON.stringify(lock,null,2)+'\n');
console.log('Recorded the two required optional WASI dependency lock entries.');
