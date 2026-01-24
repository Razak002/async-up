"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Plus,
  Users,
  FileText,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Submit Standup",
    href: "/dashboard/submit",
    icon: Plus,
  },
  {
    name: "Team Standups",
    href: "/dashboard/standups",
    icon: Users,
  },
  {
    name: "Summaries",
    href: "/dashboard/summaries",
    icon: FileText,
  },
];

const MANAGER_ITEMS = [
  {
    name: "Analytics",
    href: "/manager/analytics",
    icon: BarChart3,
  },
];

interface SidebarProps {
  isManager?: boolean;
  workspaceName?: string;
}

export function Sidebar({ isManager, workspaceName }: SidebarProps) {
  const pathname = usePathname();

  const items = isManager
    ? [...SIDEBAR_ITEMS, ...MANAGER_ITEMS]
    : SIDEBAR_ITEMS;

  return (
    <div className="flex flex-col h-full w-64 border-r border-border bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-sm">
              AG
            </span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-sidebar-foreground">
              Async Standup
            </p>
            {workspaceName && (
              <p className="text-xs text-sidebar-accent-foreground opacity-75">
                {workspaceName}
              </p>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sm font-medium",
                  isActive && "bg-sidebar-primary/10 text-sidebar-primary",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-border space-y-2">
        <Link href="/dashboard/settings">
          <Button
            variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 text-sm font-medium"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Button>
        </Link>
        <Link href="/auth/login">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
