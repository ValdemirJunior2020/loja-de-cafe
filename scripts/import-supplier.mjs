import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { minimumPriceCents } from '../packages/shared/pricing.mjs';

const categories = new Set(['machines','grinders','accessories','espresso-tools','mugs','storage','cleaning','frothers']);
const money = value => {
  if (typeof value !== 'string' || !/^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/.test(value.trim())) throw new Error('Prices must be unsigned decimal strings in USD');
  const [d,c=''] = value.trim().split('.');
  const cents=Number(d)*100+Number(c.padEnd(2,'0'));
  if(!Number.isSafeInteger(cents)) throw new Error('Amount too large');
  return cents;
};
export function stageProducts(rows) {
  if(!Array.isArray(rows) || rows.length>500) throw new Error('Expected up to 500 products');
  const ids=new Set();
  return rows.map((r,index)=>{
    if(!r || typeof r !== 'object') throw new Error('Invalid product '+index);
    for(const key of ['supplier_id','title_en','title_pt','category','supplier_url','purchase_cost_usd','supplier_shipping_usd','outbound_shipping_usd','estimated_fees_usd','returns_allowance_usd'])
      if(typeof r[key]!=='string' || !r[key].trim()) throw new Error('Missing '+key+' at row '+(index+1));
    if(!categories.has(r.category)) throw new Error('Invalid coffee category');
    const url = new URL(r.supplier_url);
    if(url.protocol!=='https:' || !['temu.com','www.temu.com'].includes(url.hostname)) throw new Error('Only HTTPS Temu product URLs accepted');
    if(!/^[a-zA-Z0-9_-]{1,80}$/.test(r.supplier_id) || ids.has(r.supplier_id)) throw new Error('Invalid or duplicate supplier ID');
    ids.add(r.supplier_id);
    const variableCostsCents = ['purchase_cost_usd','supplier_shipping_usd','outbound_shipping_usd','estimated_fees_usd','returns_allowance_usd'].reduce((sum,key)=>sum+money(r[key]),0);
    const processorFeeBasisPoints = r.processor_fee_basis_points===undefined?350:Number(r.processor_fee_basis_points);
    const processorFixedFeeCents = r.processor_fixed_fee_usd===undefined?49:money(r.processor_fixed_fee_usd);
    const minimumRetailCents=minimumPriceCents({variableCostsCents,processorFeeBasisPoints,processorFixedFeeCents});
    return {id:'temu-'+r.supplier_id,supplier:'Temu',supplierUrl:url.href,category:r.category,title:{en:r.title_en.trim(),pt:r.title_pt.trim()},purchaseCostCents:money(r.purchase_cost_usd),variableCostsCents,minimumRetailCents,currency:'USD',status:'DRAFT',supplierAuthorized:false,imageRightsVerified:false,complianceVerified:false,stockVerified:false,purchasable:false,source:'ADMIN_SUPPLIED',lastVerifiedAt:null};
  });
}
if(process.argv[1] && fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 const path=process.argv[2],output=process.argv[3];
 if(!path || !output) {console.error('Usage: node scripts/import-supplier.mjs approved-products.json staged-products.json');process.exitCode=2;}
 else {
   try{
     const input=JSON.parse(await readFile(path,'utf8'));
     const rows=stageProducts(input);
     await writeFile(output,JSON.stringify({schemaVersion:1,importedAt:new Date().toISOString(),products:rows},null,2)+'\n',{flag:'wx',mode:0o600});
     console.log('Staged '+rows.length+' product(s) in DRAFT; no products published.');
   }catch(error){console.error('Import failed:',error.message);process.exitCode=1;}
 }
}
