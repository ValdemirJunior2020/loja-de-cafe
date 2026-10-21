# Loja de Café

Bilingual English/Portuguese coffee equipment storefront — **preview only**.

The initial stage uses React + TypeScript + Tailwind (Netlify) and a separate, non-transacting Node preview API (Render). Four products are synthetic demonstration records. No Temu integration, inventory, customer accounts, payments, or orders are live.

Supplier plan: evaluate REA and Reverse API Engineer for authorized API discovery, then require manual approval for supplier import, image rights, product compliance, stock availability, and a minimum 50% contribution margin.

Security: checkout and account endpoints stay disabled until proper authentication, durable transactional orders, PayPal Sandbox reconciliation, and fulfillment protections pass testing.

Build: `npm install && npm test && npm run typecheck && npm run build`

Run frontend: `npm run dev`. Run backend: `npm run api:start`.

Deploy: Root `netlify.toml` builds the static frontend. `render.yaml` defines an optional preview API. Never put secrets in the frontend or GitHub.