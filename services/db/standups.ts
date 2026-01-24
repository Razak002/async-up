/**
 * Standups Database Service
 * Handles all standup-related database operations
 */

import { createClient } from '@supabase/supabase-js';
import type { Standup, StandupFormData } from '@/types';

export async function createStandup(
  client: ReturnType<typeof createClient>,
  data: {
    workspace_id: string;
    user_id: string;
    date: string;
    submission_method: 'dashboard' | 'slack' | 'voice';
  } & StandupFormData
): Promise<Standup> {
  const { data: standup, error } = await client
    .from('standups')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return standup;
}

export async function getStandup(
  client: ReturnType<typeof createClient>,
  standupId: string
): Promise<Standup | null> {
  const { data, error } = await client
    .from('standups')
    .select()
    .eq('id', standupId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getStandupsByDate(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  date: string
): Promise<Standup[]> {
  const { data, error } = await client
    .from('standups')
    .select()
    .eq('workspace_id', workspaceId)
    .eq('date', date)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getStandupsByDateRange(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  startDate: string,
  endDate: string
): Promise<Standup[]> {
  const { data, error } = await client
    .from('standups')
    .select()
    .eq('workspace_id', workspaceId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getUserStandupForDate(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  userId: string,
  date: string
): Promise<Standup | null> {
  const { data, error } = await client
    .from('standups')
    .select()
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateStandup(
  client: ReturnType<typeof createClient>,
  standupId: string,
  data: Partial<StandupFormData>
): Promise<Standup> {
  const { data: updated, error } = await client
    .from('standups')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', standupId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

export async function deleteStandup(
  client: ReturnType<typeof createClient>,
  standupId: string
): Promise<void> {
  const { error } = await client
    .from('standups')
    .delete()
    .eq('id', standupId);

  if (error) throw error;
}

export async function getWorkspaceStandups(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  days: number = 7
): Promise<Standup[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const dateStr = startDate.toISOString().split('T')[0];

  const { data, error } = await client
    .from('standups')
    .select()
    .eq('workspace_id', workspaceId)
    .gte('date', dateStr)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSubmissionStats(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  date: string
): Promise<{
  totalMembers: number;
  submitted: number;
  rate: number;
}> {
  // Get total members
  const { count: totalCount, error: memberError } = await client
    .from('workspace_members')
    .select('*', { count: 'exact' })
    .eq('workspace_id', workspaceId);

  if (memberError) throw memberError;

  // Get submitted standups for date
  const { count: submittedCount, error: submitError } = await client
    .from('standups')
    .select('*', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .eq('date', date);

  if (submitError) throw submitError;

  const totalMembers = totalCount || 0;
  const submitted = submittedCount || 0;
  const rate = totalMembers > 0 ? (submitted / totalMembers) * 100 : 0;

  return {
    totalMembers,
    submitted,
    rate,
  };
}
