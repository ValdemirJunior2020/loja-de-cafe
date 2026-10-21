# Real product photography and reverse API investigation

The four existing product images are **original illustrations**, not actual manufacturer photos. They must not be described as official images. Supplier websites often own or license their product photography; merely seeing it in browser traffic does not grant commercial reuse rights.

## REA and Reverse API Engineer setup (local investigator)

These are separate tools, not live supplier integrations.

- REA: https://github.com/morluto/rea — requires supported Node 22.19+ or Node 24.11+, and compatible agent installation.
- Reverse API Engineer: https://github.com/kalil0321/reverse-api-engineer — requires Python/uv and browser automation tools.

Check their releases and documentation before running installation on your Windows development PC.

```powershell
npx rea-agents setup
uv tool install reverse-api-engineer
```

Investigate only targets and endpoints you are authorized to test. Do not capture account cookies or access tokens in saved artifacts, bypass CAPTCHAs or access controls, or automatically commit HAR files. Run the generated clients against explicitly authorized interfaces, with rate limiting and input validation.

These tools are **not** currently running on Render. Do not embed them into a public web service; run locally during development and review generated code before including it in the backend.

## Import approved original product photos

Obtain a supplier-approved media feed, manufacturer asset permission, or independently licensed exact-product images. Create a local `photo-manifest.json`:

```json
[
  {
    "productId": "target-bodum-silver",
    "file": "bodum-silver.jpg",
    "commercialReuseAuthorized": true,
    "rightsHolder": "The actual rights holder",
    "permissionEvidence": "Approval reference dated YYYY-MM-DD"
  }
]
```

Put the approved photo file in a local folder, then run:

```powershell
node scripts/import-approved-images.mjs photo-manifest.json .\supplier-photos
```

The script validates entries, copies images into the project's public assets, and records a minimal rights-evidence manifest. **It does not itself approve or publish the images.** Following human review, update the corresponding `image` field in `apps/web/src/catalog.ts` to `/images/approved/<productId>.jpg`, and run automated tests and deployment. For customer trust, always show the exact product variant, not a similar model.

Never commit an image URL or the image itself based solely on a reverse-engineered endpoint. Use approved manufacturer or supplier photography and documented rights.
