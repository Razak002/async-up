/**
 * Standup Server Actions
 * Handle standup submission, retrieval, and management
 */

/**
 * Standup Server Actions
 * Handle standup submission, retrieval, and management
 */

'use server';

import { getCurrentUser } from '@/services/auth/server';
import type { ApiResponse, Standup, StandupFormData } from '@/types';
import { API_URL } from '@/lib/api-config';

/**
 * Submit a new standup for today
 */

export async function submitStandupAction(
  workspaceId: string,
  data: StandupFormData,
  authToken?: string
): Promise<ApiResponse<Standup>> {
  try {
    const user = await getCurrentUser(authToken);
    if (!user) {
      return { success: false, error: 'Not authenticated. Please sign in again.' };
    }

    // Check if already submitted today
    const today = new Date().toISOString().split('T')[0];
    const checkRes = await fetch(`${API_URL}/api/standups/workspace/${workspaceId}/date/${today}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (checkRes.ok) {
        const standups = await checkRes.json();
        const existing = standups.find((s: { user_id?: string; _id?: string }) => s.user_id === user.id);
        if (existing) {
          return { success: false, error: 'You have already submitted a standup for today' };
        }
    }

    // Ensure access check happens at the API level ideally, but we'll post directly
    const res = await fetch(`${API_URL}/api/standups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        workspace_id: workspaceId,
        date: today,
        submission_method: 'dashboard',
        ...data
      })
    });

    const standup = await res.json();

    if (!res.ok) {
      return { success: false, error: standup.error || 'Failed to submit standup' };
    }

    return {
      success: true,
      data: {
        ...standup,
        id: standup._id // Map _id back to id for frontend compatibility
      },
      message: 'Standup submitted successfully'
    };
  } catch (error) {
    console.error('[Standups] Error:', error);
    return {
       success: false,
       error: error instanceof Error ? error.message : 'Failed to submit standup'
    };
  }
}
export async function updateStandupAction(
  _standupId: string,
  _data: Partial<StandupFormData>,
  _authToken?: string
): Promise<ApiResponse<Standup>> {
  return {
    success: false,
    error: 'Direct standup update not implemented yet via Next.js Action',
  };
}

/**
 * Get all standups for a specific date
 */
export async function getStandupsByDateAction(
  workspaceId: string,
  date: string,
  authToken?: string
): Promise<ApiResponse<Standup[]>> {
  try {
    if (!authToken) {
      return { success: false, error: 'Not authenticated' };
    }

    const res = await fetch(`${API_URL}/api/standups/workspace/${workspaceId}/date/${date}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const data = await res.json();
    if (!res.ok) {
        return { success: false, error: data.error };
    }

    const standups = data.map((s: { _id?: string; [key: string]: unknown }) => ({ ...s, id: s._id }));

    return {
      success: true,
      data: standups,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch standups',
    };
  }
}

/**
 * Get submission statistics for a date
 */
export async function getSubmissionStatsAction(
  workspaceId: string,
  date: string,
  authToken?: string
): Promise<ApiResponse<{ totalMembers: number; submitted: number; rate: number }>> {
  try {
    if (!authToken) {
      return { success: false, error: 'Not authenticated' };
    }

    // Call custom Express stats endpoint (we map it to our new custom Node.js endpoint below)
    const res = await fetch(`${API_URL}/api/standups/workspace/${workspaceId}/date/${date}/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const data = await res.json();

    if (!res.ok) {
        return { success: false, error: data.error };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch statistics',
    };
  }
}

/**
 * Get user's standup for a specific date
 */
export async function getUserStandupAction(
  workspaceId: string,
  date: string,
  authToken?: string
): Promise<ApiResponse<Standup | null>> {
  try {
    const user = await getCurrentUser(authToken);
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const res = await fetch(`${API_URL}/api/standups/workspace/${workspaceId}/date/${date}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const standups = await res.json();
    if (!res.ok) {
        return { success: false, error: standups.error };
    }

    const standup = standups.find((s: { user_id?: string; _id?: string }) => s.user_id === user.id);

    return {
      success: true,
      data: standup ? { ...standup, id: standup._id } : null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch standup',
    };
  }
}