"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Target, Heart, Zap, Globe2 } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const values = [
    {
      icon: <Globe2 className="w-6 h-6 text-[#f3d773]" />,
      title: "Remote First",
      description: "We believe work is something you do, not somewhere you go. Talent is distributed globally, and tools should support that.",
    },
    {
      icon: <Target className="w-6 h-6 text-[#f3d773]" />,
      title: "Deep Work",
      description: "Constant interruptions kill productivity. We build tools that protect your focus time and encourage meaningful progress.",
    },
    {
      icon: <Zap className="w-6 h-6 text-[#f3d773]" />,
      title: "Async Over Sync",
      description: "Meetings should be the exception, not the rule. We default to asynchronous communication to respect everyone's time.",
    },
    {
      icon: <Heart className="w-6 h-6 text-[#f3d773]" />,
      title: "Radical Candor",
      description: "Clear is kind. We believe in transparent, honest communication that helps individuals and teams grow together.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-8">
            We&apos;re on a mission to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f3d773] to-emerald-500">
              kill the daily standup.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            AsyncUp was born out of frustration. After spending thousands of hours in 
            synchronous status updates that could have been an email, we decided to build a better way.
          </p>
        </section>

        {/* Story Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-muted">
              <Image 
                src="/founder.png" 
                alt="AsyncUp Founder" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  It started with a simple, painful realization: our calendars were dictating our work, instead of our work dictating our calendars. 
                </p>
                <p>
                  Working with distributed teams, I found myself spending half my day jumping between sync calls just to answer one question: <em>&quot;What are you working on today?&quot;</em> The irony was palpable—we were using cutting-edge tools but clinging to outdated 9-to-5 synchronous rituals. The constant context-switching was killing our deep work.
                </p>
                <p>
                  That&apos;s when <strong>AsyncUp</strong> was born. I wanted a way to keep everyone perfectly aligned without the grueling calendar Tetris. We built an AI-powered platform that turns scattered, asynchronous updates into crystal-clear, actionable summaries. 
                </p>
                <p>
                  Today, AsyncUp empowers teams to reclaim their focus, protect their deep work, and leave the mundane status updates to the machines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide how we build our product and our company.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-[#f3d773]/10 flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
