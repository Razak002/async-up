"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const includedFeatures = [
    "Unlimited Team Members",
    "Unlimited Workspaces",
    "AI-Powered Summaries",
    "Manager Dashboards & Analytics",
    "Slack & Email Integrations",
    "Customizable Templates",
    "Enterprise Grade Security",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3d773]/10 text-[#f3d773] border border-[#f3d773]/20 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">Early Access Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6">
            Everything you need. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Completely Free.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            We're currently in beta. Sign up today and get full access to all AsyncUp premium features at no cost.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="w-full max-w-md relative group">
          {/* Animated glow background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#f3d773] to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-card border border-border/50 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground">Pro Plan</h3>
                <p className="text-muted-foreground mt-1">For teams that want it all</p>
              </div>
              <div className="text-right">
                <div className="flex items-start justify-end">
                  <span className="text-xl font-semibold text-muted-foreground line-through mr-2">$15</span>
                  <span className="text-4xl font-bold text-foreground">$0</span>
                </div>
                <p className="text-sm text-emerald-500 font-medium mt-1">Free forever for early adopters</p>
              </div>
            </div>

            <div className="h-px w-full bg-border/50 my-8" />

            <ul className="space-y-4 mb-8">
              {includedFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/auth/signup" className="block w-full">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-base h-14 shadow-lg hover:shadow-xl transition-all"
              >
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
