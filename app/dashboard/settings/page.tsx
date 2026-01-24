'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Bell, Users, Slack } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your workspace and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md bg-muted">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
              <CardDescription>
                Manage your workspace settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  placeholder="My Team"
                  defaultValue="My Team"
                  className="bg-input border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-slug">Workspace URL</Label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground">
                    app.asyncstandup.com/
                  </div>
                  <Input
                    id="workspace-slug"
                    placeholder="my-team"
                    defaultValue="my-team"
                    className="flex-1 bg-input border-input"
                  />
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage who has access to your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">you@example.com</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                  <span className="text-xs text-muted-foreground">You</span>
                </div>
              </div>
              <Button variant="outline" className="border-border w-full bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Invite Team Members
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Daily Summary Notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when daily summaries are ready
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    Submission Reminders
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Remind me if I haven't submitted my standup
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    Team Updates
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get notified of team member submissions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Slack Integration</CardTitle>
              <CardDescription>
                Connect your Slack workspace for notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Slack className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-foreground">Slack</p>
                    <p className="text-sm text-muted-foreground">
                      Not connected
                    </p>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 w-full bg-transparent">
                Delete Workspace
              </Button>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone. All data will be permanently deleted.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
