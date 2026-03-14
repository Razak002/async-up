
## 🏗️ Architecture Overview

```
Async Standup Generator
├── Frontend (Next.js 16)
│   ├── /app/auth - Login/Signup flows
│   ├── /app/dashboard - Team dashboard
│   ├── /app/manager - Manager analytics
│   └── /components - Reusable UI components
│
├── Backend (Server Actions & APIs)
│   ├── /app/actions - Server actions (auth, standups, summaries)
│   ├── /app/api - Route handlers (AI, Slack)
│   └── /services - Business logic
│
├── Database (Supabase PostgreSQL)
│   ├── workspaces - Teams/organizations
│   ├── workspace_members - User assignments
│   ├── standups - Daily standup entries
│   ├── summaries - AI-generated digests
│   └── slack_config - Slack webhooks
│
└── AI & Integrations
    ├── Vercel AI Gateway - Claude summaries
    └── Slack API - Notifications
```

---

## 🎯 Features

### ✅ Standup Management
- Submit daily standups (what worked, what's next, blockers)
- View team standups with date filtering
- Real-time submission tracking
- History and archiving

### ✅ AI Summarization
- Automatic daily summaries
- Weekly digests
- Structured insights (highlights, blockers, next steps)
- Integration with Slack

### ✅ Manager Dashboard
- Team analytics and metrics
- Submission rate tracking
- Blocker tracking and trends
- Top team members and productivity insights
- Export reports

### ✅ Security & Multi-tenancy
- Row Level Security on all tables
- Workspace isolation
- Role-based access (admin/member)
- Secure authentication with Supabase Auth

### ✅ Slack Integration
- Send summaries to Slack
- Notification preferences
- Configurable webhook URLs
- Formatted message blocks
