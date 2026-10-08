import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const files=fs.readdirSync(root,{recursive:true}).filter(file=>file.endsWith('.html')&&!file.startsWith('.git'));
const issues=[];
for(const file of files){
 const source=fs.readFileSync(path.join(root,file),'utf8');
 const ids=[...source.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
 for(const id of new Set(ids)) if(ids.filter(value=>value===id).length>1) issues.push(`${file}: duplicate id ${id}`);
 for(const match of source.matchAll(/(?:href|src)="([^"#]+)"/g)){
  const url=match[1]; if(/^(https?:|tel:|mailto:|data:|\/\/)/.test(url))continue;
  const target=path.resolve(url.startsWith('/')?root:path.dirname(path.join(root,file)),'.'+(url.startsWith('/')?url:'/'+url).split(/[?#]/)[0]);
  if(!fs.existsSync(target))issues.push(`${file}: missing local target ${url}`);
 }
 for(const match of source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  try{JSON.parse(match[1])}catch{issues.push(`${file}: invalid structured data`)}
 }
}
JSON.parse(fs.readFileSync(path.join(root,'reviews.json'),'utf8'));
if(issues.length){console.error([...new Set(issues)].join('\n'));process.exitCode=1}else console.log(`Validated ${files.length} pages: local assets, links, unique IDs, and structured data.`);
