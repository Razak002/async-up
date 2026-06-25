"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export function Footer() {
  const handleFeatureSoon = (name: string) => {
    toast.info(`${name} is coming soon!`, {
      description: "We're currently building this feature. Stay tuned! 🚀",
      icon: <Sparkles className="w-4 h-4 text-[#FFEFB3]" />,
    });
  };

  const footerNavigation = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features", soon: false },
        { name: "Pricing", href: "/pricing", soon: false },
        { name: "Dashboard", href: "/dashboard", soon: false },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about", soon: false },
        { name: "Blog", href: "/blog", soon: false },
        { name: "Twitter", href: "https://x.com/zakson002", soon: false, external: true },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "/privacy", soon: false },
        { name: "Terms", href: "/terms", soon: false },
        { name: "Contact", href: "/contact", soon: false },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background mt-16 sm:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="relative flex items-center gap-3 group">
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
              </Link>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered async standups for distributed teams. Reclaim your calendar, one update at a time.
            </p>
          </div>

          {footerNavigation.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-xs">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <div className="flex items-center gap-2 group">
                      {link.soon ? (
                        <button
                          onClick={() => handleFeatureSoon(link.name)}
                          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-2"
                        >
                          {link.name}
                          <span 
                            className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter"
                            style={{ 
                              background: "#FFEFB3",
                              color: "#013e37",
                              border: "1px solid rgba(255, 239, 179, 0.2)"
                            }}
                          >
                            Soon
                          </span>
                        </button>
                      ) : link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2026 Async Standup Generator. All rights reserved.
          </p>
          <div className="flex gap-8 items-center">
            <a
              href="https://x.com/zakson002"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-[#FFEFB3] transition-colors"
              aria-label="Follow us on Twitter"
            >
              Twitter
            </a>
            <a
              href="https://github.com/Razak002/async-up"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-[#FFEFB3] transition-colors"
              aria-label="View our GitHub"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/abdulrazak-aliyu-9b328123b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-[#FFEFB3] transition-colors"
              aria-label="Connect on LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
