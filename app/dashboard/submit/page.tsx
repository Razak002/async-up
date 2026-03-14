'use client';

import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api-config';
import { StandupForm } from '@/components/dashboard/standup-form';
import { useEffect, useState } from 'react';

export default function SubmitStandupPage() {
  const router = useRouter();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchWorkspace() {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) throw new Error('No auth token');

        const res = await fetch(`${API_URL}/api/workspaces`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          setError('Workspace not found');
          console.error('Workspace fetch error:', await res.text());
          return;
        }

        const workspaces = await res.json();
        
        if (workspaces && workspaces.length > 0) {
          setWorkspaceId(workspaces[0]._id);
        } else {
          setError('You do not belong to any workspace');
        }
      } catch (err) {
        setError('Failed to load workspace');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkspace();
  }, []);

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !workspaceId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {error || 'Workspace not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Submit Your Standup</h1>
        <p className="text-muted-foreground mt-2">
          Share your daily progress with the team. Be specific and concise.
        </p>
      </div>

      <StandupForm
        workspaceId={workspaceId}
        onSuccess={handleSuccess}
      />

      {/* Tips */}
      <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Tips for good standups:</h3>
        <ul className="space-y-2 text-sm text-foreground/80">
          <li className="flex gap-3">
            <span className="text-primary font-semibold">•</span>
            <span>Be specific about what you completed - metrics and outcomes matter</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-semibold">•</span>
            <span>Mention any blockers or risks that might slow the team down</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-semibold">•</span>
            <span>Link to PRs, designs, or documents that provide more context</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-semibold">•</span>
            <span>Keep it brief - 3-5 minutes to read is ideal</span>
          </li>
        </ul>
      </div>
    </div>
  );
}