import test from 'node:test';
import assert from 'node:assert/strict';
import {stageImageManifest} from '../scripts/import-approved-images.mjs';
test('rejects image without documented commercial rights',async()=>await assert.rejects(()=>stageImageManifest([{productId:'target-bodum-silver',file:'photo.jpg'}],'/tmp')));
test('rejects unsupported product id',async()=>await assert.rejects(()=>stageImageManifest([{productId:'other',file:'photo.jpg',commercialReuseAuthorized:true,rightsHolder:'Brand',permissionEvidence:'Media approval 2026'}],'/tmp')));
test('accepts reviewed image mapping',async()=>{const r=await stageImageManifest([{productId:'target-bodum-silver',file:'photo.jpg',commercialReuseAuthorized:true,rightsHolder:'Brand',permissionEvidence:'Media approval 2026'}],'/tmp');assert.equal(r[0].publicPath,'/images/approved/target-bodum-silver.jpg')});
