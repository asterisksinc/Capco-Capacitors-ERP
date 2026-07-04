import { supabaseRest, type ListParams, type RoleCode } from "./supabaseClient";

export type UserPayload = {
  role_id: string;
  full_name: string;
  email?: string;
  phone: string;
  status?: "active" | "inactive" | "suspended";
};

export type Role = {
  id: string;
  code: RoleCode;
  name: string;
  description?: string | null;
};

export const userService = {
  list(params?: ListParams) {
    return supabaseRest.list("profiles", {
      select: params?.select ?? "id,full_name,email,phone,status,last_login_at,created_at,roles(id,code,name)",
      order: params?.order ?? "created_at",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  counts() {
    return Promise.all([
      supabaseRest.list("profiles", { select: "id" }),
      supabaseRest.list("profiles", { select: "id", filters: { status: "active" } }),
      supabaseRest.list("profiles", { select: "id,roles!inner(code)", filters: { "roles.code": "production_head" } }),
    ]).then(([total, active, managers]) => ({
      totalUsers: total.length,
      internalTeams: active.length,
      managers: managers.length,
      headOfOperations: managers.length,
    }));
  },
  roles() {
    return supabaseRest.list<Role>("roles", { order: "name", ascending: true });
  },
  create(payload: UserPayload) {
    return supabaseRest.create("profiles", payload);
  },
  update(id: string, payload: Partial<UserPayload>) {
    return supabaseRest.update("profiles", id, payload);
  },
  remove(id: string) {
    return supabaseRest.remove("profiles", id);
  },
};
