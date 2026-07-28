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

const data = [
  { name: "Mon", safe: 400, suspicious: 24, malicious: 12 },
  { name: "Tue", safe: 300, suspicious: 13, malicious: 8 },
  { name: "Wed", safe: 550, suspicious: 45, malicious: 22 },
  { name: "Thu", safe: 278, suspicious: 19, malicious: 5 },
  { name: "Fri", safe: 189, suspicious: 8, malicious: 2 },
  { name: "Sat", safe: 239, suspicious: 12, malicious: 9 },
  { name: "Sun", safe: 349, suspicious: 28, malicious: 15 },
];

const recentScans = [
  {
    id: 1,
    url: "https://secure-login.paypal-update.com",
    status: "Malicious",
    date: "2 mins ago",
  },
  {
    id: 2,
    url: "https://github.com/settings/security",
    status: "Safe",
    date: "15 mins ago",
  },
  {
    id: 3,
    url: "http://win-free-iphone.net/claim",
    status: "Malicious",
    date: "1 hour ago",
  },
  {
    id: 4,
    url: "https://docs.google.com/document/d/123",
    status: "Safe",
    date: "3 hours ago",
  },
];

export function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Scans (7d)
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2,305</div>
            <p className="mt-1 text-xs text-slate-500">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Safe URLs
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-600" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2,084</div>
            <p className="mt-1 text-xs font-medium text-green-600">
              90.4% safe rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-red-50/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Threats Blocked
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-600" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-red-700">73</div>
            <p className="mt-1 text-xs text-red-600">
              Action required on 2
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Active Domains
            </CardTitle>
            <Globe className="h-4 w-4 text-purple-600" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-slate-900">14</div>
            <p className="mt-1 text-xs text-slate-500">
              Across 3 organizations
            </p>
          </CardContent>
        </Card>
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
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#16a34a"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#16a34a"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="colorMalicious"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#dc2626"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#dc2626"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="safe"
                  stroke="#16a34a"
                  fillOpacity={1}
                  fill="url(#colorSafe)"
                />

                <Area
                  type="monotone"
                  dataKey="malicious"
                  stroke="#dc2626"
                  fillOpacity={1}
                  fill="url(#colorMalicious)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="col-span-3 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Detections</CardTitle>
            <CardDescription>
              Latest URLs processed by the AI engine.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="mr-4 overflow-hidden">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {scan.url}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {scan.date}
                    </p>
                  </div>

                  <Badge
                    variant={
                      scan.status === "Safe"
                        ? "secondary"
                        : "destructive"
                    }
                    className={
                      scan.status === "Safe"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : ""
                    }
                  >
                    {scan.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}