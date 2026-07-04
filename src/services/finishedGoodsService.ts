import { supabaseRest, type ListParams } from "./supabaseClient";

export type FinishedGoodPayload = {
  finished_good_no: string;
  product_order_id?: string;
  product_code: string;
  product_name: string;
  quantity: number;
  grade: string;
};

export const finishedGoodsService = {
  list(params?: ListParams) {
    return supabaseRest.list("finished_goods", {
      select: params?.select ?? "*,product_orders(product_order_no)",
      order: params?.order ?? "updated_at",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  create(payload: FinishedGoodPayload) {
    return supabaseRest.create("finished_goods", { ...payload, status: "Dispatch Ready" });
  },
  update(id: string, payload: Partial<FinishedGoodPayload>) {
    return supabaseRest.update("finished_goods", id, payload);
  },
};
