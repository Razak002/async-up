"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Scale } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "June 25, 2026";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <div className="bg-muted/50 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
              <Scale className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 prose prose-emerald dark:prose-invert prose-lg">
          <p className="lead text-xl text-muted-foreground mb-12">
            Welcome to AsyncUp. By accessing or using our website, services, or applications, you agree to be bound by these 
            Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf 
            of an entity, and AsyncUp ("we," "us," or "our"), concerning your access to and use of the AsyncUp application.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">2. Description of Service</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            AsyncUp provides an AI-powered asynchronous standup and team synchronization platform. We reserve the right to 
            modify, suspend, or discontinue the service with or without notice at any time. We shall not be liable to you 
            or any third party should we exercise this right.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">3. User Accounts and Security</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            To use certain features of the service, you must register for an account. You agree to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
            <li>Provide accurate, current, and complete information.</li>
            <li>Maintain the security of your password and identification.</li>
            <li>Promptly notify us of any unauthorized use of your account.</li>
            <li>Accept all risks of unauthorized access to the data you provide.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">4. Acceptable Use Policy</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs 
            the service. You may not attempt to gain unauthorized access to our systems, scrape our data, or use our 
            platform to distribute malware or spam.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">5. Intellectual Property</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            The service and its original content, features, and functionality are owned by AsyncUp and are protected by 
            international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain all 
            rights to the content you submit to your workspace.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">6. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            In no event shall AsyncUp, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable 
            for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of 
            profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability 
            to access or use the service.
          </p>

          <div className="mt-16 p-8 bg-muted rounded-2xl border border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">Legal inquiries?</h3>
            <p className="text-muted-foreground mb-0">
              If you have any questions about these Terms of Service, please contact our legal team at <a href="mailto:legal@asyncup.com" className="text-emerald-500 hover:text-emerald-600 transition-colors">legal@asyncup.com</a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
