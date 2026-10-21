import React,{useState} from 'react';
const API='https://loja-de-cafe-api.onrender.com';
type Quote={minimumPriceCents:number,marginBasisPoints:number,mode:string};
export default function Admin(){
 const[token,setToken]=useState('');const[cost,setCost]=useState('');const[shipping,setShipping]=useState('');const[returns,setReturns]=useState('');const[fees,setFees]=useState('');const[result,setResult]=useState<Quote|null>(null);const[error,setError]=useState('');
 async function calculate(e:React.FormEvent){e.preventDefault();setResult(null);setError('');
 try{const res=await fetch(API+'/api/admin/price',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({productCost:cost,shippingCost:shipping,returnsAllowance:returns,otherCosts:fees})});const data=await res.json();if(!res.ok)throw Error(data.error||'Unable to calculate');setResult(data as Quote);}
 catch(err){setError(err instanceof Error?err.message:'Connection failed')}}
 return <main className="min-h-screen bg-[#f7f3ea] text-[#213b2d] px-4 py-12"><div className="max-w-lg mx-auto bg-white border border-[#dfddd2] rounded-xl p-7 shadow-sm">
 <a href="/" className="text-sm underline">← Storefront</a><h1 className="text-3xl mt-5 mb-2">Private pricing workbench</h1>
 <p className="text-sm text-[#657063] mb-5">Internal pricing calculator only. No values are stored, products are not published, and no checkout is enabled.</p>
 <form onSubmit={calculate} className="grid gap-4">
 <label className="grid gap-1 text-sm">Admin access token<input type="password" autoComplete="off" value={token} onChange={e=>setToken(e.target.value)} required className="field"/></label>
 {([['Supplier product cost',cost,setCost],['Shipping costs',shipping,setShipping],['Return allowance',returns,setReturns],['Other variable costs',fees,setFees]] as const).map(([label,value,setter])=><label key={label} className="grid gap-1 text-sm">{label} (USD)<input className="field" type="text" inputMode="decimal" required placeholder="0.00" value={value} onChange={e=>setter(e.target.value)}/></label>)}
 <button className="bg-[#244835] text-white rounded-lg p-3">Calculate minimum retail price</button></form>
 {error&&<p role="alert" className="mt-4 text-red-700">{error}</p>}
 {result&&<div role="status" className="mt-5 bg-[#eaf2e9] p-4 rounded-lg"><p>Minimum estimated selling price</p><strong className="text-3xl">{new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(result.minimumPriceCents/100)}</strong><p className="text-sm mt-2">Based on 50% minimum contribution margin and modeled payment fees (3.5% + $0.49). Review actual fees and fulfillment before approval.</p></div>}
 </div></main>
}
