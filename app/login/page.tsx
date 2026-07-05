"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock3, Edit3, Eye, EyeOff, LockKeyhole, Phone, ShieldCheck } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

type AuthMode = "otp" | "password";
type OtpStage = "phone" | "verify";

const tokenKey = "__capco_supabase_access_token";
const dashboardPath = "/productionhead/workorder";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function normalizePhone(value: string) {
  return `+91${onlyDigits(value).slice(0, 10)}`;
}

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("otp");
  const [stage, setStage] = useState<OtpStage>("phone");
  const [phone, setPhone] = useState("");
  const [passwordId, setPasswordId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [resendSeconds, setResendSeconds] = useState(30);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const phoneDigits = onlyDigits(phone);
  const otpCode = otp.join("");
  const maskedPhone = useMemo(() => {
    const digits = phoneDigits.padEnd(10, "x");
    return `+91 ${digits.slice(0, 2)}XXXXXX${digits.slice(-2)}`;
  }, [phoneDigits]);

  useEffect(() => {
    if (stage !== "verify" || resendSeconds <= 0) return;
    const timer = window.setTimeout(() => setResendSeconds((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendSeconds, stage]);

  function persistSession(session?: { access_token?: string }) {
    if (session?.access_token) {
      window.localStorage.setItem(tokenKey, session.access_token);
    }
    window.location.href = dashboardPath;
  }

  async function submitJson(path: string, payload: unknown) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) {
      throw new Error(data?.message || "Something went wrong");
    }
    return data;
  }

  async function requestOtp() {
    setMessage("");
    if (phoneDigits.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitJson("/auth/otp/request", { phone: normalizePhone(phone) });
      setStage("verify");
      setResendSeconds(30);
      window.setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyOtp(event?: FormEvent) {
    event?.preventDefault();
    setMessage("");
    if (otpCode.length !== 6) {
      setMessage("Please enter the 6-digit OTP");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await submitJson("/auth/otp/verify", {
        phone: normalizePhone(phone),
        token: otpCode,
      });
      persistSession(data.session);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loginWithPassword(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!passwordId.trim() || !password) {
      setMessage("Please enter your mobile/email and password");
      return;
    }
    setIsSubmitting(true);
    try {
      const id = /^\d{10}$/.test(onlyDigits(passwordId)) && !passwordId.includes("@") ? normalizePhone(passwordId) : passwordId.trim();
      const data = await submitJson("/auth/login", { identifier: id, password });
      persistSession(data.session);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid login");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = onlyDigits(value).slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    if (nextMode === "otp") {
      setStage("phone");
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2f5] text-[#171717] lg:grid lg:grid-cols-[minmax(420px,0.92fr)_minmax(420px,1.08fr)]">
      <section className="hidden min-h-screen flex-col justify-between bg-[#122938] px-12 py-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <ShieldCheck className="h-5 w-5 text-[#14b7dd]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">Capco Capacitors</span>
        </div>
        <div className="max-w-xl">
          <Image src="/logo (2).svg" alt="Capco Capacitors" width={226} height={80} priority className="mb-10 h-auto w-[226px] rounded bg-white px-6 py-4" />
          <h1 className="max-w-md text-5xl font-semibold leading-tight tracking-normal">Warranty and claims access for your team.</h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-white/72">Sign in with OTP or password and continue to the Capco operations dashboard.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm text-white/70">
          <div className="border-t border-white/18 pt-4">Secure OTP</div>
          <div className="border-t border-white/18 pt-4">Password login</div>
          <div className="border-t border-white/18 pt-4">ERP ready</div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-[350px] rounded-[15px] bg-white px-6 pb-9 pt-7 shadow-[0_24px_60px_rgba(18,41,56,0.10)] sm:max-w-[430px] sm:px-9 sm:pb-11 lg:max-w-[440px]">
          <div className="flex justify-center">
            <Image src="/logo (2).svg" alt="Capco Capacitors" width={181} height={64} priority className="h-auto w-[181px]" />
          </div>
          <p className="mx-auto mt-5 max-w-[235px] text-center text-[13px] leading-[17px] text-[#777] sm:text-[14px]">
            Manage your product warranty &amp; claims easily
          </p>

          <div className="mt-7 grid grid-cols-2 rounded-xl bg-[#f2f6f8] p-1">
            <button
              type="button"
              onClick={() => switchMode("otp")}
              className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${
                mode === "otp" ? "bg-white text-[#12b6dc] shadow-sm" : "text-[#6d7478]"
              }`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              OTP
            </button>
            <button
              type="button"
              onClick={() => switchMode("password")}
              className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${
                mode === "password" ? "bg-white text-[#12b6dc] shadow-sm" : "text-[#6d7478]"
              }`}
            >
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Password
            </button>
          </div>

          {mode === "otp" && stage === "phone" ? (
            <form className="mt-6" onSubmit={(event) => { event.preventDefault(); requestOtp(); }}>
              <label className="text-[12px] font-semibold text-[#171717]" htmlFor="phone">Phone Number</label>
              <div className="mt-2 flex h-[31px] items-center rounded-[8px] border border-[#e3e3e3] bg-white px-2 focus-within:border-[#13b8dd]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e7e7e7] bg-white" aria-hidden="true">
                  <span className="block h-full w-full bg-[linear-gradient(to_bottom,#ff9933_0_33%,#fff_33%_66%,#138808_66%_100%)]" />
                </span>
                <span className="ml-2 text-[12px] font-medium text-[#333]">+91</span>
                <span className="mx-2 h-4 w-px bg-[#e4e4e4]" />
                <input
                  id="phone"
                  value={formatPhone(phone)}
                  onChange={(event) => setPhone(onlyDigits(event.target.value).slice(0, 10))}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="(555) 000-0000"
                  className="min-w-0 flex-1 border-0 bg-transparent text-[12px] text-[#171717] outline-none placeholder:text-[#b6b6b6]"
                />
              </div>
              <p className={`mt-1 flex items-center gap-1 text-[10px] ${phoneDigits.length && phoneDigits.length !== 10 ? "text-[#d44848]" : "text-[#8c8c8c]"}`}>
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Please enter a valid 10-digit mobile number
              </p>
              <p className="mx-auto mt-7 max-w-[240px] text-center text-[12px] leading-[15px] text-[#888]">
                We will send a one-time password (OTP) to verify your number.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-[7px] bg-[#12b6dc] text-[12px] font-bold text-white transition hover:bg-[#0da9ce] disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? "Sending..." : "Get OTP"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          ) : null}

          {mode === "otp" && stage === "verify" ? (
            <form className="mt-6" onSubmit={verifyOtp}>
              <h2 className="text-[18px] font-bold text-[#171717]">Verify OTP</h2>
              <p className="mt-2 max-w-[220px] text-[12px] leading-5 text-[#777]">Enter the 6-digit code sent to {maskedPhone}</p>
              <div className="mt-5 grid grid-cols-6 gap-[10px]">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      otpRefs.current[index] = node;
                    }}
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`OTP digit ${index + 1}`}
                    className="h-9 w-full rounded-[8px] border border-[#e5e5e5] text-center text-[15px] font-semibold text-[#171717] outline-none transition focus:border-[#12b6dc] focus:bg-[#edfbff]"
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={resendSeconds > 0 || isSubmitting}
                onClick={requestOtp}
                className="mx-auto mt-5 flex h-8 items-center justify-center gap-2 rounded-full bg-[#f3f3f3] px-4 text-[12px] font-medium text-[#747474] disabled:opacity-100"
              >
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                {resendSeconds > 0 ? `Resend OTP in 00:${String(resendSeconds).padStart(2, "0")}` : "Resend OTP"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-[7px] bg-[#12b6dc] text-[12px] font-bold text-white transition hover:bg-[#0da9ce] disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? "Verifying..." : "Verify & Continue"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setStage("phone");
                  setOtp(Array(6).fill(""));
                  setMessage("");
                }}
                className="mx-auto mt-4 flex items-center justify-center gap-2 text-[12px] font-bold text-[#12b6dc]"
              >
                <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                Wrong number? Change mobile number
              </button>
            </form>
          ) : null}

          {mode === "password" ? (
            <form className="mt-6" onSubmit={loginWithPassword}>
              <label className="text-[12px] font-semibold text-[#171717]" htmlFor="password-id">Mobile Number or Email</label>
              <input
                id="password-id"
                value={passwordId}
                onChange={(event) => setPasswordId(event.target.value)}
                autoComplete="username"
                placeholder="+91XXXXXXXXXX or name@company.com"
                className="mt-2 h-10 w-full rounded-[8px] border border-[#e3e3e3] px-3 text-[13px] outline-none transition placeholder:text-[#b6b6b6] focus:border-[#13b8dd]"
              />
              <label className="mt-4 block text-[12px] font-semibold text-[#171717]" htmlFor="password">Password</label>
              <div className="mt-2 flex h-10 items-center rounded-[8px] border border-[#e3e3e3] px-3 focus-within:border-[#13b8dd]">
                <input
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="min-w-0 flex-1 border-0 bg-transparent text-[13px] outline-none placeholder:text-[#b6b6b6]"
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="ml-2 text-[#7f878b]" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-[7px] bg-[#12b6dc] text-[12px] font-bold text-white transition hover:bg-[#0da9ce] disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? "Signing in..." : "Login & Continue"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          ) : null}

          {message ? <p className="mt-4 rounded-lg bg-[#fff4f4] px-3 py-2 text-center text-[12px] font-medium text-[#c73939]">{message}</p> : null}

          <p className={`mx-auto max-w-[270px] text-center text-[11px] leading-[15px] text-[#8a8a8a] ${mode === "otp" && stage === "verify" ? "mt-28 sm:mt-32" : "mt-36 sm:mt-40"}`}>
            {mode === "otp" && stage === "verify" ? (
              "Didn't receive the code? Check your SMS or try again"
            ) : (
              <>
                By clicking Continue, I have read and agree with the <span className="font-semibold text-[#555]">Term Sheet</span>, <span className="font-semibold text-[#555]">Privacy Policy</span>
              </>
            )}
          </p>
        </div>
      </section>
    </main>
  );
}
