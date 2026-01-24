'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, MoreVertical } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: 'submitted' | 'pending' | 'never';
  lastSubmission?: string;
  submissionRate: number;
}

interface TeamMemberListProps {
  members: TeamMember[];
  loading?: boolean;
}

export function TeamMemberList({ members, loading }: TeamMemberListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'never':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <Badge className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-950">
            Submitted
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950">
            Pending
          </Badge>
        );
      case 'never':
        return (
          <Badge variant="outline" className="border-destructive text-destructive">
            No Submission
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Track submission status and engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg animate-pulse">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </>
          ) : members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/20 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {Math.round(member.submissionRate)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      submission rate
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(member.status)}
                    {getStatusBadge(member.status)}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No team members yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
