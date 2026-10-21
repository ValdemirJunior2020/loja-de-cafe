/** Price in integer cents. Percentage processor fee in basis points. */
export function minimumPriceCents({variableCostsCents,processorFixedFeeCents=0,processorFeeBasisPoints=0,minimumMarginBasisPoints=5000}){
for(const n of [variableCostsCents,processorFixedFeeCents,processorFeeBasisPoints,minimumMarginBasisPoints])if(!Number.isSafeInteger(n)||n<0)throw Error('Use nonnegative safe integers');
const denominator=10000-processorFeeBasisPoints-minimumMarginBasisPoints;if(denominator<=0)throw Error('Infeasible margin');
const amount=variableCostsCents+processorFixedFeeCents;if(!Number.isSafeInteger(amount*10000))throw Error('Amount too large');return Math.ceil(amount*10000/denominator);
}
export function contributionMarginBasisPoints({revenueCents,variableCostsCents}){if(!Number.isSafeInteger(revenueCents)||revenueCents<=0||!Number.isSafeInteger(variableCostsCents)||variableCostsCents<0)throw Error('Invalid amounts');return Math.floor((revenueCents-variableCostsCents)*10000/revenueCents)}
export function canPublish(product){return product.status==='APPROVED'&&product.supplierAuthorized===true&&product.imageRightsVerified===true&&product.complianceVerified===true&&product.stockVerified===true&&product.marginBasisPoints>=5000}
