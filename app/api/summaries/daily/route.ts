/**
 * Slack Webhook Endpoint
 * Receives Slack events and handles integrations
 */

import { createClient } from '@supabase/supabase-js';
import { isValidSlackWebhookUrl } from '@/services/integrations/slack';
import type { ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Slack sends a challenge request to verify the endpoint
    if (body.type === 'url_verification') {
      return Response.json({ challenge: body.challenge });
    }

    // Handle Slack events
    if (body.type === 'event_callback') {
      const event = body.event;

      // Handle app_mention events
      if (event.type === 'app_mention') {
        return await handleAppMention(event);
      }

      // Handle slash_commands
      if (event.type === 'slash_commands') {
        return await handleSlashCommand(event);
      }
    }

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error('[v0] Slack webhook error:', error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      },
      { status: 500 }
    );
  }
}

async function handleAppMention(event: any) {
  console.log('[v0] App mentioned in Slack:', event);
  // TODO: Implement app mention handling
  return Response.json({ ok: true });
}

async function handleSlashCommand(event: any) {
  console.log('[v0] Slash command received:', event);
  // TODO: Implement slash command handling
  return Response.json({ ok: true });
}

/**
 * Send a test notification to Slack
 */
export async function PUT(request: Request) {
  try {
    const { workspaceId, webhookUrl, testMessage } = await request.json();

    if (!webhookUrl) {
      return Response.json(
        { success: false, error: 'webhookUrl is required' },
        { status: 400 }
      );
    }

    if (!isValidSlackWebhookUrl(webhookUrl)) {
      return Response.json(
        { success: false, error: 'Invalid Slack webhook URL' },
        { status: 400 }
      );
    }

    // Send test message
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: testMessage || 'Test notification from Async Standup',
      }),
    });

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          error: 'Failed to send Slack message',
        },
        { status: response.status }
      );
    }

    const result: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Test message sent successfully' },
    };

    return Response.json(result);
  } catch (error) {
    console.error('[v0] Slack test error:', error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to test webhook',
      },
      { status: 500 }
    );
  }
}
