"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Plus,
  Users,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
    label: "Overview",
  },
  {
    name: "Submit Standup",
    href: "/dashboard/submit",
    icon: Plus,
    label: "Daily check-in",
  },
  {
    name: "Team Standups",
    href: "/dashboard/standups",
    icon: Users,
    label: "View team",
  },
  {
    name: "Summaries",
    href: "/dashboard/summaries",
    icon: FileText,
    label: "AI insights",
  },
];

const MANAGER_ITEMS = [
  {
    name: "Analytics",
    href: "/manager/analytics",
    icon: BarChart3,
    label: "Reports",
  },
];

interface SidebarProps {
  isManager?: boolean;
  workspaceName?: string;
  onClose?: () => void;
}

export function Sidebar({ isManager, workspaceName, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const items = isManager
    ? [...SIDEBAR_ITEMS, ...MANAGER_ITEMS]
    : SIDEBAR_ITEMS;

  const handleSignOut = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    router.push("/auth/login");
  };

  return (
    <div
      className="flex flex-col h-full w-64 shrink-0 relative"
      style={{
        background: "linear-gradient(180deg, #013E37 0%, #011F1B 100%)",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #FFEFB3 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Logo / Brand */}
      <div className="relative p-6 border-b border-white/10 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shrink-0">
            <Image
              src="/logo.png"
              alt="AsyncUp"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-bold text-base text-[#FFEFB3] tracking-tight leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              AsyncUp
            </p>
            {workspaceName ? (
              <p className="text-xs text-white/50 mt-0.5 truncate">
                {workspaceName}
              </p>
            ) : (
              <p className="text-xs text-white/40 mt-0.5">Workspace</p>
            )}
          </div>
        </Link>
        {/* Close button — only shown in mobile drawer */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-3 mb-3">
          Navigation
        </p>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-[#FFEFB3] shadow-md"
                    : "hover:bg-white/8 text-white/70 hover:text-white",
                )}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                    style={{ background: "#013E37" }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                    isActive
                      ? "text-[#013E37]"
                      : "text-white/60 group-hover:text-white",
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold leading-none",
                      isActive
                        ? "text-[#013E37]"
                        : "text-white/80 group-hover:text-white",
                    )}
                  >
                    {item.name}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] mt-0.5",
                      isActive
                        ? "text-[#013E37]/60"
                        : "text-white/30 group-hover:text-white/50",
                    )}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom settings */}
      <div className="relative p-4 border-t border-white/10 space-y-1">
        <Link href="/dashboard/settings">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
              pathname === "/dashboard/settings"
                ? "bg-[#FFEFB3]"
                : "hover:bg-white/8 text-white/70 hover:text-white",
            )}
          >
            <Settings
              className={cn(
                "w-4 h-4",
                pathname === "/dashboard/settings"
                  ? "text-[#013E37]"
                  : "text-white/60 group-hover:text-white",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                pathname === "/dashboard/settings"
                  ? "text-[#013E37]"
                  : "text-white/80 group-hover:text-white",
              )}
            >
              Settings
            </span>
          </div>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-red-500/10 text-white/50 hover:text-red-300"
        >
          <LogOut className="w-4 h-4 text-white/40 group-hover:text-red-400 transition-colors" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
