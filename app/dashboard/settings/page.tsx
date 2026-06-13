"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Bell, Users, Slack, Loader2, User, Sparkles, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api-config";

interface WorkspaceData {
  _id: string;
  name: string;
  slug: string;
}

interface MemberData {
  _id: string;
  role: string;
  user?: { full_name?: string; email?: string };
}

const AVATAR_BG_OPTIONS = [
  { id: "emerald", label: "Emerald Gradient", class: "bg-gradient-to-br from-[#013e37] to-[#011f1b] text-[#FFEFB3] border-[#f3d773]" },
  { id: "purple", label: "Royal Purple", class: "bg-gradient-to-br from-purple-800 to-purple-950 text-purple-100 border-purple-400" },
  { id: "blue", label: "Midnight Blue", class: "bg-gradient-to-br from-blue-900 to-blue-950 text-blue-100 border-blue-400" },
  { id: "crimson", label: "Crimson Spark", class: "bg-gradient-to-br from-rose-800 to-rose-950 text-rose-100 border-rose-400" },
  { id: "dark", label: "Charcoal Slate", class: "bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-100 border-zinc-500" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  // Personal Profile States
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [avatarBg, setAvatarBg] = useState("emerald");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tab = new URLSearchParams(window.location.search).get("tab");
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const storedUser = localStorage.getItem("auth-user");
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            setProfileEmail(userObj.email || "");
            setProfileName(userObj.user_metadata?.fullName || "");
            setAvatarBg(userObj.user_metadata?.avatarBg || "emerald");
          } catch (e) {
            console.error("Error parsing auth-user", e);
          }
        }


        const wsRes = await fetch(`${API_URL}/api/workspaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!wsRes.ok) throw new Error("Failed to load workspaces");

        const workspaces = await wsRes.json();
        if (!workspaces || workspaces.length === 0) {
          setError("No workspace found");
          setLoading(false);
          return;
        }

        const currentWorkspace = workspaces[0];
        setWorkspace(currentWorkspace);
        setEditName(currentWorkspace.name);
        setEditSlug(currentWorkspace.slug);

        const membersRes = await fetch(
          `${API_URL}/api/workspaces/${currentWorkspace._id}/members/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const storedUser = localStorage.getItem("auth-user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        const updatedUser = {
          ...userObj,
          user_metadata: {
            ...userObj.user_metadata,
            fullName: profileName,
            avatarBg: avatarBg,
          }
        };
        localStorage.setItem("auth-user", JSON.stringify(updatedUser));
        
        // Dispatch custom storage event to notify other components/tabs
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
        }
        
        toast.success("Profile updated!", {
          description: "Your profile settings have been saved successfully.",
        });
      }
    } catch (err) {
      toast.error("Failed to save profile", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSave = async () => {
    if (!workspace) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("auth-token");
      const res = await fetch(
        `${API_URL}/api/workspaces/${workspace._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: editName, slug: editSlug }),
        },
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update workspace");
      }
      const updated = await res.json();
      setWorkspace(updated);
      toast.success("Workspace updated!", {
        description: "Your workspace settings have been saved.",
      });
    } catch (err: unknown) {
      toast.error("Update failed", {
        description:
          err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!workspace || !inviteEmail) return;
    setIsInviting(true);
    try {
      const token = localStorage.getItem("auth-token");
      const res = await fetch(
        `${API_URL}/api/workspaces/${workspace._id}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: inviteEmail, role: "member" }),
        },
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to invite user");
      }
      const newMember = await res.json();
      setMembers([...members, newMember]);
      setInviteEmail("");
      toast.success("Invite sent!", {
        description: `${inviteEmail} has been invited to your workspace.`,
      });
    } catch (err: unknown) {
      toast.error("Invite failed", {
        description:
          err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleDelete = async () => {
    if (!workspace) return;

    // Custom confirmation toast instead of window.confirm
    toast.warning("Delete workspace?", {
      description:
        "This cannot be undone. All data will be permanently deleted.",
      action: {
        label: "Yes, delete",
        onClick: async () => {
          setIsDeleting(true);
          try {
            const token = localStorage.getItem("auth-token");
            const res = await fetch(
              `${API_URL}/api/workspaces/${workspace._id}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            if (!res.ok) throw new Error("Failed to delete workspace");
            localStorage.removeItem("auth-token");
            window.location.href = "/auth/signup";
          } catch (err: unknown) {
            toast.error("Delete failed", {
              description:
                err instanceof Error ? err.message : "Something went wrong.",
            });
            setIsDeleting(false);
          }
        },
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your workspace and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-lg bg-muted grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="general">Workspace</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center flex-col items-center p-20 gap-4 text-muted-foreground w-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Loading settings...</p>
          </div>
        ) : error ? (
          <div className="p-4 mt-8 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-semibold text-center">
            {error}
          </div>
        ) : (
          <>
            {/* Profile Tab Content */}
            <TabsContent value="profile" className="space-y-4">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Personal Profile</CardTitle>
                  <CardDescription>
                    Manage your personal account details and custom avatar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 text-3xl font-bold shadow-lg transition-transform duration-300 hover:scale-105 ${
                      AVATAR_BG_OPTIONS.find(opt => opt.id === avatarBg)?.class || AVATAR_BG_OPTIONS[0].class
                    }`}>
                      {profileName 
                        ? profileName.charAt(0).toUpperCase()
                        : profileEmail 
                          ? profileEmail.charAt(0).toUpperCase()
                          : <User className="w-8 h-8" />
                      }
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Avatar Background Theme</Label>
                      <div className="flex flex-wrap gap-2">
                        {AVATAR_BG_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setAvatarBg(opt.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                              opt.id === avatarBg 
                                ? `${opt.class} ring-2 ring-primary scale-105`
                                : "bg-card text-muted-foreground border-border hover:bg-muted"
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${opt.id === "emerald" ? "bg-[#f3d773]" : "bg-current"}`} />
                            {opt.label}
                            {opt.id === avatarBg && <Check className="w-3 h-3 ml-0.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Personal details inputs */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input
                        id="profile-name"
                        placeholder="John Doe"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="bg-input border-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email Address</Label>
                      <Input
                        id="profile-email"
                        value={profileEmail}
                        disabled
                        className="bg-muted border-input opacity-70 cursor-not-allowed"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Email address cannot be changed. Contact your workspace administrator for assistance.
                      </p>
                    </div>
                  </div>

                  <Button
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* General */}
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
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
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
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="flex-1 bg-input border-input"
                      />
                    </div>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
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
                    {members.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {member.user?.full_name ||
                              member.user?.email ||
                              "Unknown User"}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center lg:w-2/3 mt-6">
                    <Input
                      placeholder="name@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      className="border-border bg-transparent shrink-0"
                      onClick={handleInvite}
                      disabled={isInviting || !inviteEmail}
                    >
                      {isInviting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Users className="w-4 h-4 mr-2" />
                      )}
                      Invite Member
                    </Button>
                  </div>
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
                  {[
                    {
                      label: "Daily Summary Notifications",
                      desc: "Get notified when daily summaries are ready",
                      icon: Bell,
                    },
                    {
                      label: "Submission Reminders",
                      desc: "Remind me if I haven't submitted my standup",
                    },
                    {
                      label: "Team Updates",
                      desc: "Get notified of team member submissions",
                    },
                  ].map(({ label, desc, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground flex items-center gap-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          {label}
                        </p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
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
                <CardContent>
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
                  <Button
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10 w-full bg-transparent"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Delete Workspace
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone. All data will be permanently
                    deleted.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
