/**
 * Async Standup Generator - Type Definitions
 * Core types that match our Supabase database schema
 */

// Workspace types
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

// Standup types
export interface Standup {
  id: string;
  workspace_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  what_worked: string;
  what_next: string;
  blockers?: string;
  submission_method: 'dashboard' | 'slack' | 'voice';
  created_at: string;
  updated_at: string;
}

export interface StandupFormData {
  what_worked: string;
  what_next: string;
  blockers?: string;
}

// Summary types
export interface Summary {
  id: string;
  workspace_id: string;
  summary_type: 'daily' | 'weekly';
  summary_date: string; // YYYY-MM-DD
  generated_summary: string;
  highlights?: string;
  blockers_summary?: string;
  generated_at: string;
}

// Slack config types
export interface SlackConfig {
  id: string;
  workspace_id: string;
  webhook_url: string;
  channel_id: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// User profile (extended from Supabase auth)
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Dashboard view types
export interface StandupWithUser extends Standup {
  user?: UserProfile;
}

export interface DailyDigest {
  date: string;
  standups: StandupWithUser[];
  totalCount: number;
  submittedCount: number;
}

export interface ManagerStats {
  totalTeamMembers: number;
  dailySubmissionRate: number;
  weeklySubmissionRate: number;
  averageBlockersPerDay: number;
  lastSummaryDate?: string;
}
