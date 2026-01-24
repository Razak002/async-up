/**
 * Slack Configuration Database Service
 * Handles all Slack-related database operations
 */

import { createClient } from '@supabase/supabase-js';
import type { SlackConfig } from '@/types';

export async function createSlackConfig(
  client: ReturnType<typeof createClient>,
  data: {
    workspace_id: string;
    webhook_url: string;
    channel_id: string;
    notifications_enabled?: boolean;
  }
): Promise<SlackConfig> {
  const { data: config, error } = await client
    .from('slack_config')
    .insert([
      {
        ...data,
        notifications_enabled: data.notifications_enabled ?? true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return config;
}

export async function getSlackConfig(
  client: ReturnType<typeof createClient>,
  workspaceId: string
): Promise<SlackConfig | null> {
  const { data, error } = await client
    .from('slack_config')
    .select()
    .eq('workspace_id', workspaceId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateSlackConfig(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  data: Partial<{
    webhook_url: string;
    channel_id: string;
    notifications_enabled: boolean;
  }>
): Promise<SlackConfig> {
  const { data: updated, error } = await client
    .from('slack_config')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

export async function deleteSlackConfig(
  client: ReturnType<typeof createClient>,
  workspaceId: string
): Promise<void> {
  const { error } = await client
    .from('slack_config')
    .delete()
    .eq('workspace_id', workspaceId);

  if (error) throw error;
}

export async function toggleSlackNotifications(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  enabled: boolean
): Promise<SlackConfig> {
  const { data, error } = await client
    .from('slack_config')
    .update({
      notifications_enabled: enabled,
      updated_at: new Date().toISOString(),
    })
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
