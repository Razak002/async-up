/**
 * Summaries Database Service
 * Handles all summary-related database operations
 */

import { createClient } from '@supabase/supabase-js';
import type { Summary } from '@/types';

export async function createSummary(
  client: ReturnType<typeof createClient>,
  data: {
    workspace_id: string;
    summary_type: 'daily' | 'weekly';
    summary_date: string;
    generated_summary: string;
    highlights?: string;
    blockers_summary?: string;
  }
): Promise<Summary> {
  const { data: summary, error } = await client
    .from('summaries')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return summary;
}

export async function getSummary(
  client: ReturnType<typeof createClient>,
  summaryId: string
): Promise<Summary | null> {
  const { data, error } = await client
    .from('summaries')
    .select()
    .eq('id', summaryId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getLatestSummary(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  summaryType: 'daily' | 'weekly'
): Promise<Summary | null> {
  const { data, error } = await client
    .from('summaries')
    .select()
    .eq('workspace_id', workspaceId)
    .eq('summary_type', summaryType)
    .order('summary_date', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getSummariesByDate(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  startDate: string,
  endDate: string
): Promise<Summary[]> {
  const { data, error } = await client
    .from('summaries')
    .select()
    .eq('workspace_id', workspaceId)
    .gte('summary_date', startDate)
    .lte('summary_date', endDate)
    .order('summary_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateSummary(
  client: ReturnType<typeof createClient>,
  summaryId: string,
  data: Partial<{
    generated_summary: string;
    highlights: string;
    blockers_summary: string;
  }>
): Promise<Summary> {
  const { data: updated, error } = await client
    .from('summaries')
    .update(data)
    .eq('id', summaryId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

export async function deleteSummary(
  client: ReturnType<typeof createClient>,
  summaryId: string
): Promise<void> {
  const { error } = await client
    .from('summaries')
    .delete()
    .eq('id', summaryId);

  if (error) throw error;
}

export async function getSummaryOrCreate(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  summaryType: 'daily' | 'weekly',
  summaryDate: string,
  generatedSummary: string,
  highlights?: string,
  blockersSummary?: string
): Promise<Summary> {
  // Try to get existing summary
  const { data: existing, error: selectError } = await client
    .from('summaries')
    .select()
    .eq('workspace_id', workspaceId)
    .eq('summary_type', summaryType)
    .eq('summary_date', summaryDate)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    throw selectError;
  }

  // If exists, update it
  if (existing) {
    return updateSummary(client, existing.id, {
      generated_summary: generatedSummary,
      highlights,
      blockers_summary: blockersSummary,
    });
  }

  // Otherwise, create new
  return createSummary(client, {
    workspace_id: workspaceId,
    summary_type: summaryType,
    summary_date: summaryDate,
    generated_summary: generatedSummary,
    highlights,
    blockers_summary: blockersSummary,
  });
}
