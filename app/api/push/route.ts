import { NextResponse } from "next/server";
import webpush from "web-push";
import { getBearerToken, missingSupabaseAdminResponse, supabaseAdminConfig, supabaseAdminRequest } from "@/lib/server/supabaseAdmin";

type PendingNotification = {
  id: string;
  recipient_profile_id: string;
  title: string;
  body: string;
  entity_type?: string | null;
  entity_id?: string | null;
  entity_code?: string | null;
};

type StoredSubscription = {
  id: string;
  profile_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

function configureWebPush() {
  const subject = process.env.WEB_PUSH_SUBJECT || "mailto:admin@capco.local";
  const publicKey = process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY || process.env.WEB_PUSH_VAPID_PUBLIC_KEY || "";
  const privateKey = process.env.WEB_PUSH_VAPID_PRIVATE_KEY || "";

  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

async function userRpc<T>(request: Request, fnName: string, payload: unknown) {
  const token = getBearerToken(request);
  if (!token) {
    return { response: NextResponse.json({ ok: false, message: "Authentication required" }, { status: 401 }) };
  }

  const response = await fetch(`${supabaseAdminConfig.url.replace(/\/$/, "")}/rest/v1/rpc/${fnName}`, {
    method: "POST",
    headers: {
      apikey: supabaseAdminConfig.anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return {
      response: NextResponse.json({ ok: false, message: data?.message || response.statusText, details: data }, { status: response.status }),
    };
  }
  return { data: data as T };
}

export async function POST(request: Request) {
  if (!supabaseAdminConfig.url || !supabaseAdminConfig.anonKey) {
    return NextResponse.json({ ok: false, message: "Supabase configuration is missing" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const action = typeof body?.action === "string" ? body.action : "register";

  if (action === "register") {
    const subscription = body?.subscription;
    const result = await userRpc(request, "register_push_subscription", {
      p_endpoint: subscription?.endpoint,
      p_p256dh: subscription?.keys?.p256dh,
      p_auth: subscription?.keys?.auth,
      p_user_agent: request.headers.get("user-agent"),
    });
    if (result.response) return result.response;
    return NextResponse.json({ ok: true, subscription: result.data });
  }

  if (action !== "sendPending") {
    return NextResponse.json({ ok: false, message: "Unsupported push action" }, { status: 400 });
  }

  if (!supabaseAdminConfig.serviceRoleKey) return missingSupabaseAdminResponse();

  const pushConfigured = configureWebPush();
  const pending = await supabaseAdminRequest<PendingNotification[]>(
    "/rest/v1/notifications?select=*&push_status=eq.pending&order=created_at.asc&limit=50",
  );

  if (!pushConfigured) {
    await Promise.all(
      pending.map((notification) =>
        supabaseAdminRequest(`/rest/v1/notifications?id=eq.${encodeURIComponent(notification.id)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ push_status: "not_configured", push_attempted_at: new Date().toISOString() }),
        }),
      ),
    );
    return NextResponse.json({ ok: true, sent: 0, failed: 0, notConfigured: pending.length });
  }

  let sent = 0;
  let failed = 0;

  for (const notification of pending) {
    const subscriptions = await supabaseAdminRequest<StoredSubscription[]>(
      `/rest/v1/push_subscriptions?select=*&profile_id=eq.${encodeURIComponent(notification.recipient_profile_id)}&is_active=eq.true`,
    );

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      data: {
        notificationId: notification.id,
        entityType: notification.entity_type,
        entityId: notification.entity_id,
        entityCode: notification.entity_code,
      },
    });

    const outcomes = await Promise.allSettled(
      subscriptions.map((subscription) =>
        webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          payload,
        ),
      ),
    );

    const rejected = outcomes.filter((outcome) => outcome.status === "rejected");
    const notificationSent = outcomes.length - rejected.length;
    sent += notificationSent;
    failed += rejected.length;

    await Promise.all(
      outcomes.map((outcome, index) => {
        const subscription = subscriptions[index];
        if (!subscription) return Promise.resolve();
        if (outcome.status === "fulfilled") {
          return supabaseAdminRequest(`/rest/v1/push_subscriptions?id=eq.${encodeURIComponent(subscription.id)}`, {
            method: "PATCH",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({ failure_count: 0, last_success_at: new Date().toISOString() }),
          });
        }
        return supabaseAdminRequest(`/rest/v1/push_subscriptions?id=eq.${encodeURIComponent(subscription.id)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            is_active: false,
            failure_count: 1,
            last_failure_at: new Date().toISOString(),
          }),
        });
      }),
    );

    await supabaseAdminRequest(`/rest/v1/notifications?id=eq.${encodeURIComponent(notification.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        push_status: outcomes.length === 0 ? "sent" : rejected.length > 0 && notificationSent === 0 ? "failed" : "sent",
        push_error: rejected[0]?.status === "rejected" ? String(rejected[0].reason?.message || rejected[0].reason) : null,
        push_attempted_at: new Date().toISOString(),
      }),
    });
  }

  return NextResponse.json({ ok: true, sent, failed });
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await userRpc(request, "deactivate_push_subscription", {
    p_endpoint: body?.endpoint,
  });
  if (result.response) return result.response;
  return NextResponse.json({ ok: true });
}
