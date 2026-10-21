# Loja de Café — bilingual staging storefront

Coffee machines and accessories e-commerce build, starting with a clearly labeled, **non-transacting preview** in English and Portuguese. Work in progress; the complete commerce features described in the business specification are not yet implemented.

## Preview features
- React + TypeScript + Tailwind CSS responsive storefront in `apps/web`
- Bilingual EN/PT copy with a manual language toggle
- Search and categories for four synthetic **DEMO ONLY** products
- Disabled carts/purchasing (no pretend orders or fake supplier stock)
- Integer-cents pricing/margin helpers in `packages/shared`
- Dependency-free Render HTTP preview API with `/health` and `/api/status`
- All stateful/payment/auth/supplier API actions explicitly return 503 Not Configured
- GitHub Actions checks, Netlify configuration, and Render Blueprint

## Local development

Requires Node.js 20+ and npm.

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
# In another terminal:
npm run start:api
```

## Deployment

**Netlify frontend:** Connect GitHub repository `ValdemirJunior2020/loja-de-cafe`, production branch `main`. Root `netlify.toml` sets build command and publish location. Netlify serves static frontend only; there are no Netlify Functions.

**Render preview API:** Create a Blueprint from the same repository using root `render.yaml`. Configure `FRONTEND_URL` to the actual Netlify production origin. Service starts from `apps/api`. It is a deliberately non-commerce API until the production data, security and payment architecture is implemented and tested.

**Operational integrations not yet implemented:** Google Sheets, PayPal Sandbox, email, stock synchronization, admin authentication, vendor importing/approval, and a transactional order database. Do not enter payment/customer data into this preview. No Temu or Wayfair endpoints are called.

**Supplier integration decision:** Evaluate REA and Reverse API Engineer to study authorized network traffic and permitted API contracts. Only authorized feeds, licensed media and approved manual imports may go into the storefront. Supplier listings stay unpublished until commercial permission, compliance, stock, fulfillment, and 50% contribution margin are verified.

**Payment safety:** Never enable live checkout until transactional persistence, idempotency, reconciliation, customer identity protection, refunds, and end-to-end Sandbox tests pass. Do not commit secrets.
