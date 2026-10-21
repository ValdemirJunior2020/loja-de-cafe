import {readFile,copyFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,basename,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const target=join(root,'apps/web/public/images/approved');
const allowedIds=new Set(['target-bodum-silver','target-bodum-black','target-bodum-recharge','walmart-hb-12']);
function safeFile(f){if(typeof f!=='string'||!f||f.includes('..')||f.includes('\\')||f.startsWith('/')||f.includes(':'))throw Error('Invalid image path');return f;}
export async function stageImageManifest(input,baseDir){
 if(!Array.isArray(input))throw Error('Expected array');
 const out=[];const seen=new Set();
 for(const p of input){
 if(!p||!allowedIds.has(p.productId)||seen.has(p.productId))throw Error('Unknown or duplicated product ID');
 if(p.commercialReuseAuthorized!==true||!p.rightsHolder||!p.permissionEvidence)throw Error('Commercial image rights not verified for '+p.productId);
 if(!/^[-\w. /]{3,200}$/.test(p.permissionEvidence))throw Error('Invalid permission reference');
 const f=safeFile(p.file);const ext=extname(f).toLowerCase();if(!['.jpg','.jpeg','.png','.webp'].includes(ext))throw Error('Only jpg png webp supported');
 const full=resolve(baseDir,f);if(!full.startsWith(resolve(baseDir)+'/'))throw Error('Image outside source folder');
 seen.add(p.productId);out.push({productId:p.productId,source:full,target:join(target,p.productId+ext),publicPath:'/images/approved/'+p.productId+ext,rightsHolder:p.rightsHolder,permissionEvidence:p.permissionEvidence});
 }
 return out;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const manifestPath=process.argv[2],photosPath=process.argv[3];
 if(!manifestPath||!photosPath){console.error('Usage: node scripts/import-approved-images.mjs photo-manifest.json path/to/photo-files');process.exitCode=2;}
 else try{
 const manifest=JSON.parse(await readFile(manifestPath,'utf8'));const rows=await stageImageManifest(manifest,photosPath);
 await mkdir(target,{recursive:true});
 for(const r of rows)await copyFile(r.source,r.target);
 await writeFile(join(target,'manifest.json'),JSON.stringify(rows.map(({source,target,...rest})=>rest),null,2)+'\n');
 console.log('Imported '+rows.length+' approved images. To publish, update product image paths after review.');
 }catch(e){console.error(e.message);process.exitCode=1;}
}
