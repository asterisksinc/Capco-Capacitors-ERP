import type { RoleCode } from "@/src/services/supabaseClient";

// Maps each role code to where that role should land after logging in.
// Update the paths on the right to match your actual route folders under app/.
const roleRoutes: Record<RoleCode, string> = {
  super_admin: "/admin",
  production_head: "/productionhead",
  store_head: "/store-head",
  person_a: "/person-a",
  operator_1_metallisation: "/person-a-metallisation",
  operator_2_slitting: "/person-a-slitting",
  slitting_qc: "/person-a-slitting",
  slitting_operator: "/person-a-slitting",
  person_b: "/person-b",
  operator_3_winding: "/person-b",
  operator_4_spray: "/person-b",
  sales: "/sales",
  accountant: "/accountant",
};

// const fallbackRoute = "/unauthorized";

/**
 * Works out where to send someone after login, based on their role code.
 * Falls back to /unauthorized if the role is missing or not in the map.
 */
export function getRouteForRole(roleCode?: string | null): string {
  if (!roleCode) return "";
  return roleRoutes[roleCode as RoleCode] ?? "";
}
