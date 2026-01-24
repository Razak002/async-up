/**
 * Server-side Authentication Utilities
 * For use in Server Actions and Route Handlers
 */

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Get the current user's session from cookies
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[v0] Missing Supabase environment variables for session');
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    console.log('[v0] Session retrieved:', session ? 'found' : 'not found');
    return session;
  } catch (error) {
    console.error('[v0] Error getting session:', error);
    return null;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session) {
      console.log('[v0] No session found - user not authenticated');
      return null;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[v0] Missing Supabase environment variables');
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    });

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('[v0] Error fetching user:', error.message);
      return null;
    }

    console.log('[v0] User retrieved:', data.user?.id);
    return data.user;
  } catch (error) {
    console.error('[v0] Unexpected error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Get the current user's workspaces
 */
export async function getCurrentUserWorkspaces() {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('workspaces')
    .select(
      `
      id,
      name,
      slug,
      created_by,
      created_at,
      updated_at,
      workspace_members!inner(user_id, role)
    `
    )
    .eq('workspace_members.user_id', user.id);

  if (error) {
    console.error('[v0] Error fetching workspaces:', error);
    return [];
  }

  return data || [];
}

/**
 * Check if user is admin of a workspace
 */
export async function isWorkspaceAdmin(
  workspaceId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return data?.role === 'admin';
}

/**
 * Check if user has access to workspace
 */
export async function hasWorkspaceAccess(
  workspaceId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return !!data;
}
