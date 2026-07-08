import { supabaseRest, toCsv, type ListParams } from "./supabaseClient";

export type VendorPurchasePayload = {
  purchase_no: string;
  vendor_name: string;
  purchase_date: string;
  direction: "Credit" | "Debit";
  order_amount: number;
  paid_amount?: number;
  payment_type?: string;
  notes?: string;
};

export const vendorPurchaseService = {
  list(params?: ListParams) {
    return supabaseRest.list("vendor_purchases", {
      select: params?.select ?? "*,vendor_purchase_items(*)",
      order: params?.order ?? "purchase_date",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  getById(id: string) {
    return supabaseRest.getById("vendor_purchases", id, "*,vendor_purchase_items(*)");
  },
  counts() {
    return supabaseRest.list<{ order_amount: number; paid_amount: number; status: string }>("vendor_purchases", { select: "order_amount,paid_amount,status" }).then((rows) => {
      const totalValue = rows.reduce((sum, row) => sum + Number(row.order_amount ?? 0), 0);
      const totalPaid = rows.reduce((sum, row) => sum + Number(row.paid_amount ?? 0), 0);
      return {
        totalPurchases: rows.length,
        totalValue,
        totalPaid,
        outstanding: totalValue - totalPaid,
      };
    });
  },
  create(payload: VendorPurchasePayload) {
    const status = (payload.paid_amount ?? 0) >= payload.order_amount ? "Paid" : (payload.paid_amount ?? 0) > 0 ? "Partial Payment" : "Due";
    return supabaseRest.create("vendor_purchases", { ...payload, paid_amount: payload.paid_amount ?? 0, status });
  },
  update(id: string, payload: Partial<VendorPurchasePayload>) {
    return supabaseRest.update("vendor_purchases", id, payload);
  },
  remove(id: string) {
    return supabaseRest.remove("vendor_purchases", id);
  },
  exportCsv() {
    return vendorPurchaseService.list().then((rows) => toCsv(rows as Record<string, unknown>[]));
  },
};
