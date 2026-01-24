/**
 * Workspace Database Service
 * Handles all workspace-related database operations
 */

import { createClient } from '@supabase/supabase-js';
import type { Workspace, WorkspaceMember } from '@/types';

export async function createWorkspace(
  client: ReturnType<typeof createClient>,
  data: {
    name: string;
    slug: string;
    created_by: string;
  }
): Promise<Workspace> {
  const { data: workspace, error } = await client
    .from('workspaces')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return workspace;
}

export async function getWorkspaceBySlug(
  client: ReturnType<typeof createClient>,
  slug: string
): Promise<Workspace | null> {
  const { data, error } = await client
    .from('workspaces')
    .select()
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return data || null;
}

export async function getUserWorkspaces(
  client: ReturnType<typeof createClient>,
  userId: string
): Promise<Workspace[]> {
  const { data, error } = await client
    .from('workspaces')
    .select(
      `
      id,
      name,
      slug,
      created_by,
      created_at,
      updated_at,
      workspace_members!inner(user_id)
    `
    )
    .eq('workspace_members.user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function addWorkspaceMember(
  client: ReturnType<typeof createClient>,
  data: {
    workspace_id: string;
    user_id: string;
    role: 'admin' | 'member';
  }
): Promise<WorkspaceMember> {
  const { data: member, error } = await client
    .from('workspace_members')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return member;
}

export async function getWorkspaceMembers(
  client: ReturnType<typeof createClient>,
  workspaceId: string
): Promise<WorkspaceMember[]> {
  const { data, error } = await client
    .from('workspace_members')
    .select()
    .eq('workspace_id', workspaceId);

  if (error) throw error;
  return data || [];
}

export async function updateMemberRole(
  client: ReturnType<typeof createClient>,
  memberId: string,
  role: 'admin' | 'member'
): Promise<WorkspaceMember> {
  const { data, error } = await client
    .from('workspace_members')
    .update({ role })
    .eq('id', memberId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeWorkspaceMember(
  client: ReturnType<typeof createClient>,
  memberId: string
): Promise<void> {
  const { error } = await client
    .from('workspace_members')
    .delete()
    .eq('id', memberId);

  if (error) throw error;
}

export async function checkMemberAccess(
  client: ReturnType<typeof createClient>,
  workspaceId: string,
  userId: string
): Promise<WorkspaceMember | null> {
  const { data, error } = await client
    .from('workspace_members')
    .select()
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}
