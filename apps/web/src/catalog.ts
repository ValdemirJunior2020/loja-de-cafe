export type Category='machines'|'grinders'|'accessories';
export type Product={id:string;category:Category;name:{en:string;pt:string};description:{en:string;pt:string};emoji:string;image:string;status:'REVIEW_REQUIRED'};
/** Real external supplier listings observed October 21 2026. Supplier costs and URLs belong only in private backend/admin records.
 * Listing content is summarized; original merchant photos are intentionally not copied.
 * Resale suitability, availability, shipping, fees, electrical compliance and margins have NOT been approved. */
export const catalog:Product[]=[
{id:'target-bodum-silver',category:'accessories',name:{en:'Bodum Schiuma Stainless Steel Milk Frother',pt:'Espumador de Leite Bodum Schiuma Inox'},description:{en:'Battery-operated handheld milk frother; requires two AA batteries.',pt:'Espumador de leite portátil a pilhas; usa duas pilhas AA.'},emoji:'🥛',image:'/images/frother-silver.svg',status:'REVIEW_REQUIRED'},
{id:'target-bodum-black',category:'accessories',name:{en:'Bodum Schiuma Black Milk Frother',pt:'Espumador de Leite Bodum Schiuma Preto'},description:{en:'Compact handheld frother; batteries not included.',pt:'Espumador de leite portátil compacto; pilhas não incluídas.'},emoji:'☕',image:'/images/frother-black.svg',status:'REVIEW_REQUIRED'},
{id:'target-bodum-recharge',category:'accessories',name:{en:'Bodum Schiuma Rechargeable Frother',pt:'Espumador Bodum Schiuma Recarregável'},description:{en:'USB rechargeable handheld milk frother.',pt:'Espumador portátil recarregável via USB.'},emoji:'🥤',image:'/images/frother-recharge.svg',status:'REVIEW_REQUIRED'},
{id:'walmart-hb-12',category:'machines',name:{en:'Hamilton Beach 12-Cup Programmable Coffee Maker',pt:'Cafeteira Programável Hamilton Beach de 12 Xícaras'},description:{en:'Glass-carafe programmable drip coffee maker, matte black.',pt:'Cafeteira elétrica programável com jarra de vidro, preta fosca.'},emoji:'🫖',image:'/images/drip-machine.svg',status:'REVIEW_REQUIRED'}
];