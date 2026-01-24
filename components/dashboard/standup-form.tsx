'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { submitStandupAction } from '@/app/actions/standups';
import type { StandupFormData } from '@/types';

interface StandupFormProps {
  workspaceId: string;
  onSuccess?: () => void;
  initialData?: Partial<StandupFormData>;
}

export function StandupForm({
  workspaceId,
  onSuccess,
  initialData,
}: StandupFormProps) {
  const [formData, setFormData] = useState<StandupFormData>({
    what_worked: initialData?.what_worked || '',
    what_next: initialData?.what_next || '',
    blockers: initialData?.blockers || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    field: keyof StandupFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await submitStandupAction(workspaceId, formData);

      if (!result.success) {
        setError(result.error || 'Failed to submit standup');
        return;
      }

      setSuccess(true);
      setFormData({
        what_worked: '',
        what_next: '',
        blockers: '',
      });

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-border">
      <CardHeader>
        <CardTitle>Today's Standup</CardTitle>
        <CardDescription>
          Share what you accomplished, what's next, and any blockers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-sm text-green-800 dark:text-green-200">
              Standup submitted successfully!
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="what_worked" className="text-base font-semibold text-foreground">
                What I worked on
              </Label>
              <p className="text-sm text-muted-foreground">
                Share your accomplishments and progress from today
              </p>
              <Textarea
                id="what_worked"
                placeholder="e.g., Completed API integration for user authentication, fixed 3 bugs in checkout flow, reviewed PR from Sarah"
                value={formData.what_worked}
                onChange={(e) => handleInputChange('what_worked', e.target.value)}
                required
                disabled={loading}
                className="min-h-32 resize-none bg-input border-input"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.what_worked.length} characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="what_next" className="text-base font-semibold text-foreground">
                What's next
              </Label>
              <p className="text-sm text-muted-foreground">
                Outline your priorities and plans for tomorrow
              </p>
              <Textarea
                id="what_next"
                placeholder="e.g., Deploy auth feature to staging, write tests for payment module, start work on dashboard redesign"
                value={formData.what_next}
                onChange={(e) => handleInputChange('what_next', e.target.value)}
                required
                disabled={loading}
                className="min-h-32 resize-none bg-input border-input"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.what_next.length} characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blockers" className="text-base font-semibold text-foreground">
                Blockers (Optional)
              </Label>
              <p className="text-sm text-muted-foreground">
                Mention any obstacles or concerns that are slowing you down
              </p>
              <Textarea
                id="blockers"
                placeholder="e.g., Waiting for design specs from product team, slow database queries affecting development speed"
                value={formData.blockers}
                onChange={(e) => handleInputChange('blockers', e.target.value)}
                disabled={loading}
                className="min-h-24 resize-none bg-input border-input"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.blockers?.length || 0} characters
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="border-border bg-transparent"
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.what_worked || !formData.what_next}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? 'Submitting...' : 'Submit Standup'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
