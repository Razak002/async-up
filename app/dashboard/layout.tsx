"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Desktop sidebar (always visible on lg+) ─────── */}
      <div className="hidden lg:flex h-full">
        <Sidebar workspaceName="My Team" />
      </div>

      {/* ── Mobile sidebar drawer ────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer panel — slides from left */}
          <div className="relative z-10 h-full animate-in slide-in-from-left duration-200">
            <Sidebar
              workspaceName="My Team"
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Main content area ────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 shrink-0 border-b border-border bg-card flex items-center px-4 md:px-8 gap-3">
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors mr-1"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          {/* Mobile brand name */}
          <span
            className="lg:hidden text-sm font-bold"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "#013E37",
            }}
          >
            AsyncUp
          </span>

          <div className="flex-1" />

          {/* Live indicator */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(1,62,55,0.07)",
              color: "#013E37",
              border: "1px solid rgba(1,62,55,0.12)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#013E37" }}
            />
            Live
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
