import React from 'react';

export const metadata = {
  title: 'Async Standup - Authentication',
  description: 'Sign up or log in to Async Standup',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
