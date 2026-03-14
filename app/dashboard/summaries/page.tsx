'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api-config';
import { getDailySummaryAction, getWeeklySummaryAction } from '@/app/actions/summaries';
import { format } from 'date-fns';

interface SummaryData {
  title?: string;
  overview?: string;
  highlights?: string[];
  blockers?: Array<{ area?: string; issue?: string }>;
  nextSteps?: string[];
  generated_at?: string;
}

export default function SummariesPage() {
  const [dailySummary, setDailySummary] = useState<SummaryData | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<SummaryData | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [loadingWeekly, setLoadingWeekly] = useState(true);
  const [errorDaily, setErrorDaily] = useState('');
  const [errorWeekly, setErrorWeekly] = useState('');
  const [isGeneratingDaily, setIsGeneratingDaily] = useState(false);
  const [isGeneratingWeekly, setIsGeneratingWeekly] = useState(false);

  useEffect(() => {
    async function fetchSummaryData() {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          setErrorDaily('Not authenticated');
          setErrorWeekly('Not authenticated');
          setLoadingDaily(false);
          setLoadingWeekly(false);
          return;
        }

        // Fetch user default workspace
        const wsRes = await fetch(`${API_URL}/api/workspaces`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!wsRes.ok) throw new Error('Failed to load workspaces');
        
        const workspaces = await wsRes.json();
        if (!workspaces || workspaces.length === 0) {
           setErrorDaily('No workspace found');
           setErrorWeekly('No workspace found');
           setLoadingDaily(false);
           setLoadingWeekly(false);
           return;
        }

        const workspaceId = workspaces[0]._id;
        
        // Fetch Daily
        getDailySummaryAction(workspaceId, undefined, token).then(summaryData => {
           if (summaryData.success) {
             setDailySummary(summaryData.data ?? null);
           } else {
             setErrorDaily(summaryData.error || 'Failed to generate summary');
           }
           setLoadingDaily(false);
        }).catch(() => {
           setErrorDaily('Failed to load daily summary.');
           setLoadingDaily(false);
        });

        // Fetch Weekly
        getWeeklySummaryAction(workspaceId, undefined, token).then(summaryData => {
           if (summaryData.success) {
             setWeeklySummary(summaryData.data ?? null);
           } else {
             setErrorWeekly(summaryData.error || 'Failed to generate weekly summary');
           }
           setLoadingWeekly(false);
        }).catch(() => {
           setErrorWeekly('Failed to load weekly summary.');
           setLoadingWeekly(false);
        });
      } catch (err) {
        console.error('Error fetching summary:', err);
        setErrorDaily('Failed to init workspace.');
        setErrorWeekly('Failed to init workspace.');
        setLoadingDaily(false);
        setLoadingWeekly(false);
      }
    }

    fetchSummaryData();
  }, []);

  const handleManualDailyGenerate = async () => {
    setIsGeneratingDaily(true);
    setErrorDaily('');
    try {
      const token = localStorage.getItem('auth-token');
      const wsRes = await fetch(`${API_URL}/api/workspaces`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const workspaces = await wsRes.json();
      const workspaceId = workspaces[0]._id;
      
      const summaryData = await getDailySummaryAction(workspaceId, undefined, token || undefined);
      if (summaryData.success) {
        setDailySummary(summaryData.data ?? null);
      } else {
        setErrorDaily(summaryData.error || 'Failed to generate summary');
      }
    } catch {
      setErrorDaily('Failed to generate summary.');
    } finally {
      setIsGeneratingDaily(false);
    }
  };

  const handleManualWeeklyGenerate = async () => {
    setIsGeneratingWeekly(true);
    setErrorWeekly('');
    try {
      const token = localStorage.getItem('auth-token');
      const wsRes = await fetch(`${API_URL}/api/workspaces`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const workspaces = await wsRes.json();
      const workspaceId = workspaces[0]._id;
      
      const summaryData = await getWeeklySummaryAction(workspaceId, undefined, token || undefined);
      if (summaryData.success) {
        setWeeklySummary(summaryData.data ?? null);
      } else {
        setErrorWeekly(summaryData.error || 'Failed to generate summary');
      }
    } catch {
      setErrorWeekly('Failed to generate summary.');
    } finally {
      setIsGeneratingWeekly(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Summaries</h1>
        <p className="text-muted-foreground mt-2">
          AI-generated summaries of your team&apos;s standups
        </p>
      </div>

      {/* Summary Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full max-w-md bg-muted">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Daily Summary</CardTitle>
                  <CardDescription>
                    Today&apos;s auto-generated team digest
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={handleManualDailyGenerate} 
                     disabled={isGeneratingDaily || loadingDaily}
                     className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 text-xs rounded-md disabled:opacity-50"
                   >
                     {isGeneratingDaily ? 'Generating...' : 'Regenerate'}
                   </button>
                   <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                     Generated today
                   </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingDaily ? (
                 <div className="flex justify-center items-center p-12 text-muted-foreground flex-col gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Generating or fetching AI Summary...</p>
                 </div>
              ) : errorDaily ? (
                 <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-semibold text-center">
                   {errorDaily}
                 </div>
              ) : !dailySummary ? (
                 <div className="p-12 text-center text-muted-foreground border border-dashed rounded-lg">
                   No summary available. Submit some standups and try again!
                 </div>
              ) : (
                <>
                  {/* Summary Details */}
                  <div className="space-y-4">
                    {dailySummary.highlights && dailySummary.highlights.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          Highlights
                        </h4>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          {dailySummary.highlights.map((item: string, idx: number) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {dailySummary.blockers && dailySummary.blockers.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          Blockers
                        </h4>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          {dailySummary.blockers.map((blocker: { area?: string; issue?: string }, idx: number) => (
                            <li key={idx}>• {blocker.area || 'Issue'}: {blocker.issue ?? ''}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {dailySummary.nextSteps && dailySummary.nextSteps.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          Next Steps
                        </h4>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          {dailySummary.nextSteps.map((step: string, idx: number) => (
                            <li key={idx}>→ {step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Generated with AI on {dailySummary.generated_at ? format(new Date(dailySummary.generated_at), 'MMM dd, yyyy') : new Date().toLocaleDateString()}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-dashed border-border">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p className="text-sm">
                Previous daily summaries will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Weekly Summary</CardTitle>
                  <CardDescription>
                    Your team`&apos;`s digest for the past week
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={handleManualWeeklyGenerate} 
                     disabled={isGeneratingWeekly || loadingWeekly}
                     className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 text-xs rounded-md disabled:opacity-50"
                   >
                     {isGeneratingWeekly ? 'Generating...' : 'Regenerate'}
                   </button>
                   <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                     Generated this week
                   </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingWeekly ? (
                 <div className="flex justify-center items-center p-12 text-muted-foreground flex-col gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Generating or fetching AI Summary...</p>
                 </div>
              ) : errorWeekly ? (
                 <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-semibold text-center">
                   {errorWeekly}
                 </div>
              ) : !weeklySummary ? (
                 <div className="p-12 text-center text-muted-foreground border border-dashed rounded-lg">
                   No weekly summary available. Submit some standups and try again!
                 </div>
              ) : (
                <>
                  {/* Summary Details */}
                  <div className="space-y-4">
                    {weeklySummary.highlights && weeklySummary.highlights.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          Top Accomplishments
                        </h4>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          {weeklySummary.highlights.map((item: string, idx: number) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {weeklySummary.blockers && weeklySummary.blockers.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          Recurring Blockers
                        </h4>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          {weeklySummary.blockers.map((blocker: { area?: string; issue?: string }, idx: number) => (
                            <li key={idx}>• {blocker.area || 'Issue'}: {blocker.issue ?? ''}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {weeklySummary.nextSteps && weeklySummary.nextSteps.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          Next Week Priorities
                        </h4>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          {weeklySummary.nextSteps.map((step: string, idx: number) => (
                            <li key={idx}>→ {step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Generated with AI on {weeklySummary.generated_at ? format(new Date(weeklySummary.generated_at), 'MMM dd, yyyy') : new Date().toLocaleDateString()}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
