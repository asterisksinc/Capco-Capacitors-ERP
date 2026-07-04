import { supabaseRest, toCsv, type ListParams } from "./supabaseClient";

export const pipelineService = {
  list(params?: ListParams) {
    return supabaseRest.list("pipeline_tracking", {
      select: params?.select ?? "*",
      order: params?.order ?? "created_at",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  overview() {
    return Promise.all([
      supabaseRest.list<{ status: string }>("work_orders", { select: "status" }),
      supabaseRest.list<{ status: string }>("product_orders", { select: "status" }),
      supabaseRest.list<{ status: string }>("pipeline_tracking", { select: "status" }),
    ]).then(([workOrders, productOrders, pipeline]) => ({
      activeWorkOrders: workOrders.filter((row) => row.status !== "Completed").length,
      activeProductOrders: productOrders.filter((row) => row.status !== "Completed").length,
      inProgressStages: pipeline.filter((row) => row.status === "In-progress").length,
    }));
  },
  create(payload: {
    entity_type: "work_order" | "product_order";
    entity_id: string;
    from_stage?: string;
    to_stage: string;
    status?: string;
    assigned_from?: string;
    assigned_to?: string;
    notes?: string;
  }) {
    return supabaseRest.create("pipeline_tracking", { ...payload, status: payload.status ?? "In-progress" });
  },
  exportCsv() {
    return pipelineService.list().then((rows) => toCsv(rows as Record<string, unknown>[]));
  },
};
