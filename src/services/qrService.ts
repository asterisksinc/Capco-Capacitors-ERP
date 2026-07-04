import { buildQrPayload, supabaseRest } from "./supabaseClient";

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
};
