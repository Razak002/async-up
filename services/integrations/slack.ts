/**
 * Slack Integration Service
 * Handles sending notifications and messages to Slack
 */

interface SlackBlockMessage {
  blocks: Array<Record<string, any>>;
  text?: string; // Fallback text for clients that don't support blocks
}

/**
 * Send a message to Slack webhook
 */
export async function sendSlackMessage(
  webhookUrl: string,
  message: SlackBlockMessage | string
): Promise<boolean> {
  try {
    const payload =
      typeof message === 'string'
        ? { text: message }
        : message;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[v0] Slack webhook error:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[v0] Failed to send Slack message:', error);
    return false;
  }
}

/**
 * Create a formatted Slack message for daily summary
 */
export function createDailySummaryBlock(
  summary: {
    title: string;
    overview: string;
    highlights: string[];
    blockers: Array<{ area: string; issue: string }>;
    nextSteps: string[];
  },
  dashboardUrl: string
): SlackBlockMessage {
  const blocks: Array<Record<string, any>> = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: summary.title,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: summary.overview,
      },
    },
  ];

  if (summary.highlights.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*✨ Highlights*\n${summary.highlights.map((h) => `• ${h}`).join('\n')}`,
      },
    });
  }

  if (summary.blockers.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*🚧 Blockers*\n${summary.blockers.map((b) => `• *${b.area}:* ${b.issue}`).join('\n')}`,
      },
    });
  }

  if (summary.nextSteps.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*→ Next Steps*\n${summary.nextSteps.map((s) => `• ${s}`).join('\n')}`,
      },
    });
  }

  blocks.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Full Summary',
        },
        url: dashboardUrl,
        action_id: 'view_summary',
      },
    ],
  });

  return {
    blocks,
    text: summary.title,
  };
}

/**
 * Create a formatted Slack message for weekly summary
 */
export function createWeeklySummaryBlock(
  summary: {
    title: string;
    overview: string;
    highlights: string[];
    blockers: Array<{ area: string; issue: string }>;
    nextSteps: string[];
  },
  dashboardUrl: string
): SlackBlockMessage {
  const blocks: Array<Record<string, any>> = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: summary.title,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: summary.overview,
      },
    },
  ];

  if (summary.highlights.length > 0) {
    blocks.push({
      type: 'divider',
    });
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*📊 Weekly Accomplishments*\n${summary.highlights.map((h) => `✓ ${h}`).join('\n')}`,
      },
    });
  }

  if (summary.blockers.length > 0) {
    blocks.push({
      type: 'divider',
    });
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*⚠️ Recurring Blockers*\n${summary.blockers.map((b) => `• *${b.area}:* ${b.issue}`).join('\n')}`,
      },
    });
  }

  if (summary.nextSteps.length > 0) {
    blocks.push({
      type: 'divider',
    });
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*🎯 Next Week's Focus*\n${summary.nextSteps.map((s) => `→ ${s}`).join('\n')}`,
      },
    });
  }

  blocks.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Full Report',
        },
        url: dashboardUrl,
        action_id: 'view_weekly',
      },
    ],
  });

  return {
    blocks,
    text: summary.title,
  };
}

/**
 * Send submission reminder to Slack
 */
export function createSubmissionReminderBlock(
  pendingCount: number,
  totalCount: number
): SlackBlockMessage {
  const submissionRate = Math.round(((totalCount - pendingCount) / totalCount) * 100);

  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '⏰ Standup Reminder',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${pendingCount} team members still need to submit their standup.\n\n*Submission Rate:* ${submissionRate}% (${totalCount - pendingCount}/${totalCount})`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Submit Standup',
            },
            action_id: 'submit_standup',
            style: 'primary',
          },
        ],
      },
    ],
    text: 'Standup Reminder',
  };
}

/**
 * Validate Slack webhook URL format
 */
export function isValidSlackWebhookUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'hooks.slack.com' &&
      urlObj.pathname.startsWith('/services/')
    );
  } catch {
    return false;
  }
}
