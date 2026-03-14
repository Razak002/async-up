"use client";

import { useState, useEffect, useCallback } from "react";
import { format, subDays } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  Flame,
  Trophy,
  BarChart3,
  AlertCircle,
  Clock,
} from "lucide-react";
import { getStandupsByDateAction } from "@/app/actions/standups";
import { StandupCard } from "@/components/dashboard/standup-card";

import { toast } from "sonner";
import { API_URL } from '@/lib/api-config';

import type { Standup } from "@/types";

/* ── Types ─────────────────────────────────────── */
interface WeeklyActivity {
  week: string;
  count: number;
}
interface StreakData {
  current: number;
  longest: number;
  totalSubmissions: number;
}
interface PersonalStandup {
  _id: string;
  date: string;
  what_worked: string;
  what_next: string;
  blockers?: string;
  submission_method: string;
  createdAt?: string;
}
interface BlockerItem {
  _id: string;
  date: string;
  blocker: string;
  what_next: string;
  user?: { full_name?: string; email?: string };
}
// Extends Standup with the extra fields returned from our backend
type TeamStandup = Standup & {
  _id?: string;
  user?: { full_name?: string; email: string };
  createdAt?: string;
};

/* ── Mini bar chart (no lib needed) ────────────── */
function WeeklyBarChart({ data }: { data: WeeklyActivity[] }) {
  if (!data.length)
    return (
      <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
        No activity data yet
      </div>
    );
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-24 w-full">
      {data.map(({ week, count }) => {
        const pct = Math.round((count / max) * 100);
        const label = format(new Date(week + "T12:00:00"), "MMM d");
        return (
          <div
            key={week}
            className="flex-1 flex flex-col items-center gap-1 group"
            title={`${label}: ${count} standup${count !== 1 ? "s" : ""}`}
          >
            <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {count}
            </span>
            <div
              className="w-full rounded-t-sm transition-all duration-300"
              style={{
                height: `${Math.max(pct, 6)}%`,
                background:
                  pct > 60
                    ? "linear-gradient(180deg, #013E37 0%, #025748 100%)"
                    : pct > 30
                      ? "linear-gradient(180deg, #025748 0%, #D0E8E5 100%)"
                      : "#D0E8E5",
              }}
            />
            <span className="text-[9px] text-muted-foreground">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Streak badge ───────────────────────────────── */
function StreakCard({ streak }: { streak: StreakData }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        {
          icon: Flame,
          label: "Current Streak",
          value: `${streak.current}d`,
          color: "#FF6B35",
        },
        {
          icon: Trophy,
          label: "Longest Streak",
          value: `${streak.longest}d`,
          color: "#FFEFB3",
        },
        {
          icon: BarChart3,
          label: "Total",
          value: streak.totalSubmissions,
          color: "#013E37",
        },
      ].map(({ icon: Icon, label, value, color }) => (
        <div
          key={label}
          className="rounded-xl p-4 border border-border text-center space-y-1 card-premium"
        >
          <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color }}
          >
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Main page ─────────────────────────────────── */
export default function StandupsPage() {
  const [tab, setTab] = useState("team");

  // Team tab state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [teamStandups, setTeamStandups] = useState<TeamStandup[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState("");

  // My History tab state
  const [myStandups, setMyStandups] = useState<PersonalStandup[]>([]);
  const [streak, setStreak] = useState<StreakData>({
    current: 0,
    longest: 0,
    totalSubmissions: 0,
  });
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [blockers, setBlockers] = useState<BlockerItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [historyTab, setHistoryTab] = useState("timeline");

  /* team standups load */
  useEffect(() => {
    async function load() {
      setTeamLoading(true);
      setTeamError("");
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          setTeamError("Not authenticated");
          setTeamLoading(false);
          return;
        }

        const wsRes = await fetch(`${API_URL}/api/workspaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!wsRes.ok) throw new Error("Failed to load workspaces");
        const workspaces = await wsRes.json();
        if (!workspaces?.length) {
          setTeamError("No workspace found");
          setTeamLoading(false);
          return;
        }

        const wsId = workspaces[0]._id;
        setWorkspaceId(wsId);
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const res = await getStandupsByDateAction(wsId, dateStr, token);
        setTeamStandups((res.data || []) as TeamStandup[]);
        if (!res.success) setTeamError(res.error || "Failed to fetch");
      } catch {
        setTeamError("Failed to load standups");
      } finally {
        setTeamLoading(false);
      }
    }
    load();
  }, [selectedDate]);

  /* personal history load */
  const loadHistory = useCallback(async () => {
    if (!workspaceId) return;
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setHistoryError("Not authenticated");
        return;
      }

      const [meRes, blockersRes] = await Promise.all([
        fetch(
          `${API_URL}/api/standups/me?workspaceId=${workspaceId}&limit=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
        fetch(
          `${API_URL}/api/standups/workspace/${workspaceId}/blockers?limit=30`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      ]);

      if (meRes.ok) {
        const data = await meRes.json();
        setMyStandups(data.standups || []);
        setStreak(
          data.streak || { current: 0, longest: 0, totalSubmissions: 0 },
        );
        setWeeklyActivity(data.weeklyActivity || []);
      } else {
        setHistoryError("Failed to load history");
      }
      if (blockersRes.ok) {
        const data = await blockersRes.json();
        setBlockers(data.blockers || []);
      }
    } catch {
      setHistoryError("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (tab === "history" && workspaceId) loadHistory();
  }, [tab, workspaceId, loadHistory]);

  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  /* Group personal standups by month */
  const groupedStandups: Record<string, PersonalStandup[]> = {};
  for (const s of myStandups) {
    const month = format(new Date(s.date + "T12:00:00"), "MMMM yyyy");
    if (!groupedStandups[month]) groupedStandups[month] = [];
    groupedStandups[month].push(s);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Standups
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your team&apos;s daily progress and your personal history
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="team">Team Standups</TabsTrigger>
          <TabsTrigger value="history">My History</TabsTrigger>
        </TabsList>

        {/* ── Team Standups Tab ─────────────────────── */}
        <TabsContent value="team" className="space-y-5 mt-5">
          {/* Date picker */}
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedDate((prev) => subDays(prev, 1))}
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-base font-semibold text-foreground">
                      {format(selectedDate, "MMMM dd, yyyy")}
                    </p>
                    {isToday && (
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "#013E37" }}
                      >
                        Today
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSelectedDate(
                      (prev) => new Date(prev.getTime() + 86400000),
                    )
                  }
                  disabled={isToday}
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Standup list */}
          {teamLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2
                className="w-7 h-7 animate-spin"
                style={{ color: "#013E37" }}
              />
              <p className="text-sm">Loading standups…</p>
            </div>
          ) : teamError ? (
            <div
              className="p-4 rounded-xl text-sm text-destructive text-center"
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              {teamError}
            </div>
          ) : teamStandups.length > 0 ? (
            <div className="grid gap-4">
              {teamStandups.map((s) => (
                <StandupCard
                  key={s._id ?? s.id}
                  standup={s as Parameters<typeof StandupCard>[0]["standup"]}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-20 rounded-2xl border border-dashed border-border">
              <Calendar className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                No standups for {format(selectedDate, "MMM dd, yyyy")}
              </p>
            </div>
          )}
        </TabsContent>

        {/* ── My History Tab ────────────────────────── */}
        <TabsContent value="history" className="space-y-5 mt-5">
          {historyLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2
                className="w-7 h-7 animate-spin"
                style={{ color: "#013E37" }}
              />
              <p className="text-sm">Loading your history…</p>
            </div>
          ) : historyError ? (
            <div
              className="p-4 rounded-xl text-sm text-destructive text-center"
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              {historyError}
            </div>
          ) : (
            <>
              {/* Streak cards */}
              <StreakCard streak={streak} />

              {/* Activity chart */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Weekly Activity</CardTitle>
                  <CardDescription>
                    Your standup submissions over the last 8 weeks
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-5">
                  <WeeklyBarChart data={weeklyActivity} />
                </CardContent>
              </Card>

              {/* Sub-tabs: Timeline | Blockers */}
              <Tabs value={historyTab} onValueChange={setHistoryTab}>
                <TabsList className="bg-muted">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="blockers">
                    Blockers
                    {blockers.length > 0 && (
                      <span
                        className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(239,68,68,0.12)",
                          color: "#dc2626",
                        }}
                      >
                        {blockers.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Timeline */}
                <TabsContent value="timeline" className="mt-4 space-y-6">
                  {Object.keys(groupedStandups).length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 rounded-2xl border border-dashed border-border">
                      <Clock className="w-10 h-10 text-muted-foreground/40" />
                      <p className="text-muted-foreground text-sm">
                        No standup history yet. Submit your first standup!
                      </p>
                    </div>
                  ) : (
                    Object.entries(groupedStandups).map(([month, items]) => (
                      <div key={month} className="space-y-3">
                        {/* Month label */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            {month}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-xs text-muted-foreground">
                            {items.length} standup
                            {items.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="grid gap-3 pl-1">
                          {items.map((s) => (
                            <div
                              key={s._id}
                              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-[#013E37]/20 hover:shadow-sm"
                            >
                              {/* Teal left bar */}
                              <div
                                className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l"
                                style={{ background: "#013E37" }}
                              />
                              <div className="pl-4 pr-5 py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span
                                    className="text-xs font-semibold"
                                    style={{ color: "#013E37" }}
                                  >
                                    {format(
                                      new Date(s.date + "T12:00:00"),
                                      "EEEE, MMM d",
                                    )}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full capitalize font-medium badge-teal border-0">
                                    {s.submission_method}
                                  </span>
                                </div>
                                <div className="space-y-2 text-sm text-foreground/80">
                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                                      What Worked
                                    </p>
                                    <p className="leading-relaxed">
                                      {s.what_worked}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                                      What&apos;s Next
                                    </p>
                                    <p className="leading-relaxed">
                                      {s.what_next}
                                    </p>
                                  </div>
                                  {s.blockers && (
                                    <div
                                      className="rounded-lg p-2.5"
                                      style={{
                                        background: "rgba(239,68,68,0.06)",
                                        border:
                                          "1px solid rgba(239,68,68,0.10)",
                                      }}
                                    >
                                      <p className="text-[10px] font-semibold uppercase tracking-widest text-red-500 mb-0.5">
                                        Blocker
                                      </p>
                                      <p className="text-red-600 dark:text-red-400 leading-relaxed">
                                        {s.blockers}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                {/* Blockers */}
                <TabsContent value="blockers" className="mt-4 space-y-3">
                  {blockers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 rounded-2xl border border-dashed border-border">
                      <AlertCircle className="w-10 h-10 text-muted-foreground/30" />
                      <p className="text-muted-foreground text-sm font-medium">
                        No blockers recorded 🎉
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your team is running smoothly!
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground px-1">
                        Showing the last {blockers.length} standup
                        {blockers.length !== 1 ? "s" : ""} with blockers from
                        your workspace
                      </p>
                      {blockers.map((b) => (
                        <div
                          key={b._id}
                          className="rounded-xl border border-red-100 dark:border-red-900/30 overflow-hidden"
                        >
                          <div
                            className="h-0.5 w-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #dc2626, #ef4444)",
                            }}
                          />
                          <div className="p-4 space-y-2 bg-card">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                  {b.user?.full_name ||
                                    b.user?.email?.split("@")[0] ||
                                    "Team Member"}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(
                                  new Date(b.date + "T12:00:00"),
                                  "MMM d, yyyy",
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              {b.blocker}
                            </p>
                            {b.what_next && (
                              <p className="text-xs text-muted-foreground border-t border-border pt-2 mt-2">
                                <span className="font-semibold">
                                  Next action:{" "}
                                </span>
                                {b.what_next}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
