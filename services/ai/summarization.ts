/**
 * AI Summarization Service
 * Uses Vercel AI Gateway with Claude to generate team summaries
 */

import { generateText, Output } from 'ai';
import type { Standup } from '@/types';

interface SummaryContent {
  title: string;
  overview: string;
  highlights: string[];
  blockers: {
    area: string;
    issue: string;
  }[];
  nextSteps: string[];
}

/**
 * Generate a daily standup summary from individual standups
 */
export async function generateDailySummary(
  standups: Standup[],
  teamMemberCount: number
): Promise<SummaryContent> {
  if (standups.length === 0) {
    return {
      title: 'Daily Standup Summary - No Submissions',
      overview: `No standups submitted today (0/${teamMemberCount} team members)`,
      highlights: [],
      blockers: [],
      nextSteps: [],
    };
  }

  const standupTexts = standups
    .map((standup) => {
      return `
Team Member Submission:
- What Worked: ${standup.what_worked}
- What's Next: ${standup.what_next}
${standup.blockers ? `- Blockers: ${standup.blockers}` : ''}
`;
    })
    .join('\n');

  const submissionRate = Math.round((standups.length / teamMemberCount) * 100);

  const prompt = `You are a skilled technical lead summarizing team standups. Analyze the following standup submissions from ${standups.length} team members (${submissionRate}% submission rate) and generate a structured daily summary.

STANDUP SUBMISSIONS:
${standupTexts}

Generate a summary with the following structure:
1. A clear title for the daily summary
2. A brief overview of team progress and submission rate
3. 3-5 key highlights from what the team accomplished
4. Any critical blockers that need attention
5. 2-3 important next steps based on team plans

Focus on what's most important for leadership visibility.`;

  try {
    const { object } = await generateText({
      model: 'anthropic/claude-opus-4.5',
      prompt,
      system:
        'You are a expert at summarizing technical team standups into actionable insights. Always be concise and focus on key blockers and accomplishments.',
      output: Output.object({
        schema: {
          type: 'object' as const,
          properties: {
            title: { type: 'string' as const },
            overview: { type: 'string' as const },
            highlights: {
              type: 'array' as const,
              items: { type: 'string' as const },
            },
            blockers: {
              type: 'array' as const,
              items: {
                type: 'object' as const,
                properties: {
                  area: { type: 'string' as const },
                  issue: { type: 'string' as const },
                },
                required: ['area', 'issue'],
              },
            },
            nextSteps: {
              type: 'array' as const,
              items: { type: 'string' as const },
            },
          },
          required: ['title', 'overview', 'highlights', 'blockers', 'nextSteps'],
        },
      }),
    });

    return object as SummaryContent;
  } catch (error) {
    console.error('[v0] AI summarization error:', error);
    // Fallback summary
    return {
      title: 'Daily Standup Summary',
      overview: `${standups.length} team members submitted standups (${submissionRate}% submission rate)`,
      highlights: standups
        .slice(0, 3)
        .map((s) => s.what_worked),
      blockers: standups
        .filter((s) => s.blockers)
        .map((s) => ({
          area: 'General',
          issue: s.blockers || '',
        }))
        .slice(0, 3),
      nextSteps: standups
        .slice(0, 2)
        .map((s) => s.what_next),
    };
  }
}

/**
 * Generate a weekly standup summary from daily data
 */
export async function generateWeeklySummary(
  standups: Standup[],
  teamMemberCount: number
): Promise<SummaryContent> {
  if (standups.length === 0) {
    return {
      title: 'Weekly Standup Summary - No Submissions',
      overview: `No standups submitted this week`,
      highlights: [],
      blockers: [],
      nextSteps: [],
    };
  }

  // Group standups by date to show weekly trends
  const standupsByDay = new Map<string, Standup[]>();
  standups.forEach((standup) => {
    const day = standup.date;
    if (!standupsByDay.has(day)) {
      standupsByDay.set(day, []);
    }
    standupsByDay.get(day)!.push(standup);
  });

  const daysSummary = Array.from(standupsByDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(
      ([date, dayStandups]) =>
        `Date: ${date} (${dayStandups.length} submissions)\n${dayStandups.map((s) => `  - ${s.what_worked}`).join('\n')}`
    )
    .join('\n\n');

  const prompt = `You are a skilled engineering manager summarizing weekly team standups. Analyze the standup data from the past week and generate a structured summary.

WEEKLY STANDUP DATA:
${daysSummary}

Generate a weekly summary with:
1. A title for the weekly summary
2. Overview of weekly progress (submissions, trends)
3. Top 5 accomplishments from the week
4. Recurring or critical blockers
5. Team priorities for next week

Be strategic and focus on what matters for weekly planning.`;

  try {
    const { object } = await generateText({
      model: 'anthropic/claude-opus-4.5',
      prompt,
      system:
        'You are a strategic technical leader. Summarize weekly standups to highlight progress, blockers, and priorities for the coming week.',
      output: Output.object({
        schema: {
          type: 'object' as const,
          properties: {
            title: { type: 'string' as const },
            overview: { type: 'string' as const },
            highlights: {
              type: 'array' as const,
              items: { type: 'string' as const },
            },
            blockers: {
              type: 'array' as const,
              items: {
                type: 'object' as const,
                properties: {
                  area: { type: 'string' as const },
                  issue: { type: 'string' as const },
                },
                required: ['area', 'issue'],
              },
            },
            nextSteps: {
              type: 'array' as const,
              items: { type: 'string' as const },
            },
          },
          required: ['title', 'overview', 'highlights', 'blockers', 'nextSteps'],
        },
      }),
    });

    return object as SummaryContent;
  } catch (error) {
    console.error('[v0] Weekly AI summarization error:', error);
    // Fallback summary
    return {
      title: 'Weekly Standup Summary',
      overview: `${standups.length} standups across ${standupsByDay.size} days`,
      highlights: Array.from(standupsByDay.values())
        .flatMap((dayStandups) => dayStandups.map((s) => s.what_worked))
        .slice(0, 5),
      blockers: standups
        .filter((s) => s.blockers)
        .map((s) => ({
          area: 'General',
          issue: s.blockers || '',
        }))
        .slice(0, 5),
      nextSteps: Array.from(standupsByDay.values())
        .flatMap((dayStandups) => dayStandups.map((s) => s.what_next))
        .slice(0, 3),
    };
  }
}

/**
 * Extract and format summary as plain text for Slack/email
 */
export function formatSummaryAsText(summary: SummaryContent): string {
  let text = `*${summary.title}*\n`;
  text += `_${summary.overview}_\n\n`;

  if (summary.highlights.length > 0) {
    text += `*✨ Highlights:*\n`;
    summary.highlights.forEach((h) => {
      text += `  • ${h}\n`;
    });
    text += '\n';
  }

  if (summary.blockers.length > 0) {
    text += `*🚧 Blockers:*\n`;
    summary.blockers.forEach((b) => {
      text += `  • [${b.area}] ${b.issue}\n`;
    });
    text += '\n';
  }

  if (summary.nextSteps.length > 0) {
    text += `*→ Next Steps:*\n`;
    summary.nextSteps.forEach((step) => {
      text += `  • ${step}\n`;
    });
  }

  return text;
}
