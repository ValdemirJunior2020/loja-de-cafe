# Importing approved Temu catalog records

REA and Reverse API Engineer are investigative tools; they do **not** automatically supply commercial authorization, permission to reuse images, or a documented supplier purchase workflow. Temu's public Partner Platform primarily documents seller-side operations; access requires appropriate permissions.

To stage supplier catalog entries, acquire an authorized catalog export or explicitly approved product information, then make a private JSON array with these fields for each item:

```json
[{
  "supplier_id": "your-approved-supplier-id",
  "title_en": "Verified supplier product title",
  "title_pt": "Approved Portuguese description",
  "category": "machines",
  "supplier_url": "https://www.temu.com/your-authorized-product-link",
  "purchase_cost_usd": "20.00",
  "supplier_shipping_usd": "0.00",
  "outbound_shipping_usd": "5.00",
  "estimated_fees_usd": "1.00",
  "returns_allowance_usd": "2.00"
}]
```

Run locally (Node 20+):

```sh
node scripts/import-supplier.mjs approved-products.json staged-products.json
```

Output is an unpublished JSON review file. It NEVER changes the public catalog or creates an order. All products remain DRAFT. The minimum suggested retail price uses an adjustable payment fee estimate (defaults to 3.5% + $0.49) and the minimum 50% contribution margin. Confirm actual fees and all costs before publication. The supplier link is a reference, NOT evidence of authorized access or live stock. No raw checkout is enabled.

Next development steps: authenticated admin, durable product storage, supplier rights review, images, inventory verification, approved publication endpoint, and automatic front-end refresh. Do not commit personal supplier exports or actual customer data to public GitHub.
