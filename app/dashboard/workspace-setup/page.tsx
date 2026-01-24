'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createWorkspaceAction } from '@/app/actions/auth';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function WorkspaceSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'type' | 'create' | 'join'>('type');
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceSlug, setWorkspaceSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-generate slug from workspace name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setWorkspaceName(name);
    // Auto-generate slug: lowercase, replace spaces with hyphens
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50);
    setWorkspaceSlug(slug);
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!workspaceName.trim()) {
      setError('Workspace name is required');
      return;
    }

    if (!workspaceSlug.trim()) {
      setError('Workspace slug is required');
      return;
    }

    if (workspaceSlug.length < 3) {
      setError('Workspace slug must be at least 3 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await createWorkspaceAction(workspaceName, workspaceSlug);
      if (result.success) {
        setSuccess(true);
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        // If "Not authenticated" error, suggest re-login
        if (
          result.error?.includes('Not authenticated') ||
          result.error?.includes('user not authenticated')
        ) {
          setError(
            'Session expired. Please log in again to create a workspace.'
          );
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        } else {
          setError(result.error || 'Failed to create workspace');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Choose action
  if (step === 'type') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="mb-12 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AG</span>
              </div>
              <span className="font-semibold text-lg text-foreground">
                Async Standup
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Async Standup
            </h1>
            <p className="text-muted-foreground">
              Let's get your team set up. What would you like to do?
            </p>
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Workspace */}
            <Card
              className="border-border cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setStep('create')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-semibold">+</span>
                  </div>
                  Create Team
                </CardTitle>
                <CardDescription>
                  Start a new workspace for your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Best for: New teams, departments, or projects that need to track standups.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Create your workspace
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Invite team members
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Start collecting standups
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                  Create Workspace
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Join Workspace */}
            <Card className="border-border border-dashed cursor-pointer hover:shadow-lg transition-shadow opacity-50 pointer-events-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground font-semibold">→</span>
                  </div>
                  Join Team
                </CardTitle>
                <CardDescription>
                  Join an existing workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Best for: Team members joining an existing workspace.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="opacity-50">Enter invite code</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="opacity-50">Join workspace</span>
                  </div>
                </div>
                <Button
                  disabled
                  className="w-full bg-muted text-muted-foreground hover:bg-muted mt-4"
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Already have a workspace?{' '}
              <Link href="/dashboard" className="text-primary hover:underline">
                Go to dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Create Workspace
  if (step === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AG</span>
              </div>
              <span className="font-semibold text-lg text-foreground">
                Async Standup
              </span>
            </Link>
          </div>

          {/* Success State */}
          {success && (
            <Card className="border-green-600/20 bg-green-50 dark:bg-green-950/20 mb-8">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-green-600/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Workspace Created!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                    Redirecting to dashboard...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form */}
          <Card className="border-border">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep('type')}
                  className="h-8 w-8 p-0 border-border bg-transparent"
                >
                  ←
                </Button>
                <div>
                  <CardTitle className="text-2xl">Create Your Team</CardTitle>
                  <CardDescription>Set up your first workspace</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Team Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Engineering Team"
                    value={workspaceName}
                    onChange={handleNameChange}
                    disabled={loading}
                    className="bg-input border-input"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the display name for your team
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium text-foreground">
                    Team Slug
                  </label>
                  <div className="flex items-center gap-2 bg-input border border-input rounded-md px-3">
                    <span className="text-muted-foreground text-sm">async-standup.io/</span>
                    <input
                      id="slug"
                      type="text"
                      placeholder="engineering"
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value)}
                      disabled={loading}
                      className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lowercase letters, numbers, and hyphens. Used in your team URL.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !workspaceName.trim() || !workspaceSlug.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  {loading ? 'Creating workspace...' : 'Create Workspace'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Already have a team?{' '}
              <Button
                variant="link"
                className="h-auto p-0 text-primary hover:underline"
                onClick={() => setStep('type')}
              >
                Go back
              </Button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
