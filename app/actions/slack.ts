/**
 * Slack Configuration Server Actions
 * Handle Slack integration setup and management
 */

'use server';

import { createClient } from '@supabase/supabase-js';
import { getCurrentUser, hasWorkspaceAccess, isWorkspaceAdmin } from '@/services/auth/server';
import {
  getSlackConfig,
  createSlackConfig,
  updateSlackConfig,
  deleteSlackConfig,
  toggleSlackNotifications,
} from '@/services/db/slack';
import { isValidSlackWebhookUrl } from '@/services/integrations/slack';
import type { ApiResponse, SlackConfig } from '@/types';

/**
 * Get Slack configuration for a workspace
 */
export async function getSlackConfigAction(
  workspaceId: string
): Promise<ApiResponse<SlackConfig | null>> {
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

    const config = await getSlackConfig(client, workspaceId);

    return {
      success: true,
      data: config,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch Slack config',
    };
  }
}

/**
 * Create or update Slack configuration
 */
export async function saveSlackConfigAction(
  workspaceId: string,
  data: {
    webhook_url: string;
    channel_id: string;
  }
): Promise<ApiResponse<SlackConfig>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Check if user is admin
    const isAdmin = await isWorkspaceAdmin(workspaceId, user.id);
    if (!isAdmin) {
      return {
        success: false,
        error: 'Only admins can configure Slack integration',
      };
    }

    // Validate webhook URL
    if (!isValidSlackWebhookUrl(data.webhook_url)) {
      return {
        success: false,
        error: 'Invalid Slack webhook URL format',
      };
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if config exists
    const existing = await getSlackConfig(client, workspaceId);

    let config: SlackConfig;
    if (existing) {
      // Update existing config
      config = await updateSlackConfig(client, workspaceId, {
        webhook_url: data.webhook_url,
        channel_id: data.channel_id,
      });
    } else {
      // Create new config
      config = await createSlackConfig(client, {
        workspace_id: workspaceId,
        webhook_url: data.webhook_url,
        channel_id: data.channel_id,
      });
    }

    return {
      success: true,
      data: config,
      message: 'Slack configuration saved successfully',
    };
  } catch (error) {
    console.error('[v0] Error saving Slack config:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to save Slack config',
    };
  }
}

/**
 * Toggle Slack notifications
 */
export async function toggleSlackNotificationsAction(
  workspaceId: string,
  enabled: boolean
): Promise<ApiResponse<SlackConfig>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Check if user is admin
    const isAdmin = await isWorkspaceAdmin(workspaceId, user.id);
    if (!isAdmin) {
      return {
        success: false,
        error: 'Only admins can change notification settings',
      };
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const config = await toggleSlackNotifications(client, workspaceId, enabled);

    return {
      success: true,
      data: config,
      message: `Slack notifications ${enabled ? 'enabled' : 'disabled'}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update notification settings',
    };
  }
}

/**
 * Delete Slack configuration
 */
export async function deleteSlackConfigAction(
  workspaceId: string
): Promise<ApiResponse<null>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Check if user is admin
    const isAdmin = await isWorkspaceAdmin(workspaceId, user.id);
    if (!isAdmin) {
      return {
        success: false,
        error: 'Only admins can delete Slack integration',
      };
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await deleteSlackConfig(client, workspaceId);

    return {
      success: true,
      message: 'Slack integration removed successfully',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete Slack config',
    };
  }
}
