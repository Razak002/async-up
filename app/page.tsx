"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, CheckCircle2, Users, Zap, BarChart3, X, Play } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";



export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-6 lg:space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            <span className="text-balance">
              Standup updates
              <br />
              your team actually reads
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            Stop wasting time in synchronous standups. Collect, summarize, and
            track team progress with AI-powered insights. Built for async teams
            that move fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-base h-12 px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
              <Dialog.Trigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base h-12 px-8 border-border hover:bg-muted bg-transparent group"
                >
                  <Play className="mr-2 w-4 h-4 fill-primary text-primary group-hover:fill-primary/80" />
                  Watch Demo
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-1 shadow-2xl duration-200 sm:rounded-2xl">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                    <video
                      src="/AsyncUp_Demo_Video.mp4"
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                    />
                    <Dialog.Close className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 outline-none">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-6 h-6 text-primary" />,
              title: "AI-Powered Summaries",
              description:
                "Automatically summarize team standups into actionable insights and blockers.",
            },
            {
              icon: <Users className="w-6 h-6 text-primary" />,
              title: "Async First",
              description:
                "No more sync meetings. Async submissions + automated digests = happier teams.",
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-primary" />,
              title: "Track Progress",
              description:
                "Manager dashboards show submission rates, blockers, and team velocity.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 border border-border rounded-lg bg-card hover:border-primary/20 transition-colors"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why teams love Async Standup
          </h2>
          <p className="text-lg text-muted-foreground">
            Built specifically for distributed teams
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {[
            "Save 2-3 hours per week on standups",
            "0 context loss - async = deep focus",
            "AI catches blockers automatically",
            "Manager visibility without micromanaging",
            "Slack notifications keep teams in sync",
            "Works for any team size",
          ].map((benefit, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-lg text-foreground">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Stop wasting time on standups
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join teams who&apos;ve replaced their daily standups with async
            updates and AI-powered summaries.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-base h-12 px-8"
            >
              Start for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required. Set up your first workspace in 2 minutes.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
