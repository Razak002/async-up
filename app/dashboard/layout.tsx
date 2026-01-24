import React from "react"
import { Sidebar } from '@/components/dashboard/sidebar';

export const metadata = {
  title: 'Dashboard - Async Standup',
  description: 'Manage your team standups and summaries',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar workspaceName="My Team" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
