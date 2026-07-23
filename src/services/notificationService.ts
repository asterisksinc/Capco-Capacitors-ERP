import { supabaseRest, type ListParams } from "./supabaseClient";

export type PushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export const notificationService = {
  list(params?: ListParams) {
    return supabaseRest.list("notifications", {
      select: params?.select ?? "*",
      order: params?.order ?? "created_at",
      ascending: params?.ascending,
      filters: params?.filters,
      limit: params?.limit,
      offset: params?.offset,
    });
  },
  unreadCount() {
    return supabaseRest
      .list<{ id: string; read_at?: string | null }>("notifications", { select: "id,read_at" })
      .then((rows) => rows.filter((row) => !row.read_at).length);
  },
  markRead(notificationIds?: string[]) {
    return supabaseRest.rpc<number>("mark_notifications_read", {
      p_notification_ids: notificationIds ?? null,
    });
  },
  registerPushSubscription(subscription: PushSubscriptionPayload, userAgent?: string) {
    return supabaseRest.rpc("register_push_subscription", {
      p_endpoint: subscription.endpoint,
      p_p256dh: subscription.keys.p256dh,
      p_auth: subscription.keys.auth,
      p_user_agent: userAgent ?? null,
    });
  },
  deactivatePushSubscription(endpoint: string) {
    return supabaseRest.rpc("deactivate_push_subscription", { p_endpoint: endpoint });
  },
};
