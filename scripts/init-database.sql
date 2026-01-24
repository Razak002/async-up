-- Async Standup Generator - Database Schema
-- Run this migration in Supabase SQL Editor after connecting your project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create workspaces table (team/org container)
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace_members table (user-workspace association)
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin' or 'member'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Create standups table (daily/weekly entries)
CREATE TABLE IF NOT EXISTS standups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  what_worked TEXT NOT NULL,
  what_next TEXT NOT NULL,
  blockers TEXT,
  submission_method TEXT DEFAULT 'dashboard', -- 'dashboard', 'slack', 'voice'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, user_id, date)
);

-- Create summaries table (AI-generated digests)
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  summary_type TEXT NOT NULL, -- 'daily' or 'weekly'
  summary_date DATE NOT NULL,
  generated_summary TEXT NOT NULL,
  highlights TEXT,
  blockers_summary TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, summary_type, summary_date)
);

-- Create slack_config table (workspace slack webhook URLs)
CREATE TABLE IF NOT EXISTS slack_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_standups_workspace_id ON standups(workspace_id);
CREATE INDEX IF NOT EXISTS idx_standups_user_id ON standups(user_id);
CREATE INDEX IF NOT EXISTS idx_standups_date ON standups(date);
CREATE INDEX IF NOT EXISTS idx_standups_workspace_date ON standups(workspace_id, date);
CREATE INDEX IF NOT EXISTS idx_summaries_workspace_id ON summaries(workspace_id);
CREATE INDEX IF NOT EXISTS idx_summaries_date ON summaries(summary_date);

-- Enable Row Level Security (RLS)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE standups ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE slack_config ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view workspaces they're members of
CREATE POLICY "Users can view their workspaces"
  ON workspaces
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can view workspace members of their workspaces
CREATE POLICY "Users can view members of their workspaces"
  ON workspace_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members AS wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can only see standups from their workspaces
CREATE POLICY "Users can view standups in their workspaces"
  ON standups
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = standups.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert their own standups
CREATE POLICY "Users can create standups for themselves"
  ON standups
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = standups.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update their own standups
CREATE POLICY "Users can update their own standups"
  ON standups
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can view summaries from their workspaces
CREATE POLICY "Users can view summaries in their workspaces"
  ON summaries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = summaries.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- RLS Policy: Only admins can view slack_config
CREATE POLICY "Only admins can view slack_config"
  ON slack_config
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = slack_config.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );

-- RLS Policy: Only admins can update slack_config
CREATE POLICY "Only admins can update slack_config"
  ON slack_config
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = slack_config.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );
