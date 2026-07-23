import { NextResponse } from "next/server";
import { getBearerToken, supabaseAdminConfig } from "@/lib/server/supabaseAdmin";

async function userRest(request: Request, path: string, init: RequestInit = {}) {
  const token = getBearerToken(request);
  if (!token) return { response: NextResponse.json({ ok: false, message: "Authentication required" }, { status: 401 }) };

  const headers = new Headers(init.headers);
  headers.set("apikey", supabaseAdminConfig.anonKey);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");

  const response = await fetch(`${supabaseAdminConfig.url.replace(/\/$/, "")}${path}`, { ...init, headers });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    return { response: NextResponse.json({ ok: false, message: data?.message || response.statusText, details: data }, { status: response.status }) };
  }
  return { data };
}

export async function GET(request: Request) {
  if (!supabaseAdminConfig.url || !supabaseAdminConfig.anonKey) {
    return NextResponse.json({ ok: false, message: "Supabase configuration is missing" }, { status: 500 });
  }

  const url = new URL(request.url);
  const limit = url.searchParams.get("limit") || "50";
  const unreadOnly = url.searchParams.get("unread") === "true";
  const path = `/rest/v1/notifications?select=*&order=created_at.desc&limit=${encodeURIComponent(limit)}${unreadOnly ? "&read_at=is.null" : ""}`;
  const result = await userRest(request, path);
  if (result.response) return result.response;
  return NextResponse.json({ ok: true, notifications: result.data });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await userRest(request, "/rest/v1/rpc/mark_notifications_read", {
    method: "POST",
    body: JSON.stringify({ p_notification_ids: body?.notificationIds ?? null }),
  });
  if (result.response) return result.response;
  return NextResponse.json({ ok: true, updated: result.data });
}
