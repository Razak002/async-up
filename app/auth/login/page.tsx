"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const cb = new URLSearchParams(window.location.search).get("callbackUrl");
      if (cb) setCallbackUrl(cb);
    }
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    setLoading(true);
    try {
      const { data: authData, error: authError } = await signIn(data.email, data.password);
      if (authError || !authData) {
        setError(authError?.message || "Failed to sign in");
        return;
      }
      await new Promise((r) => setTimeout(r, 300));
      router.push(callbackUrl || "/dashboard");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #013E37 0%, #011F1B 100%)",
        }}
      >
        {/* Dot grid bg */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #FFEFB3 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: "#FFEFB3" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-8"
          style={{ background: "#FFEFB3" }}
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

        {/* Hero copy */}
        <div className="relative space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(255,239,179,0.12)",
              border: "1px solid rgba(255,239,179,0.2)",
              color: "#FFEFB3",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFEFB3] animate-pulse" />
            AI-Powered Team Insights
          </div>
          <h1
            className="text-5xl font-bold text-white leading-[1.08]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.04em",
            }}
          >
            Keep your team
            <br />
            <span style={{ color: "#FFEFB3" }}>in perfect sync.</span>
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-sm">
            Async standups that don&apos;t feel async. Collect, summarize, and
            act on team updates — all powered by AI.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              "Daily summaries",
              "Blocker detection",
              "Team analytics",
              "Smart insights",
            ].map((f) => (
              <span
                key={f}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  background: "rgba(255,239,179,0.08)",
                  color: "rgba(255,239,179,0.75)",
                  border: "1px solid rgba(255,239,179,0.12)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative">
          <p className="text-sm text-white/40 italic">
            &ldquo;The fastest way to run standups without running
            meetings.&rdquo;
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
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

          {/* Heading */}
          <div className="space-y-2">
            <h2
              className="text-3xl font-bold text-foreground"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your workspace and pick up where you left off.
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
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...register("email")}
                disabled={loading}
                className={`h-11 rounded-xl border-border focus:ring-2 focus:border-[#013E37] ${
                  errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
                style={{ "--tw-ring-color": "#013E37" } as React.CSSProperties}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-foreground"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-medium hover:underline"
                  style={{ color: "#013E37" }}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #013E37 0%, #025748 100%)",
                color: "#FFEFB3",
                boxShadow: "0 4px 14px rgba(1,62,55,0.25)",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.target as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
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

          {/* Sign up */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold hover:underline"
              style={{ color: "#013E37" }}
            >
              Create one free
            </Link>
          </p>

          {/* Legal */}
          <p className="text-center text-xs text-muted-foreground/60 leading-relaxed">
            By signing in, you agree to our{" "}
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
