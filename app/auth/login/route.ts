import { NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function passwordGrant(credentials: { email?: string; phone?: string; password: string }) {
  const response = await fetch(new URL("/auth/v1/token?grant_type=password", supabaseUrl), {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json().catch(() => null);
  return { response, data };
}

async function findEmailByPhone(phone: string) {
  if (!supabaseServiceRoleKey) return "";

  const url = new URL("/rest/v1/profiles", supabaseUrl);
  url.searchParams.set("select", "email");
  url.searchParams.set("phone", `eq.${phone}`);
  url.searchParams.set("status", "eq.active");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Accept: "application/json",
    },
  });

  const rows = await response.json().catch(() => null);
  return Array.isArray(rows) && typeof rows[0]?.email === "string" ? rows[0].email : "";
}

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        ok: false,
        message: "SUPABASE_URL and SUPABASE_ANON_KEY must be set",
      },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);

  const identifier = typeof body?.identifier === "string" ? body.identifier.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const loginId = identifier || email || phone;

  if (!loginId || !password) {
    return NextResponse.json(
      {
        ok: false,
        message: "email/phone and password are required",
      },
      { status: 400 },
    );
  }

  const isPhone = /^\+?[0-9]{8,15}$/.test(loginId);

  let { response, data } = await passwordGrant({
    [isPhone ? "phone" : "email"]: loginId,
    password,
  });

  if (!response.ok && isPhone && data?.error_code === "phone_provider_disabled") {
    const email = await findEmailByPhone(loginId);

    if (email) {
      ({ response, data } = await passwordGrant({ email, password }));
    } else {
      data = {
        ...data,
        msg: supabaseServiceRoleKey
          ? "No active user found for this phone number"
          : "SUPABASE_SERVICE_ROLE_KEY must be set to support phone number and password login",
      };
    }
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: data?.msg || data?.message || "Invalid login",
        details: data,
      },
      { status: response.status },
    );
  }

  return NextResponse.json({
    ok: true,
    session: {
      access_token: data?.access_token,
      refresh_token: data?.refresh_token,
      expires_in: data?.expires_in,
      token_type: data?.token_type,
    },
    user: data?.user,
  });
}