import http from 'node:http';
import { pathToFileURL } from 'node:url';

const CATALOG = Object.freeze([
  { id: 'demo-espresso', category: 'machines', label: 'Espresso Machine Concept', status: 'DEMO_ONLY' },
  { id: 'demo-drip', category: 'machines', label: 'Drip Brewer Concept', status: 'DEMO_ONLY' },
  { id: 'demo-grinder', category: 'grinders', label: 'Coffee Grinder Concept', status: 'DEMO_ONLY' },
  { id: 'demo-tamper', category: 'accessories', label: 'Barista Tools Concept', status: 'DEMO_ONLY' }
]);

export function handler(request, response) {
  const origin = request.headers.origin;
  const allowedOrigin = process.env.FRONTEND_URL?.replace(/\/$/, '');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  if (origin && allowedOrigin && origin === allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  const send = (status, body) => {
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(body));
  };
  if (request.method === 'OPTIONS') return send(204, null);
  if (request.method !== 'GET') return send(405, { error: 'NOT_AVAILABLE', message: 'This is a preview-only service.' });
  if (pathname === '/health') return send(200, { status: 'ok' });
  if (pathname === '/api/status') return send(200, { mode: 'DEMO_ONLY', checkoutEnabled: false, supplierImportEnabled: false, authenticationEnabled: false, databaseConnected: false });
  if (pathname === '/api/products') return send(200, { products: CATALOG, mode: 'DEMO_ONLY', purchasable: false });
  return send(404, { error: 'NOT_FOUND' });
}

export function startServer(port = Number(process.env.PORT || 3001)) {
  if (!Number.isSafeInteger(port) || port < 0 || port > 65535) throw new Error('Invalid PORT');
  return http.createServer(handler).listen(port, '0.0.0.0');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
