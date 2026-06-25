"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Zap, Users, BarChart3, Bot, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-[#f3d773]" />,
      title: "AI-Powered Summaries",
      description: "Our AI automatically digests team standups and generates concise, actionable summaries. Never miss a blocker again.",
      color: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#f3d773]" />,
      title: "Asynchronous by Design",
      description: "Say goodbye to sync meetings. Team members submit updates when it suits them, across any time zone.",
      color: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-[#f3d773]" />,
      title: "Advanced Analytics",
      description: "Track team velocity, identify recurring blockers, and measure participation rates through intuitive manager dashboards.",
      color: "bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: <Zap className="w-8 h-8 text-[#f3d773]" />,
      title: "Instant Notifications",
      description: "Integrates seamlessly with Slack and email to keep everyone in the loop without constant context switching.",
      color: "bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: <Users className="w-8 h-8 text-[#f3d773]" />,
      title: "Cross-Functional Sync",
      description: "Easily align engineering, product, and design teams with customized, role-specific update templates.",
      color: "bg-rose-500/10 border-rose-500/20",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#f3d773]" />,
      title: "Enterprise Grade Security",
      description: "Your data is encrypted at rest and in transit. SOC2 compliant infrastructure designed for teams that value privacy.",
      color: "bg-zinc-500/10 border-zinc-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6">
            Everything you need to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f3d773] to-[#e6b800]">
              run better teams
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to replace synchronous meetings, boost productivity, and give managers the insights they need.
          </p>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-card ${feature.color}`}
              >
                <div className="w-14 h-14 rounded-xl bg-background/50 flex items-center justify-center mb-6 shadow-sm border border-border/50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 relative z-10">
              Ready to transform your standups?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of teams who have reclaimed their calendar and boosted their productivity with AsyncUp.
            </p>
            <Link href="/auth/signup" className="relative z-10">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-base h-14 px-10 shadow-lg hover:shadow-xl transition-all"
              >
                Start for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
