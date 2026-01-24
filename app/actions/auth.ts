/**
 * Authentication Server Actions
 * Handle login, signup, workspace creation, and member management
 */

'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/services/auth/server';
import {
  createWorkspace,
  addWorkspaceMember,
  getWorkspaceBySlug,
  getUserWorkspaces,
} from '@/services/db/workspaces';
import type { ApiResponse } from '@/types';

/**
 * Sign up a new user
 */
export async function signUpAction(
  email: string,
  password: string
): Promise<ApiResponse<{ userId: string }>> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: { userId: data.user.id },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed',
    };
  }
}

/**
 * Create a new workspace
 */
export async function createWorkspaceAction(
  name: string,
  slug: string
): Promise<ApiResponse<{ workspaceId: string; slug: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if slug already exists
    const existing = await getWorkspaceBySlug(client, slug);
    if (existing) {
      return {
        success: false,
        error: 'Workspace slug already exists',
      };
    }

    // Create workspace
    const workspace = await createWorkspace(client, {
      name,
      slug: slug.toLowerCase(),
      created_by: user.id,
    });

    // Add creator as admin
    await addWorkspaceMember(client, {
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'admin',
    });

    return {
      success: true,
      data: {
        workspaceId: workspace.id,
        slug: workspace.slug,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create workspace',
    };
  }
}

/**
 * Join an existing workspace with an invite code/slug
 */
export async function joinWorkspaceAction(
  workspaceSlug: string
): Promise<ApiResponse<{ workspaceId: string; workspaceName: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find workspace by slug
    const workspace = await getWorkspaceBySlug(client, workspaceSlug);
    if (!workspace) {
      return {
        success: false,
        error: 'Workspace not found',
      };
    }

    // Add user to workspace
    await addWorkspaceMember(client, {
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'member',
    });

    return {
      success: true,
      data: {
        workspaceId: workspace.id,
        workspaceName: workspace.name,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to join workspace',
    };
  }
}

/**
 * Get user's workspaces
 */
export async function getUserWorkspacesAction(): Promise<
  ApiResponse<
    Array<{
      id: string;
      name: string;
      slug: string;
      role: string;
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

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const workspaces = await getUserWorkspaces(client, user.id);

    // Cast and return formatted data
    const formatted = workspaces.map((ws: any) => ({
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      role: ws.workspace_members?.[0]?.role || 'member',
    }));

    return {
      success: true,
      data: formatted,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch workspaces',
    };
  }
}
