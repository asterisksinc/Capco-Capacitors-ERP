import { supabaseRest, type ListParams, type WorkflowStatus } from "./supabaseClient";

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
  notes?: string;
};

export const materialRequestService = {
  list(params?: ListParams) {
    return supabaseRest.list("material_requests", {
      select: params?.select ?? "*,stock(stock_no,weight_kg,grade),inventory(raw_material_code,net_weight_kg)",
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
  issue(id: string, issuedBy: string, issuedQuantity: number) {
    return supabaseRest.update("material_requests", id, {
      issued_by: issuedBy,
      issued_quantity: issuedQuantity,
      issued_at: new Date().toISOString(),
      status: "Issued" satisfies WorkflowStatus,
    });
  },
  remove(id: string) {
    return supabaseRest.remove("material_requests", id);
  },
};
