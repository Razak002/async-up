'use client';

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import type { Standup } from '@/types';

interface StandupCardProps {
  standup: Standup & {
    user?: { full_name?: string; email: string; };
    createdAt?: string;
  };
}

export function StandupCard({ standup }: StandupCardProps) {
  const submissionDate = new Date(standup.createdAt || standup.created_at || new Date());
  const name = standup.user?.full_name || standup.user?.email?.split('@')[0] || standup.user_id || 'Team Member';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-[#013E37]/20 hover:shadow-[0_8px_32px_rgba(1,62,55,0.10)] hover:-translate-y-0.5">
      {/* Accent bar on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #013E37 0%, #FFEFB3 100%)' }} />

      <div className="pl-5 pr-6 py-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #013E37 0%, #025748 100%)', color: '#FFEFB3' }}>
              {initials}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {format(submissionDate, 'MMM dd · h:mm a')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className="text-[10px] capitalize px-2 py-0.5 rounded-full font-medium badge-teal border-0">
              {standup.submission_method}
            </Badge>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        {/* Divider */}
        <div className="brand-divider" />

        {/* Content sections*/}
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: '#013E37' }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              What Worked
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed pl-5">
              {standup.what_worked}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <ArrowRight className="w-3.5 h-3.5" />
              What&apos;s Next
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed pl-5">
              {standup.what_next}
            </p>
          </div>

          {standup.blockers && (
            <div className="space-y-1 rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <h4 className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Blockers
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {standup.blockers}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
