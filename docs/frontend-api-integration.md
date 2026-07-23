# Capco Manufacturing ERP Frontend API Integration

## API Base URL

Supabase exposes two API families used by the frontend services:

- Database REST: `${NEXT_PUBLIC_SUPABASE_URL}/rest/v1`
- Authentication: `${NEXT_PUBLIC_SUPABASE_URL}/auth/v1`

The TypeScript service layer is in `src/services`.

## Environment Variables

Add these to `.env.local` for frontend usage:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Keep this server-only value out of browser code:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Metallisation Image Storage

Metallisation images should be uploaded to the public Supabase Storage bucket named `metallisation`.

Recommended object path pattern:

```text
metallisation/<work_order_no>/<metallisation_no>/<filename>
```

Recommended column mapping after upload:

- `factory_wastage_image_url`: factory wastage photo URL
- `photo_url`: primary metallisation photo URL such as the weight-after-metallisation image
- `qc_details`: JSON object for QC remarks and optional extra image URLs

Example `qc_details` payload:

```json
{
  "qc": "pass",
  "remarks": "OD and resistance within limits",
  "images": {
    "weight_after_metallisation": "https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/metallisation/metallisation/WO-2026-001/MC-2001/weight.jpg",
    "qc": "https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/metallisation/metallisation/WO-2026-001/MC-2001/qc.jpg"
  }
}
```

## Auth Flow

OTP login:

1. Call `authService.requestOtp(phone)`.
2. User enters SMS code.
3. Call `authService.verifyOtp(phone, token)`.
4. The access token is stored in `localStorage`.
5. Call `authService.getCurrentProfile()` to load profile and role.

Password login:

1. Call `authService.loginWithPassword(identifier, password)`.
2. `identifier` can be email or phone if the Supabase Auth user has password login enabled.
3. The seed file stores sample profile rows only. Create matching Supabase Auth users for password login and link them through `profiles.auth_user_id`.

## Role-Based Access

Roles are seeded in `roles` and linked to `profiles.role_id`.

Role codes:

- `super_admin`
- `production_head`
- `store_head`
- `person_a`
- `operator_1_metallisation`
- `operator_2_slitting`
- `slitting_qc`
- `slitting_operator`
- `person_b`
- `operator_3_winding`
- `operator_4_spray`
- `sales`
- `accountant`

RLS policies in `supabase/rls-policies.sql` restrict reads and writes by role. Frontend should load the profile after login and route users to their existing role area.

Slitting role routing:

- `slitting_qc` uses the existing Slitting dashboard route, `/person-a-slitting`.
- `operator_2_slitting` is still supported as a legacy compatibility role.
- `slitting_operator` should use a scan/confirm workflow and must not call QC batch creation APIs.

## Request Format

Service calls return Supabase JSON directly. Create/update payloads use database column names.

Example:

```ts
await workOrderService.create({
  work_order_no: "WO-2026-010",
  micron: 4.5,
  width_m: 1.0,
  quantity: 5000,
});
```

## Error Handling

All service errors throw `SupabaseApiError` with:

- `message`
- `status`
- `details`

Frontend usage:

```ts
try {
  const rows = await inventoryService.list();
} catch (error) {
  // Show error.message in toast/modal.
}
```

## Status Values

Workflow statuses:

- `Yet to Start`
- `In-progress`
- `Completed`
- `Cancelled`
- `Pending`
- `Issued`
- `Accepted`
- `Rejected`
- `Partially Issued`
- `Paid`
- `Partial Payment`
- `Due`
- `In Inventory`
- `Being Used`
- `Used Completely`
- `Quality Check Pending`
- `Dispatch Ready`

## Stage Values

Workflow stages:

- `Inventory`
- `Raw Material`
- `Ready for Metallisation`
- `Metallisation`
- `Slitting`
- `Stock`
- `Ready for Winding`
- `Winding`
- `Spray`
- `Finished Goods`
- `Completed`
- `Dispatch Ready`

## Module APIs

Authentication:

- `authService.requestOtp(phone)`
- `authService.verifyOtp(phone, token)`
- `authService.loginWithPassword(identifier, password)`
- `authService.logout()`
- `authService.getCurrentProfile()`

Users:

- `userService.list()`
- `userService.counts()`
- `userService.roles()`
- `userService.create(payload)`
- `userService.update(id, payload)`
- `userService.remove(id)`

Inventory:

- `inventoryService.list()`
- `inventoryService.getById(id)`
- `inventoryService.counts()`
- `inventoryService.create(payload)`
- `inventoryService.update(id, payload)`
- `inventoryService.remove(id)`
- `inventoryService.importRows(rows)`
- `inventoryService.exportCsv()`

Work Orders:

- `workOrderService.list()`
- `workOrderService.listForRole(role, profileId)`
- `workOrderService.getById(id)`
- `workOrderService.counts()`
- `workOrderService.create(payload)`
- `workOrderService.assignRawMaterials(payload)`
- `workOrderService.update(id, payload)`
- `workOrderService.remove(id)`
- `workOrderService.exportCsv()`

Product Orders:

- `productOrderService.list()`
- `productOrderService.listForRole(role, profileId)`
- `productOrderService.getById(id)`
- `productOrderService.counts()`
- `productOrderService.create(payload)`
- `productOrderService.assignStock(payload)`
- `productOrderService.update(id, payload)`
- `productOrderService.remove(id)`
- `productOrderService.exportCsv()`

Production Stages:

- `productionStageService.listMetallisation()`
- `productionStageService.addMetallisation(payload)`
- `productionStageService.listSlitting()`
- `productionStageService.addSlitting(payload)`
- `productionStageService.listWinding()`
- `productionStageService.addWinding(payload)`
- `productionStageService.listSpray()`
- `productionStageService.addSpray(payload)`

Slitting Operator and QC:

- `slittingService.scanMetallisationCoil(qrValue)`
- `slittingService.confirmMetallisationCoil({ qr_value, work_order_id?, product_order_id?, idempotency_key? })`
- `slittingService.listConfirmations(params?)`
- `slittingService.createPacketBatch({ slitting_id, packet_type, quantity, product_order_id?, item_weights?, item_grades?, idempotency_key, metadata? })`
- `slittingService.listBatches(params?)`
- `slittingService.stickerDownloadUrl(documentId)`
- `slittingService.stickerPrintUrl(documentId)`
- `slittingService.batchStickerDownloadUrl(batchId)`
- `slittingService.batchStickerPrintUrl(batchId)`

Notifications:

- `notificationService.list(params?)`
- `notificationService.unreadCount()`
- `notificationService.markRead(notificationIds?)`
- `notificationService.registerPushSubscription(subscription, userAgent?)`
- `notificationService.deactivatePushSubscription(endpoint)`

Server routes for browser/PWA integration:

- `GET /api/notifications?limit=50`
- `PATCH /api/notifications` with `{ "notificationIds": ["uuid"] }`; omit IDs to mark all read
- `POST /api/push` with `{ "action": "register", "subscription": PushSubscriptionJSON }`
- `DELETE /api/push` with `{ "endpoint": "..." }`
- `POST /api/push` with `{ "action": "sendPending" }` from a server job or Postman to process pending pushes
- `GET /api/documents/generated_documents/:id?intent=download`
- `GET /api/documents/generated_documents/:id?intent=print`
- `GET /api/documents/slitting_batches/:id?kind=stickers&intent=download`
- `GET /api/documents/slitting_batches/:id?kind=stickers&intent=print`

Stock:

- `stockService.list()`
- `stockService.getById(id)`
- `stockService.counts()`
- `stockService.create(payload)`
- `stockService.update(id, payload)`
- `stockService.remove(id)`
- `stockService.exportCsv()`

Material Requests:

- `materialRequestService.list()`
- `materialRequestService.create(payload)`
- `materialRequestService.issue(id, issuedBy, issuedQuantity, qcImageUrl?)`
- `materialRequestService.uploadQcImage(requestNo, file)`
- `materialRequestService.remove(id)`

Material Returns:

- `materialReturnService.list()`
- `materialReturnService.create(payload)`
- `materialReturnService.accept(id, acceptedBy)`
- `materialReturnService.reject(id, acceptedBy)`
- `materialReturnService.remove(id)`

Pipeline:

- `pipelineService.list()`
- `pipelineService.overview()`
- `pipelineService.create(payload)`
- `pipelineService.exportCsv()`

Dashboard:

- `dashboardService.superAdmin()`
- `dashboardService.productionHead()`
- `dashboardService.storeHead()`
- `dashboardService.personA()`
- `dashboardService.personB()`

Finished Goods:

- `finishedGoodsService.list()`
- `finishedGoodsService.create(payload)`
- `finishedGoodsService.update(id, payload)`

Vendor Purchases:

- `vendorPurchaseService.list()`
- `vendorPurchaseService.counts()`
- `vendorPurchaseService.create(payload)`
- `vendorPurchaseService.update(id, payload)`
- `vendorPurchaseService.remove(id)`
- `vendorPurchaseService.exportCsv()`

QR References:

- `qrService.payload(entityType, code)`
- `qrService.createReference(entityType, entityCode, entityId)`
- `qrService.findByPayload(payload)`

Import/Export:

- `importExportService.createJob(payload)`
- `importExportService.completeJob(id, processedRows, errorRows, errors)`
- `importExportService.toCsv(rows)`

## Workflow Consumption

Raw material flow:

1. Super Admin creates inventory with `inventoryService.create`.
2. Production Head creates work order with `workOrderService.create`.
3. Store Head assigns inventory with `workOrderService.assignRawMaterials`.
4. Person A hands material to Operator 1 by updating `work_order_materials`.
5. Operator 1 adds metallisation with `productionStageService.addMetallisation`.
6. Slitting Operator scans a completed metallisation coil with `slittingService.scanMetallisationCoil(qrValue)`.
7. Slitting Operator confirms the coil with `slittingService.confirmMetallisationCoil(...)`.
8. Slitting QC uses the existing Slitting dashboard and creates/updates the Slitting record with `productionStageService.addSlitting`.
9. Slitting QC creates bag or packet records in one transaction with `slittingService.createPacketBatch`.
10. Slitting output is available for stickers, QR, documents, and stock flow.

Slitting Operator popup flow:

```ts
const scan = await slittingService.scanMetallisationCoil(qrValueOrCoilNo);

const confirmation = await slittingService.confirmMetallisationCoil({
  qr_value: qrValueOrCoilNo,
  work_order_id: scan.work_order_id,
  product_order_id: scan.product_order?.id,
  idempotency_key: `${scan.metallisation_id}:${currentProfile.id}:confirm`,
});
```

Display these scan fields in the popup when available: `metallisation_no`, `coil_no`, `work_order_no`, `product_order.product_order_no`, `material`, `micron`, `width_m`, `weight_kg`, `metallisation_status`, `existing_slitting_status`, `already_confirmed`, `confirmed_by`, and `confirmed_at`.

Slitting QC ten-bag batch flow:

```ts
const result = await slittingService.createPacketBatch({
  slitting_id: slittingRecord.id,
  packet_type: "Bag",
  quantity: 10,
  product_order_id: productOrderId,
  item_weights: [5.9, 5.9, 5.9, 5.9, 5.9, 5.9, 5.9, 5.9, 5.9, 6.1],
  item_grades: ["AA", "AA", "AA", "AA", "AA", "AA", "AA", "AA", "AA", "AA"],
  idempotency_key: `${slittingRecord.id}:bags:10:${formSubmissionId}`,
});

window.open(slittingService.batchStickerPrintUrl(String(result.batch.id)), "_blank");
```

Use a stable `idempotency_key` for retries. Do not generate a new key when retrying the same submit click.

Metallisation with images:

1. Upload the image file to the `metallisation` storage bucket.
2. Copy the resulting public URL.
3. Insert the metallisation row into `public.metallisation`.
4. Store extra QC image URLs inside `qc_details.images` if more than one image is needed.

Product order flow:

1. Production Head creates product order with `productOrderService.create`.
2. Operator 2 assigns stock using `productOrderService.assignStock`.
3. Person B sends material to Operator 3.
4. Operator 3 adds winding with `productionStageService.addWinding`.
5. Operator 4 adds spray with `productionStageService.addSpray`.
6. Final output is added with `finishedGoodsService.create`.

## PWA Push Notification Integration

Required environment variables:

```bash
NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY=your_web_push_vapid_public_key
WEB_PUSH_VAPID_PRIVATE_KEY=your_web_push_vapid_private_key
WEB_PUSH_SUBJECT=mailto:admin@capco.local
```

Frontend registration shape:

```ts
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY!),
});

await fetch("/api/push", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({ action: "register", subscription: subscription.toJSON() }),
});
```

Service worker receive handler:

```js
self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(payload.title || "CAPCO", {
      body: payload.body || "New notification",
      data: payload.data || {},
    })
  );
});
```

How to test on Android mobile:

1. Set the VAPID env vars and run the app over HTTPS. For local phone testing, use a trusted tunnel such as ngrok or deploy a staging URL.
2. Open the PWA in Chrome on Android, log in as `slittingqc@capco.local` or `slittingoperator@capco.local`.
3. Install the PWA from Chrome menu, then allow notifications when prompted.
4. Confirm `/api/push` register returns `{ "ok": true }`.
5. Create a Work Order or Product Order with `stage: "Slitting"` as Production Head.
6. Confirm a row appears in `public.notifications` for Slitting QC and Slitting Operator.
7. Trigger delivery by calling `POST /api/push` with `{ "action": "sendPending" }` from Postman or a server-side scheduled job.
8. The Android device should show the notification. If it does not, check Chrome site notification permission, Android app notification permission, and `push_subscriptions.is_active`.
9. For delivery failures, inspect `notifications.push_status`, `notifications.push_error`, and `push_subscriptions.failure_count`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL editor.
3. Run `supabase/seed.sql`.
4. Create matching Auth users for seeded phones/emails if password login is needed.
5. Set each Auth user ID into `profiles.auth_user_id`.
6. Run `supabase/rls-policies.sql`.

`supabase/schema.sql` also creates the public `metallisation` storage bucket and authenticated read/insert/update policies for `storage.objects`.

If a previous schema attempt partially created enum types and later fails with
`unsafe use of new value`, run `supabase/enum-fix.sql` by itself, wait for it to
complete, then run `supabase/schema.sql` again.

For local Supabase, use:

```bash
supabase db reset
supabase db push
```

Then run the seed and RLS SQL files through `psql` or the Studio SQL editor.
