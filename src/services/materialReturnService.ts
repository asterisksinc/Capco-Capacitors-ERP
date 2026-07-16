import { supabaseRest, type ListParams, type WorkflowStatus } from "./supabaseClient";

export type MaterialReturnPayload = {
  return_no: string;
  material_type: "raw_material" | "stock";
  material_id?: string;
  stock_id?: string;
  inventory_id?: string;
  product_order_id?: string;
  work_order_id?: string;
  weight_kg: number;
  used_weight_kg?: number;
  quantity_returned: number;
  reason: string;
  returned_by?: string;
};

export const materialReturnService = {
  list(params?: ListParams) {
    return supabaseRest.list("material_returns", {
      select: params?.select ?? "*,stock(stock_no,weight_kg,grade),inventory(raw_material_code,net_weight_kg)",
      order: params?.order ?? "created_at",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  create(payload: MaterialReturnPayload) {
    return supabaseRest.create("material_returns", {
      ...payload,
      used_weight_kg: payload.used_weight_kg ?? 0,
      status: "Returned" satisfies WorkflowStatus,
    });
  },
  accept(id: string, acceptedBy: string) {
    return supabaseRest.update("material_returns", id, { accepted_by: acceptedBy, status: "Accepted" satisfies WorkflowStatus });
  },
  reject(id: string, acceptedBy: string) {
    return supabaseRest.update("material_returns", id, { accepted_by: acceptedBy, status: "Rejected" satisfies WorkflowStatus });
  },
  remove(id: string) {
    return supabaseRest.remove("material_returns", id);
  },
};
