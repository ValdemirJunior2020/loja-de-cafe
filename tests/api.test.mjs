import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from '../apps/api/src/server.mjs';

let server;
let url;
test.before(async () => {
  server = startServer(0);
  await new Promise(resolve => server.once('listening', resolve));
  url = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())));

test('health reports service available', async () => {
  const result = await fetch(`${url}/health`);
  assert.equal(result.status, 200);
  assert.equal((await result.json()).status, 'ok');
});
test('preview service cannot take payments or create orders', async () => {
  const result = await fetch(`${url}/api/orders`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ amount: 1 }) });
  assert.equal(result.status, 405);
  const status = await (await fetch(`${url}/api/status`)).json();
  assert.equal(status.checkoutEnabled, false);
  assert.equal(status.supplierImportEnabled, false);
});
test('only explicit demo catalog is exposed', async () => {
  const result = await (await fetch(`${url}/api/products`)).json();
  assert.equal(result.purchasable, false);
  assert.ok(result.products.length > 0);
  assert.ok(result.products.every(product => product.status === 'DEMO_ONLY'));
});
test('unknown routes fail closed', async () => {
  assert.equal((await fetch(`${url}/api/admin`)).status, 404);
});
