'use client';

import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function StandupsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const previousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const nextDay = () => {
    setSelectedDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000));
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Team Standups</h1>
        <p className="text-muted-foreground mt-2">
          View standups from all team members by date
        </p>
      </div>

      {/* Date Navigation */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={previousDay}
              className="border-border bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  {format(selectedDate, 'MMMM dd, yyyy')}
                </p>
                {isToday && (
                  <p className="text-xs text-primary font-medium">Today</p>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextDay}
              disabled={selectedDate > new Date()}
              className="border-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Standup List */}
      <div className="space-y-4">
        <Card className="border-dashed border-border">
          <CardContent className="p-12 text-center space-y-4">
            <p className="text-muted-foreground">
              Standup data for {format(selectedDate, 'MMM dd')} will appear here
            </p>
            <p className="text-sm text-muted-foreground">
              This feature is coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
