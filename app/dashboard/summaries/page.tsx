'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SummariesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Summaries</h1>
        <p className="text-muted-foreground mt-2">
          AI-generated summaries of your team's standups
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
                    Today's auto-generated team digest
                  </CardDescription>
                </div>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  Generated today
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sample Summary */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Highlights
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>• Feature A completed and tested</li>
                    <li>• Bug fixes merged to production</li>
                    <li>• Design review with stakeholders</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    Blockers
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>• Waiting on design specs for Feature B</li>
                    <li>• Database migration needed for performance</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Next Steps
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>→ Deploy Feature A to staging</li>
                    <li>→ Begin work on Feature B</li>
                    <li>→ Performance optimization sprint</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-border pt-4 text-xs text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Generated with AI on {new Date().toLocaleDateString()}
              </div>
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
          <Card className="border-dashed border-border">
            <CardContent className="p-12 text-center space-y-4">
              <h3 className="font-semibold text-foreground">Weekly summaries</h3>
              <p className="text-sm text-muted-foreground">
                Weekly digests are generated every Friday evening
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
