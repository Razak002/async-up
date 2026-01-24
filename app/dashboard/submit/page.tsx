'use client';

import { useRouter } from 'next/navigation';
import { StandupForm } from '@/components/dashboard/standup-form';

export default function SubmitStandupPage() {
  const router = useRouter();

  // This will be connected to real workspace ID
  const workspaceId = 'demo-workspace';

  const handleSuccess = () => {
    router.push('/dashboard');
  };

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
