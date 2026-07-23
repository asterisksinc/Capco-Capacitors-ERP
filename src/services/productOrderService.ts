import { buildQrPayload, supabaseRest, toCsv, type Json, type ListParams, type WorkflowStage, type WorkflowStatus } from "./supabaseClient";

export type ProductOrderPayload = {
  product_order_no?: string;
  product_code: string;
  product_name?: string;
  capacitor_type: string;
  grade: string;
  specifications?: Json;
  quantity: number;
  batch_size: number;
  customer?: string;
  instructions?: string;
  stage?: WorkflowStage;
  status?: WorkflowStatus;
  delivery_commitment?: string;
  assigned_to?: string;
};

export const productOrderService = {
  list(params?: ListParams) {
    return supabaseRest.list("product_orders", {
      select: params?.select ?? "*,qr_references(qr_payload,qr_url),profiles!product_orders_assigned_to_fkey(id,full_name)",
      order: params?.order ?? "created_at",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  listForRole(role: string, profileId?: string) {
    let filters: ListParams["filters"];
    if (role === "slitting_operator" || role === "slitting_qc" || role === "operator_2_slitting") {
      filters = { stage: "Slitting" };
    } else if (["person_b", "operator_3_winding", "operator_4_spray"].includes(role)) {
      filters = { assigned_to: profileId ?? "" };
    }
    return productOrderService.list({ filters });
  },
  getById(id: string) {
    return supabaseRest.getById("product_orders", id, "*,qr_references(qr_payload,qr_url),product_order_materials(*,stock(*)),winding(*),spray(*),finished_goods(*)");
  },
  counts() {
    return supabaseRest.list<{ status: WorkflowStatus; quantity: number }>("product_orders", { select: "status,quantity" }).then((rows) => ({
      totalProductOrders: rows.length,
      unitsPlanned: rows.reduce((sum, row) => sum + Number(row.quantity ?? 0), 0),
      inProgressOrders: rows.filter((row) => row.status === "In-progress").length,
      pendingOrders: rows.filter((row) => row.status === "Yet to Start" || row.status === "Pending").length,
      completed: rows.filter((row) => row.status === "Completed").length,
    }));
  },
  create(payload: ProductOrderPayload) {
    const productOrderPayload = {
      ...payload,
      stage: payload.stage ?? "Raw Material",
      status: payload.status ?? "Yet to Start",
    };
    if (productOrderPayload.product_order_no) return supabaseRest.create("product_orders", productOrderPayload);

    return supabaseRest
      .rpc<string>("capco_next_serial", { p_entity: "product_order" })
      .then((product_order_no) => supabaseRest.create("product_orders", { ...productOrderPayload, product_order_no }));
  },
  assignStock(payload: {
    product_order_id: string;
    stock_id: string;
    linked_work_order_id?: string;
    assigned_by: string;
    assigned_to: string;
    handover_by?: string;
    weight_kg: number;
    width_m?: number;
    micron?: number;
    grade: string;
  }) {
    return supabaseRest.create("product_order_materials", { ...payload, status: "Issued" });
  },
  update(id: string, payload: Partial<ProductOrderPayload>) {
    return supabaseRest.update("product_orders", id, payload);
  },
  remove(id: string) {
    return supabaseRest.remove("product_orders", id);
  },
  exportCsv() {
    return productOrderService.list().then((rows) => toCsv(rows as Record<string, unknown>[]));
  },
  qrPayload(productOrderNo: string) {
    return buildQrPayload("product-orders", productOrderNo);
  },
};
