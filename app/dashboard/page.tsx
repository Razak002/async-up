'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StandupCard } from '@/components/dashboard/standup-card';
import { getStandupsByDateAction, getSubmissionStatsAction } from '@/app/actions/standups';
import type { Standup } from '@/types';
import { format } from 'date-fns';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatsData { submitted: number; totalMembers: number; rate: number; }

export default function DashboardPage() {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    async function initWorkspace() {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          console.warn('No token, cannot load workspace');
          setLoading(false);
          return;
        }
        
        // Fetch user's workspaces
        const res = await fetch(`${API_URL}/api/workspaces`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const workspaces = await res.json();
          if (workspaces && workspaces.length > 0) {
            const firstWorkspace = workspaces[0];
            loadData(firstWorkspace._id);
            return;
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to init workspace:', err);
        setLoading(false);
      }
    }

    initWorkspace();
  }, []);

  const loadData = async (workspaceId: string) => {
    try {
      const token = localStorage.getItem('auth-token') || undefined;
      const [standupResult, statsResult] = await Promise.all([
        getStandupsByDateAction(workspaceId, today, token),
        getSubmissionStatsAction(workspaceId, today, token),
      ]);

      if (standupResult.success) {
        setStandups(standupResult.data || []);
      }
      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your team&apos;s standups and progress
          </p>
        </div>
        <Link href="/dashboard/submit">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Submit Standup
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today&apos;s Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {format(new Date(), 'MMM dd, yyyy')}
            </div>
          </CardContent>
        </Card>

        {stats && (
          <>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Submissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {stats.submitted}/{stats.totalMembers}
                </div>
                <Progress
                  value={stats.rate}
                  className="h-2 bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round(stats.rate)}% submission rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.totalMembers}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Active members in workspace
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Standup Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Today&apos;s Standups
            </h2>
            <p className="text-muted-foreground mt-1">
              {standups.length} team members have submitted
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-1/3" />
                    <div className="h-20 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : standups.length > 0 ? (
          <div className="grid gap-4">
            {standups.map((standup) => (
              <StandupCard key={standup.id} standup={standup} />
            ))}
          </div>
        ) : (
          <Card className="border-border border-dashed">
            <CardContent className="p-12 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  No standups yet
                </h3>
                <p className="text-muted-foreground text-sm">
                  Team members will appear here once they submit their standups
                </p>
              </div>
              <Link href="/dashboard/submit">
                <Button variant="outline" className="mt-4 border-border bg-transparent">
                  Submit Yours
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
