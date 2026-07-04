import { supabaseRest, type Json, type ListParams, type WorkflowStatus } from "./supabaseClient";

export type MetallisationPayload = {
  metallisation_no: string;
  work_order_id: string;
  raw_material_id: string;
  operator_id?: string;
  coil_no?: string;
  machine_no?: string;
  weight_kg: number;
  weight_after_metallisation_kg?: number;
  optical_density?: number;
  resistance_ohms?: number;
  factory_wastage_kg?: number;
  factory_wastage_image_url?: string;
  photo_url?: string;
  qc_details?: Json;
};

export type SlittingPayload = {
  slitting_no: string;
  work_order_id: string;
  metallisation_id?: string;
  raw_material_id?: string;
  operator_id?: string;
  product_no: string;
  weight_kg: number;
  thickness_micron: number;
  width_m?: number;
  number_of_bags?: number;
  grade: string;
  grade_each_bag?: Json;
  weight_each_bag?: Json;
  remarks?: string;
};

export type WindingPayload = {
  winding_no: string;
  product_order_id: string;
  product_material_id?: string;
  operator_id?: string;
  film_width: string;
  winding_tension?: string;
  film_turns?: number;
  turns_count?: number;
  quantity_wound: number;
  weight_of_element_kg?: number;
  total_film_consumed_kg?: number;
  rejected_quantity?: number;
};

export type SprayPayload = {
  spray_no: string;
  product_order_id: string;
  winding_id?: string;
  operator_id?: string;
  spray_type: string;
  feed_rate?: string;
  pressure_setting?: string;
  mfd?: string;
  no_of_coats?: number;
  thickness_maintained?: string;
  rejected_quantity?: number;
  quantity: number;
};

function listStage(table: string, params?: ListParams) {
  return supabaseRest.list(table, {
    select: params?.select ?? "*",
    order: params?.order ?? "created_at",
    ascending: params?.ascending,
    filters: params?.filters,
    limit: params?.limit,
    offset: params?.offset,
  });
}

export const productionStageService = {
  listMetallisation: (params?: ListParams) => listStage("metallisation", params),
  listSlitting: (params?: ListParams) => listStage("slitting", params),
  listWinding: (params?: ListParams) => listStage("winding", params),
  listSpray: (params?: ListParams) => listStage("spray", params),
  addMetallisation(payload: MetallisationPayload) {
    return supabaseRest.create("metallisation", {
      ...payload,
      factory_wastage_kg: payload.factory_wastage_kg ?? 0,
      next_stage: "Slitting",
      stage: "Metallisation",
      status: "Completed" satisfies WorkflowStatus,
    });
  },
  addSlitting(payload: SlittingPayload) {
    return supabaseRest.create("slitting", {
      ...payload,
      number_of_bags: payload.number_of_bags ?? 0,
      stage: "Stock",
      status: "Completed" satisfies WorkflowStatus,
    });
  },
  addWinding(payload: WindingPayload) {
    return supabaseRest.create("winding", {
      ...payload,
      rejected_quantity: payload.rejected_quantity ?? 0,
      stage: "Winding",
      status: "Completed" satisfies WorkflowStatus,
    });
  },
  addSpray(payload: SprayPayload) {
    return supabaseRest.create("spray", {
      ...payload,
      rejected_quantity: payload.rejected_quantity ?? 0,
      stage: "Spray",
      status: "Completed" satisfies WorkflowStatus,
    });
  },
};
