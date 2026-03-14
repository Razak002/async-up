/**
 * Server-side Authentication Utilities
 * For use in Server Actions and Route Handlers
 * Uses JWT tokens passed via Authorization header
 */

import { headers } from 'next/headers';
import { API_URL } from '@/lib/api-config';

export async function getSession(token?: string) {
  try {
    let authToken = token;
    if (!authToken) {
      const headersList = await headers();
      const authHeader = headersList.get('Authorization');
      authToken = authHeader?.replace('Bearer ', '') || undefined;
    }

    if (!authToken) return null;

    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return null;
    }

    const userData = await res.json();
    return {
      user: {
        id: userData._id,
        email: userData.email,
        user_metadata: { fullName: userData.fullName }
      }
    };
  } catch (error) {
    console.error('[Auth] Error getting session:', error);
    return null;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(token?: string) {
  try {
    const session = await getSession(token);
    if (!session || !session.user) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error('[Auth] Unexpected error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Get the current user's workspaces
 */
export async function getCurrentUserWorkspaces(token?: string) {
  const user = await getCurrentUser(token);
  if (!user) return [];

  try {
    let authToken = token;
    if (!authToken) {
      const headersList = await headers();
      const authHeader = headersList.get('Authorization');
      authToken = authHeader?.replace('Bearer ', '') || undefined;
    }

    if (!authToken) return [];

    const res = await fetch(`${API_URL}/api/workspaces`, {
      headers: { Authorization: `Bearer ${authToken}` },
      cache: 'no-store'
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[Workspaces] Error fetching workspaces:', error);
    return [];
  }
}

/**
 * Check if user is admin of a workspace
 */
export async function isWorkspaceAdmin(
  workspaceId: string,
  _userId: string,
  token?: string
): Promise<boolean> {
  try {
    let authToken = token;
    if (!authToken) {
      const headersList = await headers();
      const authHeader = headersList.get('Authorization');
      authToken = authHeader?.replace('Bearer ', '') || undefined;
    }

    if (!authToken) return false;

    const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/access`, {
      headers: { Authorization: `Bearer ${authToken}` },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return data.role === 'admin';
    }
  } catch (error) {
    console.error('[Workspaces] Error checking admin status:', error);
  }
  return false;
}

/**
 * Check if user has access to workspace
 */
export async function hasWorkspaceAccess(
  workspaceId: string,
  _userId: string,
  token?: string
): Promise<boolean> {
  try {
    let authToken = token;
    if (!authToken) {
      const headersList = await headers();
      const authHeader = headersList.get('Authorization');
      authToken = authHeader?.replace('Bearer ', '') || undefined;
    }

    if (!authToken) return false;

    const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/access`, {
      headers: { Authorization: `Bearer ${authToken}` },
      cache: 'no-store'
    });

    return res.ok;
  } catch (error) {
    console.error('[Workspaces] Error checking workspace access:', error);
    return false;
  }
}