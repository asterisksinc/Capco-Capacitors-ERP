import { supabaseRest, supabaseStorage, type ListParams, type WorkflowStatus } from "./supabaseClient";

export type MaterialRequestPayload = {
  request_no: string;
  material_type: "raw_material" | "stock";
  material_id?: string;
  stock_id?: string;
  inventory_id?: string;
  product_order_id?: string;
  work_order_id?: string;
  requested_quantity: number;
  grade?: string;
  requested_by?: string;
  qc_image_url?: string;
  notes?: string;
};

export const materialRequestService = {
  list(params?: ListParams) {
    return supabaseRest.list("material_requests", {
      select: params?.select ?? "*,stock(stock_no,weight_kg,grade),inventory(raw_material_code,net_weight_kg),work_orders(micron,width_m)",
      order: params?.order ?? "created_at",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  create(payload: MaterialRequestPayload) {
    return supabaseRest.create("material_requests", { ...payload, status: "Pending" satisfies WorkflowStatus, issued_quantity: 0 });
  },
  issue(id: string, issuedBy: string, issuedQuantity: number, qcImageUrl?: string) {
    return supabaseRest.update("material_requests", id, {
      issued_by: issuedBy,
      issued_quantity: issuedQuantity,
      issued_at: new Date().toISOString(),
      ...(qcImageUrl ? { qc_image_url: qcImageUrl } : {}),
      status: "Issued" satisfies WorkflowStatus,
    });
  },
  uploadQcImage(requestNo: string, file: Blob & { name?: string }) {
    return supabaseStorage.uploadProductionImage({
      stage: "raw-material",
      ownerCode: requestNo,
      file,
      label: "material-request-qc",
    });
  },
  remove(id: string) {
    return supabaseRest.remove("material_requests", id);
  },
  cancel(id: string, cancelledBy: string) {
    return supabaseRest.update("material_requests", id, {
      status: "Cancelled" satisfies WorkflowStatus,
    });
  },
};
