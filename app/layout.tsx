import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/landing/scroll-to-top";
import "./globals.css";

export const metadata: Metadata = {
  title: "AsyncUp — AI-Powered Team Standups",
  description:
    "Transform the way your async team collaborates. Collect, summarize, and track standups with AI-powered insights in one elegant workspace.",
  keywords: [
    "async standup",
    "team collaboration",
    "standup generator",
    "remote team",
    "AI standup summary",
  ],
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#013E37",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
        <Analytics />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#013E37",
              color: "#FFEFB3",
              border: "1px solid rgba(255,239,179,0.15)",
              borderRadius: "12px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
            },
          }}
          richColors
        />
        <ScrollToTop />
      </body>
    </html>
  );
}
