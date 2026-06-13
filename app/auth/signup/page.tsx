"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signUpAction,
  signInAction,
  getUserWorkspacesAction,
} from "@/app/actions/auth";
import { setAuthToken } from "@/lib/auth-token";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Sparkles,
  Users,
  BrainCircuit,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const STATS = [
  { icon: Users, value: "10x", label: "Faster team check-ins" },
  { icon: BrainCircuit, value: "AI", label: "Summaries, auto-generated" },
  { icon: TrendingUp, value: "0", label: "Meetings replaced" },
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cb = new URLSearchParams(window.location.search).get("callbackUrl");
      if (cb) setCallbackUrl(cb);
    }
  }, []);

  const onSubmit = async (data: SignupFormValues) => {
    setError("");
    setLoading(true);
    try {
      const signupResult = await signUpAction(
        data.email,
        data.password,
      );
      if (!signupResult.success) {
        setError(signupResult.error || "Signup failed");
        return;
      }

      const signinResult = await signInAction(
        data.email,
        data.password,
      );
      if (!signinResult.success || !signinResult.data?.accessToken) {
        setError("Account created! Please log in.");
        setTimeout(() => router.push("/auth/login"), 2000);
        return;
      }

      setAuthToken(signinResult.data.accessToken);
      if (callbackUrl) {
        router.push(callbackUrl);
        return;
      }

      const workspacesRes = await getUserWorkspacesAction(
        signinResult.data.accessToken,
      );
      router.push(
        workspacesRes.success &&
          workspacesRes.data &&
          workspacesRes.data.length > 0
          ? "/dashboard"
          : "/onboarding",
      );
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm font-semibold transition-all duration-200 text-muted-foreground hover:text-foreground lg:text-[#FFEFB3]/70 lg:hover:text-[#FFEFB3]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      {/* ── Left brand panel ───────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #013E37 0%, #011F1B 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #FFEFB3 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Glow blobs */}
        <div
          className="absolute -top-16 -right-16 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: "#FFEFB3" }}
        />
        <div
          className="absolute bottom-1/4 -left-8 w-56 h-56 rounded-full blur-3xl opacity-8"
          style={{ background: "#FFE57A" }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shrink-0">
            <Image
              src="/logo.png"
              alt="AsyncUp"
              fill
              className="object-cover"
            />
          </div>
          <span
            className="text-xl font-bold text-[#FFEFB3]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            AsyncUp
          </span>
        </div>

        {/* Hero copy — different from login */}
        <div className="relative space-y-7 mt-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(255,239,179,0.12)",
              border: "1px solid rgba(255,239,179,0.2)",
              color: "#FFEFB3",
            }}
          >
            <Sparkles className="w-3 h-3" />
            Your workspace is waiting
          </div>

          <h1
            className="text-[3.2rem] font-bold text-white leading-[1.05]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.04em",
            }}
          >
            Stop chasing
            <br />
            updates.
            <br />
            <span style={{ color: "#FFEFB3" }}>Let AI do it.</span>
          </h1>

          <p className="text-base text-white/55 leading-relaxed max-w-xs">
            One workspace. Every voice heard. Zero meetings wasted. Build a
            culture where async actually works.
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col gap-1.5 rounded-xl p-3"
                style={{
                  background: "rgba(255,239,179,0.07)",
                  border: "1px solid rgba(255,239,179,0.10)",
                }}
              >
                <Icon className="w-4 h-4 text-[#FFEFB3]/60" />
                <span
                  className="text-xl font-bold text-[#FFEFB3]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {value}
                </span>
                <span className="text-[10px] leading-tight text-white/40">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative">
          <p className="text-sm text-white/35 italic">
            &ldquo;Built for teams that move fast and communicate even
            faster.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Right form panel ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="relative flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shrink-0">
                <Image
                  src="/logo.png"
                  alt="AsyncUp"
                  fill
                  className="object-cover"
                />
              </div>
              <span
                className="text-xl font-bold text-[#f3d773]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                AsyncUp
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2
              className="text-3xl font-bold text-foreground"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              Create your account
            </h2>
            <p className="text-muted-foreground text-sm">
              Free forever for small teams. No credit card required.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  color: "#dc2626",
                }}
              >
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...register("email")}
                disabled={loading}
                className={`h-11 rounded-xl border-border ${
                  errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                {...register("password")}
                disabled={loading}
                className={`h-11 rounded-xl border-border ${
                  errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-foreground"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={loading}
                className={`h-11 rounded-xl border-border ${
                  errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                background: "linear-gradient(135deg, #013E37 0%, #025748 100%)",
                color: "#FFEFB3",
                boxShadow: "0 4px 14px rgba(1,62,55,0.25)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating
                  account...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Get started free
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold hover:underline"
              style={{ color: "#013E37" }}
            >
              Sign in
            </Link>
          </p>

          {/* Legal */}
          <p className="text-center text-xs text-muted-foreground/60 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="#" className="underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
