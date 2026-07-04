import { supabaseRest, toCsv, type ListParams, type WorkflowStatus } from "./supabaseClient";

export type StockPayload = {
  stock_no: string;
  slitting_id?: string;
  work_order_id?: string;
  weight_kg: number;
  width_m?: number;
  micron?: number;
  grade: string;
  quantity?: number;
  status?: WorkflowStatus;
};

export const stockService = {
  list(params?: ListParams) {
    return supabaseRest.list("stock", {
      select: params?.select ?? "*,slitting(slitting_no,product_no),work_orders(work_order_no),qr_references(qr_payload,qr_url)",
      order: params?.order ?? "created_at",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  getById(id: string) {
    return supabaseRest.getById("stock", id, "*,slitting(*),work_orders(*),qr_references(qr_payload,qr_url)");
  },
  counts() {
    return supabaseRest.list<{ status: WorkflowStatus; stage: string }>("stock", { select: "status,stage" }).then((rows) => ({
      totalProductLots: rows.length,
      inStockDispatch: rows.filter((row) => row.status === "Pending" || row.status === "Dispatch Ready").length,
      qualityCheckPending: rows.filter((row) => row.status === "Quality Check Pending").length,
      recentAdditions: rows.length,
      slittingQueue: rows.filter((row) => row.stage === "Slitting").length,
      readyForWinding: rows.filter((row) => row.stage === "Ready for Winding" || row.stage === "Stock").length,
      completedLots: rows.filter((row) => row.status === "Completed").length,
    }));
  },
  create(payload: StockPayload) {
    return supabaseRest.create("stock", { ...payload, quantity: payload.quantity ?? 1, status: payload.status ?? "Pending", stage: "Stock" });
  },
  update(id: string, payload: Partial<StockPayload>) {
    return supabaseRest.update("stock", id, payload);
  },
  remove(id: string) {
    return supabaseRest.remove("stock", id);
  },
  exportCsv() {
    return stockService.list().then((rows) => toCsv(rows as Record<string, unknown>[]));
  },
};
