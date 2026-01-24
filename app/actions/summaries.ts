/**
 * Summary Server Actions
 * Handle AI summary generation and retrieval
 */

'use server';

import { createClient } from '@supabase/supabase-js';
import { getCurrentUser, hasWorkspaceAccess } from '@/services/auth/server';
import {
  getSummaryOrCreate,
  getLatestSummary,
  getSummariesByDate,
} from '@/services/db/summaries';
import { getStandupsByDateRange, getWorkspaceStandups } from '@/services/db/standups';
import {
  generateDailySummary,
  generateWeeklySummary,
} from '@/services/ai/summarization';
import { getWorkspaceMembers } from '@/services/db/workspaces';
import type { ApiResponse } from '@/types';
import { format, subDays } from 'date-fns';

/**
 * Generate or retrieve a daily summary
 */
export async function getDailySummaryAction(
  workspaceId: string,
  date?: string
): Promise<
  ApiResponse<{
    id: string;
    title: string;
    overview: string;
    highlights: string[];
    blockers: Array<{ area: string; issue: string }>;
    nextSteps: string[];
    generated_at: string;
  }>
> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const hasAccess = await hasWorkspaceAccess(workspaceId, user.id);
    if (!hasAccess) {
      return {
        success: false,
        error: 'You do not have access to this workspace',
      };
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const targetDate = date || format(new Date(), 'yyyy-MM-dd');

    // Get existing summary
    const { data: summaries } = await client
      .from('summaries')
      .select()
      .eq('workspace_id', workspaceId)
      .eq('summary_type', 'daily')
      .eq('summary_date', targetDate);

    let summary = summaries?.[0];

    // If no summary exists, generate one
    if (!summary) {
      // Get standups for this date
      const standups = await getWorkspaceStandups(client, workspaceId, 1);
      const todaysStandups = standups.filter((s) => s.date === targetDate);

      // Get team member count
      const members = await getWorkspaceMembers(client, workspaceId);

      // Generate AI summary
      const aiSummary = await generateDailySummary(
        todaysStandups,
        members.length
      );

      // Save to database
      summary = await getSummaryOrCreate(
        client,
        workspaceId,
        'daily',
        targetDate,
        aiSummary.title,
        JSON.stringify(aiSummary.highlights),
        JSON.stringify(aiSummary.blockers)
      );
    }

    // Parse stored data
    const highlights = summary.highlights
      ? JSON.parse(summary.highlights)
      : [];
    const blockers = summary.blockers_summary
      ? JSON.parse(summary.blockers_summary)
      : [];

    return {
      success: true,
      data: {
        id: summary.id,
        title: summary.generated_summary.split('\n')[0],
        overview: summary.generated_summary,
        highlights,
        blockers,
        nextSteps: [],
        generated_at: summary.generated_at,
      },
    };
  } catch (error) {
    console.error('[v0] Error getting daily summary:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get summary',
    };
  }
}

/**
 * Generate or retrieve a weekly summary
 */
export async function getWeeklySummaryAction(
  workspaceId: string,
  date?: string
): Promise<
  ApiResponse<{
    id: string;
    title: string;
    overview: string;
    highlights: string[];
    blockers: Array<{ area: string; issue: string }>;
    nextSteps: string[];
    generated_at: string;
  }>
> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const hasAccess = await hasWorkspaceAccess(workspaceId, user.id);
    if (!hasAccess) {
      return {
        success: false,
        error: 'You do not have access to this workspace',
      };
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const targetDate = date || format(new Date(), 'yyyy-MM-dd');

    // Get existing summary
    const { data: summaries } = await client
      .from('summaries')
      .select()
      .eq('workspace_id', workspaceId)
      .eq('summary_type', 'weekly')
      .eq('summary_date', targetDate);

    let summary = summaries?.[0];

    // If no summary exists, generate one
    if (!summary) {
      // Get standups from the past 7 days
      const startDate = format(subDays(new Date(targetDate), 7), 'yyyy-MM-dd');
      const standups = await getStandupsByDateRange(
        client,
        workspaceId,
        startDate,
        targetDate
      );

      // Get team member count
      const members = await getWorkspaceMembers(client, workspaceId);

      // Generate AI summary
      const aiSummary = await generateWeeklySummary(standups, members.length);

      // Save to database
      summary = await getSummaryOrCreate(
        client,
        workspaceId,
        'weekly',
        targetDate,
        aiSummary.title,
        JSON.stringify(aiSummary.highlights),
        JSON.stringify(aiSummary.blockers)
      );
    }

    // Parse stored data
    const highlights = summary.highlights
      ? JSON.parse(summary.highlights)
      : [];
    const blockers = summary.blockers_summary
      ? JSON.parse(summary.blockers_summary)
      : [];

    return {
      success: true,
      data: {
        id: summary.id,
        title: summary.generated_summary.split('\n')[0],
        overview: summary.generated_summary,
        highlights,
        blockers,
        nextSteps: [],
        generated_at: summary.generated_at,
      },
    };
  } catch (error) {
    console.error('[v0] Error getting weekly summary:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get summary',
    };
  }
}

/**
 * Get summaries for a date range
 */
export async function getSummariesByRangeAction(
  workspaceId: string,
  startDate: string,
  endDate: string,
  type: 'daily' | 'weekly' = 'daily'
): Promise<
  ApiResponse<
    Array<{
      id: string;
      date: string;
      type: string;
      title: string;
      generated_at: string;
    }>
  >
> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const hasAccess = await hasWorkspaceAccess(workspaceId, user.id);
    if (!hasAccess) {
      return {
        success: false,
        error: 'You do not have access to this workspace',
      };
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const summaries = await getSummariesByDate(
      client,
      workspaceId,
      startDate,
      endDate
    );

    const formatted = summaries
      .filter((s) => s.summary_type === type)
      .map((s) => ({
        id: s.id,
        date: s.summary_date,
        type: s.summary_type,
        title: s.generated_summary.split('\n')[0],
        generated_at: s.generated_at,
      }));

    return {
      success: true,
      data: formatted,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch summaries',
    };
  }
}
