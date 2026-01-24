import React from 'react';

export const metadata = {
  title: 'Workspace Setup - Async Standup',
  description: 'Set up your first workspace',
};

export default function WorkspaceSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't show sidebar during workspace setup
  return <>{children}</>;
}
