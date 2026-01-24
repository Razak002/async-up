'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, TrendingUp, AlertCircle, Users } from 'lucide-react';

interface AnalyticsCardsProps {
  totalMembers: number;
  dailySubmissionRate: number;
  weeklySubmissionRate: number;
  averageBlockersPerDay: number;
}

export function AnalyticsCards({
  totalMembers,
  dailySubmissionRate,
  weeklySubmissionRate,
  averageBlockersPerDay,
}: AnalyticsCardsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Team Members */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-foreground">{totalMembers}</div>
          <p className="text-xs text-muted-foreground">
            Active members in workspace
          </p>
        </CardContent>
      </Card>

      {/* Daily Submission Rate */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            Today's Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold text-foreground">
            {Math.round(dailySubmissionRate)}%
          </div>
          <Progress value={dailySubmissionRate} className="h-2 bg-muted" />
          <p className="text-xs text-muted-foreground">
            of team submitted today
          </p>
        </CardContent>
      </Card>

      {/* Weekly Submission Rate */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Weekly Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold text-foreground">
            {Math.round(weeklySubmissionRate)}%
          </div>
          <Progress value={weeklySubmissionRate} className="h-2 bg-muted" />
          <p className="text-xs text-muted-foreground">
            of team submitted this week
          </p>
        </CardContent>
      </Card>

      {/* Blockers */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Avg Blockers/Day
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-foreground">
            {averageBlockersPerDay.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            blockers reported daily
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
