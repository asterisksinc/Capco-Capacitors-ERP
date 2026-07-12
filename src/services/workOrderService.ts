import { buildQrPayload, supabaseRest, toCsv, type ListParams, type WorkflowStage, type WorkflowStatus } from "./supabaseClient";

export type WorkOrderPayload = {
  work_order_no: string;
  micron: number;
  width_m: number;
  quantity: number;
  stage?: WorkflowStage;
  status?: WorkflowStatus;
  planned_start_date?: string;
  due_date?: string;
  assigned_to?: string;
};

export const workOrderService = {
  list(params?: ListParams) {
    return supabaseRest.list("work_orders", {
      select: params?.select ?? "*,qr_references(qr_payload,qr_url),profiles!work_orders_assigned_to_fkey(id,full_name)",
      order: params?.order ?? "created_at",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  listForRole(role: string, profileId?: string) {
    const filters = role.includes("operator") || role === "person_a" ? { assigned_to: profileId ?? "" } : undefined;
    return workOrderService.list({ filters });
  },
  getById(id: string) {
    return supabaseRest.getById(
      "work_orders",
      id,
      "*,created_by_profile:profiles!work_orders_created_by_fkey(id,full_name,email,phone,worker_label,team_name),qr_references(qr_payload,qr_url),work_order_materials(*,inventory(*)),metallisation(*,created_by_profile:profiles!metallisation_created_by_fkey(id,full_name,email,phone,worker_label,team_name),operator:profiles!metallisation_operator_id_fkey(id,full_name,email,phone,worker_label,team_name)),slitting(*,created_by_profile:profiles!slitting_created_by_fkey(id,full_name,email,phone,worker_label,team_name),operator:profiles!slitting_operator_id_fkey(id,full_name,email,phone,worker_label,team_name))",
    );
  },
  getByWorkOrderNo(workOrderNo: string) {
    return supabaseRest.list<Record<string, unknown>>(
      "work_orders",
      {
        select: "*,created_by_profile:profiles!work_orders_created_by_fkey(id,full_name,email,phone,worker_label,team_name),qr_references(qr_payload,qr_url),work_order_materials(*,inventory(*)),metallisation(*,created_by_profile:profiles!metallisation_created_by_fkey(id,full_name,email,phone,worker_label,team_name),operator:profiles!metallisation_operator_id_fkey(id,full_name,email,phone,worker_label,team_name)),slitting(*,created_by_profile:profiles!slitting_created_by_fkey(id,full_name,email,phone,worker_label,team_name),operator:profiles!slitting_operator_id_fkey(id,full_name,email,phone,worker_label,team_name))",
        filters: { work_order_no: workOrderNo },
        limit: 1
      }
    ).then((rows) => rows[0] ?? null);
  },
  counts() {
    return supabaseRest.list<{ status: WorkflowStatus }>("work_orders", { select: "status" }).then((rows) => ({
      totalWorkOrders: rows.length,
      yetToStart: rows.filter((row) => row.status === "Yet to Start").length,
      inProgress: rows.filter((row) => row.status === "In-progress").length,
      completed: rows.filter((row) => row.status === "Completed").length,
    }));
  },
  create(payload: WorkOrderPayload) {
    return supabaseRest.create("work_orders", {
      ...payload,
      stage: payload.stage ?? "Raw Material",
      status: payload.status ?? "Yet to Start",
    });
  },
  update(id: string, payload: Partial<WorkOrderPayload>) {
    return supabaseRest.update("work_orders", id, payload);
  },
  assignRawMaterials(payload: {
    work_order_id: string;
    inventory_ids: string[];
    assigned_to: string;
    assigned_by: string;
    quantity_kg_by_inventory_id: Record<string, number>;
    store_head_review_image_url_by_inventory_id?: Record<string, string>;
  }) {
    return Promise.all(
      payload.inventory_ids.map((inventory_id) =>
        supabaseRest.create("work_order_materials", {
          work_order_id: payload.work_order_id,
          inventory_id,
          ...(payload.assigned_to ? { assigned_to: payload.assigned_to } : {}),
          ...(payload.assigned_by ? { assigned_by: payload.assigned_by } : {}),
          quantity_kg: payload.quantity_kg_by_inventory_id[inventory_id] ?? 0,
          ...(payload.store_head_review_image_url_by_inventory_id?.[inventory_id]
            ? { store_head_review_image_url: payload.store_head_review_image_url_by_inventory_id[inventory_id] }
            : {}),
          status: "Issued",
        }),
      ),
    );
  },
  remove(id: string) {
    return supabaseRest.remove("work_orders", id);
  },
  exportCsv() {
    return workOrderService.list().then((rows) => toCsv(rows as Record<string, unknown>[]));
  },
  qrPayload(workOrderNo: string) {
    return buildQrPayload("work-orders", workOrderNo);
  },
};
