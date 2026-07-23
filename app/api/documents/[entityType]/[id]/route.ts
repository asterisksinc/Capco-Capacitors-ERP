import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getProfileFromBearer, missingSupabaseAdminResponse, supabaseAdminConfig, supabaseAdminRequest } from "@/lib/server/supabaseAdmin";

type GeneratedDocument = {
  id: string;
  document_no: string;
  entity_type: string;
  entity_code?: string | null;
  document_kind: string;
  file_name: string;
  content_type: string;
  content_html?: string | null;
  metadata: Record<string, unknown>;
};

type SlittingBatchItem = {
  item_no: string;
  item_index: number;
  packet_type: "Bag" | "Packet";
  sticker_payload: Record<string, unknown>;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function renderSticker(payload: Record<string, unknown>) {
  const qrPayload = String(payload.qr_payload || payload.serial_no || "");
  const qrDataUrl = qrPayload ? await QRCode.toDataURL(qrPayload, { margin: 1, width: 160 }) : "";
  const rows = [
    ["Serial", payload.serial_no],
    ["Work Order", payload.work_order_no],
    ["Product Order", payload.product_order_no],
    ["Coil", payload.metallisation_coil_no],
    ["Batch", payload.batch_no],
    ["Item", payload.item_index],
    ["Material", payload.material],
    ["Micron", payload.micron],
    ["Width", payload.width_m],
    ["Weight", payload.weight_kg],
    ["Grade", payload.grade],
    ["Date", payload.production_date],
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");

  return `
    <section class="sticker">
      <header>CAPCO Capacitors</header>
      ${qrDataUrl ? `<img class="qr" src="${qrDataUrl}" alt="QR code" />` : ""}
      <strong class="serial">${escapeHtml(payload.serial_no)}</strong>
      <dl>
        ${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
      </dl>
    </section>
  `;
}

function documentShell(content: string, title: string) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: auto; margin: 10mm; }
    body { margin: 0; font-family: Arial, sans-serif; color: #171717; background: #fff; }
    .sheet { display: flex; flex-wrap: wrap; gap: 10mm; align-items: flex-start; }
    .sticker { box-sizing: border-box; width: 80mm; min-height: 110mm; border: 1px solid #d7d7d7; padding: 6mm; page-break-inside: avoid; }
    .sticker header { background: #00B6E2; color: #fff; font-weight: 700; padding: 4mm; margin: -6mm -6mm 5mm; }
    .qr { display: block; width: 42mm; height: 42mm; margin: 0 auto 4mm; }
    .serial { display: block; text-align: center; font-size: 14px; margin-bottom: 4mm; word-break: break-word; }
    dl { margin: 0; font-size: 11px; }
    dl div { display: flex; justify-content: space-between; gap: 4mm; border-top: 1px solid #eee; padding: 1.5mm 0; }
    dt { color: #666; }
    dd { margin: 0; text-align: right; font-weight: 600; }
  </style>
</head>
<body><main class="sheet">${content}</main></body>
</html>`;
}

function disposition(intent: string, fileName: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${intent === "print" ? "inline" : "attachment"}; filename="${safeName}"`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ entityType: string; id: string }> },
) {
  if (!supabaseAdminConfig.url || !supabaseAdminConfig.serviceRoleKey) return missingSupabaseAdminResponse();

  const profile = await getProfileFromBearer(request);
  if (!profile) {
    return NextResponse.json({ ok: false, message: "Authentication required" }, { status: 401 });
  }

  const { entityType, id } = await context.params;
  const url = new URL(request.url);
  const intent = url.searchParams.get("intent") === "print" ? "print" : "download";
  const kind = url.searchParams.get("kind") || "document";

  if (entityType === "generated_documents") {
    const docs = await supabaseAdminRequest<GeneratedDocument[]>(
      `/rest/v1/generated_documents?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
    );
    const doc = docs[0];
    if (!doc) return NextResponse.json({ ok: false, message: "Document not found" }, { status: 404 });

    const content =
      doc.content_html ||
      documentShell(await renderSticker(doc.metadata || {}), doc.entity_code || doc.document_no || doc.file_name);

    return new Response(content, {
      headers: {
        "Content-Type": doc.content_type || "text/html; charset=utf-8",
        "Content-Disposition": disposition(intent, doc.file_name),
      },
    });
  }

  if (entityType === "slitting_batches" && kind === "stickers") {
    const items = await supabaseAdminRequest<SlittingBatchItem[]>(
      `/rest/v1/slitting_batch_items?select=item_no,item_index,packet_type,sticker_payload&batch_id=eq.${encodeURIComponent(id)}&order=item_index.asc`,
    );
    if (items.length === 0) return NextResponse.json({ ok: false, message: "No stickers found for batch" }, { status: 404 });

    const rendered = await Promise.all(items.map((item) => renderSticker({ ...item.sticker_payload, serial_no: item.item_no })));
    const first = items[0]?.sticker_payload;
    const batchNo = typeof first?.batch_no === "string" ? first.batch_no : id;
    const html = documentShell(rendered.join(""), `Slitting stickers ${batchNo}`);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": disposition(intent, `${batchNo}-stickers.html`),
      },
    });
  }

  return NextResponse.json({ ok: false, message: "Unsupported document target" }, { status: 400 });
}
