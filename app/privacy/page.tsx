"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "June 25, 2026";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <div className="bg-muted/50 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 prose prose-emerald dark:prose-invert prose-lg">
          <p className="lead text-xl text-muted-foreground mb-12">
            At AsyncUp, we believe that your data is yours. We are committed to protecting your privacy 
            and ensuring that your team's standup updates, blockers, and organizational data remain secure 
            and confidential.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            When you use AsyncUp, we collect information that you provide directly to us, such as when you create an account, 
            update your profile, or submit a standup update. This includes your name, email address, and any content 
            you choose to share within your workspace.
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We also automatically collect certain technical information when you access our services, including 
            your IP address, browser type, and usage data to help us improve our platform.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
            <li>Provide, maintain, and improve the AsyncUp platform.</li>
            <li>Process and summarize your team's standup updates using our AI models.</li>
            <li>Send you technical notices, updates, and security alerts.</li>
            <li>Respond to your comments, questions, and customer service requests.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">3. Data Security and AI Processing</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Security is built into everything we do. Your data is encrypted in transit using TLS and at rest using AES-256. 
            When we use AI models to summarize your standups, your data is processed securely and is <strong>never</strong> used 
            to train public models. We maintain strict access controls and regularly audit our security practices.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">4. Sharing Your Information</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We do not sell your personal information. We may share your information with third-party service providers 
            who perform services on our behalf, such as cloud hosting and payment processing. These providers are bound 
            by strict confidentiality agreements.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">5. Your Data Rights</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Depending on your location, you may have the right to access, update, or delete your personal information. 
            Workspace administrators can manage team data directly within the AsyncUp dashboard. If you need assistance 
            exercising these rights, please contact our privacy team.
          </p>

          <div className="mt-16 p-8 bg-muted rounded-2xl border border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">Have questions?</h3>
            <p className="text-muted-foreground mb-0">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@asyncup.com" className="text-emerald-500 hover:text-emerald-600 transition-colors">privacy@asyncup.com</a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
