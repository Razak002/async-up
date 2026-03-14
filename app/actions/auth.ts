/**
 * Authentication Server Actions
 * Handle login, signup, workspace creation, and member management
 */

'use server';

import { getCurrentUser } from '@/services/auth/server';
import type { ApiResponse } from '@/types';
import { API_URL } from '@/lib/api-config';


/**
 * Sign up a new user
 */
export async function signUpAction(
  email: string,
  password: string,
  fullName?: string
): Promise<ApiResponse<{ userId: string }>> {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName: fullName || email.split('@')[0] }),
    });

    const resText = await res.text();
    let data;
    try {
      data = JSON.parse(resText);
    } catch {
      return { success: false, error: 'Server returned an invalid response. Is the backend running?' };
    }

    if (!res.ok) {
      console.error('[Auth] Signup error:', data.error);
      return {
        success: false,
        error: data.error || 'Signup failed',
      };
    }

    console.log('[Auth] User signup successful:', data._id);
    return {
      success: true,
      data: { userId: data._id },
    };
  } catch (error) {
    console.error('[Auth] Signup exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed',
    };
  }
}


/**
 * Sign in an existing user
 */
export async function signInAction(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const resText = await res.text();
    let data;
    try {
      data = JSON.parse(resText);
    } catch {
      return { success: false, error: 'Server returned an invalid response. Is the backend running?' };
    }

    if (!res.ok) {
      console.error('[Auth] Sign in error:', data.error);
      return {
        success: false,
        error: data.error || 'Login failed',
      };
    }

    console.log('[Auth] Sign in successful:', data._id);

    return {
      success: true,
      data: {
        user: { id: data._id, email: data.email, user_metadata: { fullName: data.fullName } },
        session: { access_token: data.token }, // Format slightly similarly so client expects it
        accessToken: data.token,
        refreshToken: null, // JWT does not have a refresh token by default here
      },
    };
  } catch (error) {
    console.error('[Auth] Unexpected sign in error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during login',
    };
  }
}


/**
 * Create a new workspace (with token support)
 */
export async function createWorkspaceAction(
  name: string,
  slug: string,
  authToken?: string
): Promise<ApiResponse<{ workspaceId: string; slug: string }>> {
  try {
    console.log('[Workspace] Creating workspace...');

    if (!authToken) {
      return { success: false, error: 'Not authenticated. Please log in again.' };
    }

    const res = await fetch(`${API_URL}/api/workspaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name, slug }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Workspace] Creation error:', data.error);
      return {
        success: false,
        error: data.error || 'Failed to create workspace',
      };
    }

    console.log('[Workspace] Created successfully:', data._id);

    return {
      success: true,
      data: {
        workspaceId: data._id,
        slug: data.slug,
      },
    };
  } catch (error) {
    console.error('[Workspace] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create workspace',
    };
  }
}

/**
 * Get user workspaces (with token support)
 */
export async function getUserWorkspacesAction(
  authToken?: string
): Promise<ApiResponse<Array<{ id: string; name: string; slug: string; role: string }>>> {
  try {
    if (!authToken) {
      return { success: false, error: 'Not authenticated' };
    }

    const res = await fetch(`${API_URL}/api/workspaces`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Workspaces] Fetch error:', data.error);
      return { success: false, error: data.error || 'Failed to fetch workspaces' };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const workspaces = data.map((ws: Record<string, any>) => ({
      id: ws._id,
      name: ws.name,
      slug: ws.slug,
      role: ws.workspace_members[0].role,
    }));

    return {
      success: true,
      data: workspaces,
    };
  } catch (error) {
    console.error('[Workspaces] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch workspaces',
    };
  }
}
/**
 * Join an existing workspace with an invite code/slug
 */
export async function joinWorkspaceAction(
  workspaceSlug: string,
  authToken?: string // Adding authToken to make it easily accessible
): Promise<ApiResponse<{ workspaceId: string; workspaceName: string }>> {
  try {
    const user = await getCurrentUser(authToken);
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // 1. Get workspace by slug
    const getWsRes = await fetch(`${API_URL}/api/workspaces/slug/${workspaceSlug}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const workspace = await getWsRes.json();

    if (!getWsRes.ok) {
      return { success: false, error: 'Workspace not found' };
    }

    // 2. Add user to workspace (POST /api/workspaces/:id/members)
    const addMemberRes = await fetch(`${API_URL}/api/workspaces/${workspace._id}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ user_id: user.id, role: 'member' })
    });
    const addMemberData = await addMemberRes.json();

    if (!addMemberRes.ok) {
        return { success: false, error: addMemberData.error || 'Failed to join workspace' };
    }

    return {
      success: true,
      data: {
        workspaceId: workspace._id,
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

