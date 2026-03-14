// app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createWorkspaceAction } from '@/app/actions/auth';
import { getAuthToken } from '@/lib/auth-token';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceSlug, setWorkspaceSlug] = useState('');

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setWorkspaceName(name);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setWorkspaceSlug(slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!workspaceName.trim() || !workspaceSlug.trim()) {
      setError('Please provide workspace name and slug');
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Session expired. Please log in again.');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      console.log('[Onboarding] Creating workspace with token');

      const result = await createWorkspaceAction(workspaceName, workspaceSlug, token);

      if (!result.success) {
        setError(result.error || 'Failed to create workspace');
        setLoading(false);
        return;
      }

      console.log('[Onboarding] Workspace created:', result.data?.slug);

      // Redirect to dashboard
      router.push(`/dashboard`);
    } catch (err) {
      console.error('[Onboarding] Error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Create Your Team 🚀</CardTitle>
          <CardDescription>
            Set up your workspace to start collecting standups
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Team Name</Label>
              <Input
                id="workspace-name"
                placeholder="e.g., Engineering Team, Acme Inc"
                value={workspaceName}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspace-slug">Team Slug</Label>
              <Input
                id="workspace-slug"
                placeholder="e.g., engineering-team"
                value={workspaceSlug}
                onChange={(e) => setWorkspaceSlug(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                This will be used in your workspace URL
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !workspaceName.trim()}
            >
              {loading ? 'Creating Workspace...' : 'Create Workspace'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}