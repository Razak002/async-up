'use client';

import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { Standup } from '@/types';

interface StandupCardProps {
  standup: Standup & {
    user?: {
      full_name?: string;
      email: string;
    };
  };
}

export function StandupCard({ standup }: StandupCardProps) {
  const submissionDate = new Date(standup.created_at);

  return (
    <Card className="overflow-hidden border-border hover:border-primary/20 transition-colors">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">
              {standup.user?.full_name || standup.user?.email?.split('@')[0] || 'Team Member'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {format(submissionDate, 'MMM dd, yyyy h:mm a')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">
              {standup.submission_method}
            </Badge>
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              What Worked
            </h4>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
              {standup.what_worked}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">→</span>
              What's Next
            </h4>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
              {standup.what_next}
            </p>
          </div>

          {standup.blockers && (
            <div className="space-y-2 bg-destructive/5 dark:bg-destructive/10 border border-destructive/10 dark:border-destructive/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                Blockers
              </h4>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {standup.blockers}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
