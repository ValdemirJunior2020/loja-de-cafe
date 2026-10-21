export type Category='machines'|'grinders'|'accessories';
export type Product={id:string;category:Category;name:{en:string;pt:string};description:{en:string;pt:string};priceCents:number;emoji:string;status:'DEMO_ONLY'};
// Synthetic examples: no Temu pricing, inventory, images, or reviews represented as real.
export const catalog:Product[]=[
{id:'demo-espresso',category:'machines',name:{en:'Espresso Machine Concept',pt:'Conceito de Máquina de Espresso'},description:{en:'Compact countertop espresso system',pt:'Máquina compacta de espresso'},priceCents:17900,emoji:'☕',status:'DEMO_ONLY'},
{id:'demo-drip',category:'machines',name:{en:'Drip Brewer Concept',pt:'Conceito de Cafeteira Elétrica'},description:{en:'Easy everyday filter coffee',pt:'Café coado para o dia a dia'},priceCents:8900,emoji:'🫖',status:'DEMO_ONLY'},
{id:'demo-grinder',category:'grinders',name:{en:'Coffee Grinder Concept',pt:'Conceito de Moedor de Café'},description:{en:'Consistent grind size for every brew',pt:'Moagem consistente para cada preparo'},priceCents:7900,emoji:'⚙️',status:'DEMO_ONLY'},
{id:'demo-tamper',category:'accessories',name:{en:'Barista Tools Concept',pt:'Conceito de Acessórios Barista'},description:{en:'Tools for home espresso preparation',pt:'Acessórios para preparar espresso em casa'},priceCents:3900,emoji:'🥄',status:'DEMO_ONLY'}];