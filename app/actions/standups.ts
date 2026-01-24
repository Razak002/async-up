/**
 * Standup Server Actions
 * Handle standup submission, retrieval, and management
 */

'use server';

import { createClient } from '@supabase/supabase-js';
import { getCurrentUser, hasWorkspaceAccess } from '@/services/auth/server';
import {
  createStandup,
  getStandupsByDate,
  getUserStandupForDate,
  updateStandup,
  getSubmissionStats,
} from '@/services/db/standups';
import type { ApiResponse, Standup, StandupFormData } from '@/types';

/**
 * Submit a new standup for today
 */
export async function submitStandupAction(
  workspaceId: string,
  data: StandupFormData
): Promise<ApiResponse<Standup>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Check workspace access
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

    const today = new Date().toISOString().split('T')[0];

    // Check if already submitted today
    const existing = await getUserStandupForDate(
      client,
      workspaceId,
      user.id,
      today
    );
    if (existing) {
      return {
        success: false,
        error: 'You have already submitted a standup for today',
      };
    }

    // Create standup
    const standup = await createStandup(client, {
      workspace_id: workspaceId,
      user_id: user.id,
      date: today,
      submission_method: 'dashboard',
      ...data,
    });

    return {
      success: true,
      data: standup,
      message: 'Standup submitted successfully',
    };
  } catch (error) {
    console.error('[v0] Error submitting standup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit standup',
    };
  }
}

/**
 * Update an existing standup
 */
export async function updateStandupAction(
  standupId: string,
  data: Partial<StandupFormData>
): Promise<ApiResponse<Standup>> {
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

    // Get standup to verify ownership
    const { data: standup, error: fetchError } = await client
      .from('standups')
      .select()
      .eq('id', standupId)
      .single();

    if (fetchError || !standup) {
      return {
        success: false,
        error: 'Standup not found',
      };
    }

    if (standup.user_id !== user.id) {
      return {
        success: false,
        error: 'You can only update your own standups',
      };
    }

    const updated = await updateStandup(client, standupId, data);

    return {
      success: true,
      data: updated,
      message: 'Standup updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update standup',
    };
  }
}

/**
 * Get all standups for a specific date
 */
export async function getStandupsByDateAction(
  workspaceId: string,
  date: string
): Promise<ApiResponse<Standup[]>> {
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

    const standups = await getStandupsByDate(client, workspaceId, date);

    return {
      success: true,
      data: standups,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch standups',
    };
  }
}

/**
 * Get submission statistics for a date
 */
export async function getSubmissionStatsAction(
  workspaceId: string,
  date: string
): Promise<
  ApiResponse<{
    totalMembers: number;
    submitted: number;
    rate: number;
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

    const stats = await getSubmissionStats(client, workspaceId, date);

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch statistics',
    };
  }
}

/**
 * Get user's standup for a specific date
 */
export async function getUserStandupAction(
  workspaceId: string,
  date: string
): Promise<ApiResponse<Standup | null>> {
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

    const standup = await getUserStandupForDate(
      client,
      workspaceId,
      user.id,
      date
    );

    return {
      success: true,
      data: standup,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch standup',
    };
  }
}
