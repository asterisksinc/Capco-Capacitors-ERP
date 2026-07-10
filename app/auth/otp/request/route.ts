import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

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
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

  if (!/^\+[0-9]{8,15}$/.test(phone)) {
    return NextResponse.json(
      {
        ok: false,
        message: "A valid phone number with country code is required",
      },
      { status: 400 },
    );
  }

  const response = await fetch(new URL("/auth/v1/otp", supabaseUrl), {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      phone,
      create_user: false,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: data?.msg || data?.message || "Unable to send OTP",
        details: data,
      },
      { status: response.status },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "OTP sent successfully",
    details: data,
  });
}
