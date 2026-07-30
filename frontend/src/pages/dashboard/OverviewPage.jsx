import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Globe,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { userApi } from "../../lib/api";

// Helper: build a weekly chart from scan history data
function buildWeeklyChart(history) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const map = {};
  days.forEach((d) => (map[d] = { name: d, safe: 0, suspicious: 0, malicious: 0 }));

  (history || []).forEach((scan) => {
    const day = days[new Date(scan.createdAt).getDay()];
    if (!map[day]) return;
    if (scan.verdict === "SAFE") map[day].safe++;
    else if (scan.verdict === "SUSPICIOUS") map[day].suspicious++;
    else if (scan.verdict === "DANGEROUS") map[day].malicious++;
  });

  // Rotate so today is last
  const today = new Date().getDay();
  const ordered = [];
  for (let i = 1; i <= 7; i++) {
    ordered.push(map[days[(today + i) % 7]]);
  }
  return ordered;
}

function StatCard({ title, value, sub, subColor = "text-slate-500", icon: Icon, iconColor, bg }) {
  return (
    <Card className={`border-slate-200 shadow-sm ${bg || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${bg ? "text-red-800" : "text-slate-600"}`}>
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${bg ? "text-red-700" : "text-slate-900 dark:text-white"}`}>{value}</div>
        <p className={`mt-1 text-xs ${subColor}`}>{sub}</p>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="border-slate-200 shadow-sm animate-pulse">
      <CardHeader className="pb-2">
        <div className="h-4 bg-slate-200 rounded w-24" />
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-slate-200 rounded w-16 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-28" />
      </CardContent>
    </Card>
  );
}

export function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          userApi.getStats(),
          userApi.getHistory(1, 50),
        ]);
        setStats(statsRes.data);
        setHistory(historyRes.history || []);
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = buildWeeklyChart(history);
  const recentScans = [...history].slice(0, 5);

  const verdictBadge = (verdict) => {
    if (verdict === "SAFE") return { variant: "secondary", className: "bg-green-100 text-green-700 hover:bg-green-100", label: "Safe" };
    if (verdict === "SUSPICIOUS") return { variant: "secondary", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100", label: "Suspicious" };
    return { variant: "destructive", className: "", label: "Dangerous" };
  };

  const safeRate = stats && stats.totalScans > 0
    ? ((stats.safeCount / stats.totalScans) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Scans"
              value={stats?.totalScans ?? 0}
              sub="All time scans"
              icon={Activity}
              iconColor="text-blue-600"
            />
            <StatCard
              title="Safe URLs"
              value={stats?.safeCount ?? 0}
              sub={`${safeRate}% safe rate`}
              subColor="font-medium text-green-600"
              icon={ShieldCheck}
              iconColor="text-green-600"
            />
            <StatCard
              title="Threats Blocked"
              value={stats?.dangerousCount ?? 0}
              sub={`${stats?.suspiciousCount ?? 0} suspicious`}
              subColor="text-red-600"
              icon={ShieldAlert}
              iconColor="text-red-600"
              bg="bg-red-50/50"
            />
            <StatCard
              title="Safety Score"
              value={`${stats?.currentSafetyScore ?? 100}`}
              sub={`Avg risk: ${(stats?.averageRiskScore ?? 0).toFixed(1)}`}
              icon={TrendingUp}
              iconColor="text-purple-600"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Scan Activity</CardTitle>
            <CardDescription>
              Daily breakdown of scanned URLs over the last 7 days.
            </CardDescription>
          </CardHeader>

          <CardContent className="h-[300px] pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMalicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area type="monotone" dataKey="safe" stroke="#16a34a" fillOpacity={1} fill="url(#colorSafe)" />
                <Area type="monotone" dataKey="suspicious" stroke="#eab308" fillOpacity={1} fill="url(#colorSuspicious)" />
                <Area type="monotone" dataKey="malicious" stroke="#dc2626" fillOpacity={1} fill="url(#colorMalicious)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="col-span-3 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Detections</CardTitle>
            <CardDescription>Latest URLs processed by the engine.</CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentScans.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-8">
                No scans yet. Go to <strong>Scan URL</strong> to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {recentScans.map((scan) => {
                  const badge = verdictBadge(scan.verdict);
                  return (
                    <div
                      key={scan._id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="mr-4 overflow-hidden">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{scan.url}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(scan.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={badge.variant} className={badge.className}>
                        {badge.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}