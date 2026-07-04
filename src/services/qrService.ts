import { buildQrPayload, supabaseRest, type ListParams } from "./supabaseClient";

type QrReference = {
  entity_type: string;
  entity_id?: string | null;
  entity_code: string;
  qr_payload: string;
};

export const qrService = {
  payload(entityType: string, code: string) {
    return buildQrPayload(entityType, code);
  },
  createReference(entityType: string, entityCode: string, entityId?: string) {
    return supabaseRest.create("qr_references", {
      entity_type: entityType,
      entity_id: entityId,
      entity_code: entityCode,
      qr_payload: buildQrPayload(entityType, entityCode),
      is_active: true,
    });
  },
  findByPayload(payload: string) {
    return supabaseRest.list("qr_references", { filters: { qr_payload: payload }, limit: 1 }).then((rows) => rows[0] ?? null);
  },
  async resolveScan(payload: string) {
    const reference = await supabaseRest
      .list<QrReference>("qr_references", { filters: { qr_payload: payload }, limit: 1 })
      .then((rows) => rows[0] ?? null);

    if (!reference) return null;

    const entityId = reference.entity_id;
    const code = reference.entity_code;
    const byCode = encodeURIComponent(code);

    if (reference.entity_type === "metallisation") {
      const rows = await supabaseRest.list("metallisation", {
        select:
          "*,created_by_profile:profiles!metallisation_created_by_fkey(id,full_name,email,phone,worker_label,team_name),operator:profiles!metallisation_operator_id_fkey(id,full_name,email,phone,worker_label,team_name)",
        filters: entityId ? { id: entityId } : { metallisation_no: code },
        limit: 1,
      });
      return { reference, entity: rows[0] ?? null, lookup: byCode };
    }

    if (reference.entity_type === "slitting" || reference.entity_type === "stock") {
      const table = reference.entity_type === "stock" ? "stock" : "slitting";
      const select =
        table === "stock"
          ? "*,created_by_profile:profiles!stock_created_by_fkey(id,full_name,email,phone,worker_label,team_name),slitting(*,created_by_profile:profiles!slitting_created_by_fkey(id,full_name,email,phone,worker_label,team_name),operator:profiles!slitting_operator_id_fkey(id,full_name,email,phone,worker_label,team_name))"
          : "*,created_by_profile:profiles!slitting_created_by_fkey(id,full_name,email,phone,worker_label,team_name),operator:profiles!slitting_operator_id_fkey(id,full_name,email,phone,worker_label,team_name)";
      const filters: NonNullable<ListParams["filters"]> = entityId ? { id: entityId } : table === "stock" ? { stock_no: code } : { slitting_no: code };
      const rows = await supabaseRest.list(table, { select, filters, limit: 1 });
      return { reference, entity: rows[0] ?? null };
    }

    return { reference, entity: null };
  },
};
