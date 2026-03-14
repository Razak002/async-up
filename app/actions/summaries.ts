/**
 * Summary Server Actions
 * Handle summary generation and retrieval
 */

'use server';

import { getCurrentUser } from '@/services/auth/server';
import type { ApiResponse } from '@/types';
import { API_URL } from '@/lib/api-config';
import { format, startOfWeek } from 'date-fns';

type SummaryResponse = ApiResponse<{
  id: string;
  title: string;
  overview: string;
  highlights: string[];
  blockers: Array<{ area: string; issue: string }>;
  nextSteps: string[];
  generated_at: string;
}>;

/** Parse a raw summary document from the backend into our response shape */
function parseSummary(summary: Record<string, unknown>): SummaryResponse['data'] {
  const raw = summary.generated_summary as string ?? '';
  let highlights: string[] = [];
  let blockers: Array<{ area: string; issue: string }> = [];

  try { highlights = summary.highlights ? JSON.parse(summary.highlights as string) : []; } catch { highlights = []; }
  try { blockers = summary.blockers_summary ? JSON.parse(summary.blockers_summary as string) : []; } catch { blockers = []; }

  return {
    id: summary._id as string,
    title: raw.split('\n')[0] || 'Summary',
    overview: raw,
    highlights,
    blockers,
    nextSteps: [],
    generated_at: summary.createdAt as string,
  };
}

/** Call /generate and return the result or a friendly error */
async function callGenerate(
  workspaceId: string,
  type: 'daily' | 'weekly',
  date: string,
  authToken: string
): Promise<SummaryResponse> {
  const createRes = await fetch(
    `${API_URL}/api/summaries/workspace/${workspaceId}/generate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ type, date }),
    }
  );

  const body = await createRes.json().catch(() => ({})) as Record<string, unknown>;

  if (!createRes.ok) {
    // 404 = no standups yet — friendly message, not a crash
    const message = (body.error as string) ||
      (createRes.status === 404
        ? 'No standups found for this period. Ask your team to submit first!'
        : 'Failed to generate summary');
    return { success: false, error: message };
  }

  return { success: true, data: parseSummary(body) };
}

/**
 * Generate or retrieve a daily summary
 */
export async function getDailySummaryAction(
  workspaceId: string,
  date?: string,
  authToken?: string
): Promise<SummaryResponse> {
  try {
    const user = await getCurrentUser(authToken);
    if (!user) return { success: false, error: 'Not authenticated' };

    const targetDate = date || format(new Date(), 'yyyy-MM-dd');

    // Try fetching an existing cached summary first
    const summaryRes = await fetch(
      `${API_URL}/api/summaries/workspace/${workspaceId}/type/daily/date/${targetDate}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    if (summaryRes.ok) {
      const summary = await summaryRes.json() as Record<string, unknown>;
      if (summary && !summary.error) {
        return { success: true, data: parseSummary(summary) };
      }
    }

    // No cached summary — ask the backend to generate one
    return callGenerate(workspaceId, 'daily', targetDate, authToken ?? '');
  } catch (error) {
    console.error('[Summaries] Error getting daily summary:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get summary' };
  }
}

/**
 * Generate or retrieve a weekly summary
 */
export async function getWeeklySummaryAction(
  workspaceId: string,
  date?: string,
  authToken?: string
): Promise<SummaryResponse> {
  try {
    const user = await getCurrentUser(authToken);
    if (!user) return { success: false, error: 'Not authenticated' };

    // Always use the Monday of the current/given week so the backend window is consistent
    const base = date ? new Date(date) : new Date();
    const weekStart = startOfWeek(base, { weekStartsOn: 1 }); // Monday
    const targetDate = format(weekStart, 'yyyy-MM-dd');

    // Try fetching cached summary first
    const summaryRes = await fetch(
      `${API_URL}/api/summaries/workspace/${workspaceId}/type/weekly/date/${targetDate}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    if (summaryRes.ok) {
      const summary = await summaryRes.json() as Record<string, unknown>;
      if (summary && !summary.error) {
        return { success: true, data: parseSummary(summary) };
      }
    }

    // No cached summary — ask the backend to generate one
    return callGenerate(workspaceId, 'weekly', targetDate, authToken ?? '');
  } catch (error) {
    console.error('[Summaries] Error getting weekly summary:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get summary' };
  }
}
