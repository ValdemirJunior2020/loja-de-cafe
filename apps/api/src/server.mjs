import http from 'node:http';
import {pathToFileURL} from 'node:url';
import {timingSafeEqual} from 'node:crypto';
import {minimumPriceCents} from '../../../packages/shared/pricing.mjs';
const demo=[{id:'demo-espresso',status:'DEMO_ONLY'},{id:'demo-drip',status:'DEMO_ONLY'}];
function validToken(input){const expected=process.env.ADMIN_PRICING_TOKEN;if(!expected||expected.length<32||!input?.startsWith('Bearer '))return false;const actual=Buffer.from(input.slice(7));const right=Buffer.from(expected);return actual.length===right.length&&timingSafeEqual(actual,right)}
function parseMoney(value){if(typeof value!=='string'||!/^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/.test(value))throw Error('INVALID_COST');const [a,b='']=value.split('.');const n=Number(a)*100+Number(b.padEnd(2,'0'));if(!Number.isSafeInteger(n))throw Error('INVALID_COST');return n}
export function handler(req,res){
 const origin=req.headers.origin;const allowed=process.env.FRONTEND_URL?.replace(/\/$/,'');
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',"default-src 'none'; frame-ancestors 'none'");
 if(origin&&origin===allowed){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization')}
 const send=(code,body)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(body))};
 if(origin&&origin!==allowed) return send(403,{error:'ORIGIN_NOT_ALLOWED'});
 const pathname=new URL(req.url||'/', 'http://localhost').pathname;
 if(req.method==='OPTIONS') return send(204,null);
 if(pathname==='/api/admin/price'&&req.method==='POST'){
   if(!validToken(req.headers.authorization))return send(401,{error:'ADMIN_AUTH_REQUIRED'});
   let raw='';req.on('data',chunk=>{raw+=chunk;if(raw.length>4096)req.destroy()});
   req.on('end',()=>{try{const d=JSON.parse(raw);const costs=['productCost','shippingCost','returnsAllowance','otherCosts'].map(k=>parseMoney(d[k]));const total=costs.reduce((a,b)=>a+b,0);
     const price=minimumPriceCents({variableCostsCents:total,processorFeeBasisPoints:350,processorFixedFeeCents:49});
     send(200,{minimumPriceCents:price,marginBasisPoints:5000,mode:'ESTIMATE_ONLY'});
   }catch{send(400,{error:'INVALID_COST'})}});return;
 }
 if(req.method!=='GET')return send(405,{error:'NOT_AVAILABLE'});
 if(pathname==='/health')return send(200,{status:'ok'});
 if(pathname==='/api/status')return send(200,{mode:'DEMO_ONLY',checkoutEnabled:false,supplierImportEnabled:false,authenticationEnabled:false,databaseConnected:false,adminPricingEnabled:!!process.env.ADMIN_PRICING_TOKEN});
 if(pathname==='/api/products')return send(200,{products:demo,mode:'DEMO_ONLY',purchasable:false});
 return send(404,{error:'NOT_FOUND'})
}
export function startServer(port=Number(process.env.PORT||3001)){if(!Number.isSafeInteger(port)||port<0||port>65535)throw Error('Invalid PORT');return http.createServer(handler).listen(port,'0.0.0.0')}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)startServer();
