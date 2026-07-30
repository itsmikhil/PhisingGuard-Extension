import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Users,
  ScanSearch,
  ShieldOff,
  AlertTriangle,
  Trash2,
  PlusCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { adminApi } from "../../lib/api";

/* ─── Stat card ─── */
function StatCard({ title, value, icon: Icon, iconColor, note }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value ?? "—"}</div>
        {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
      </CardContent>
    </Card>
  );
}

/* ─── Feedback banner ─── */
function Feedback({ msg }) {
  if (!msg) return null;
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm border mb-4 ${
        msg.type === "success"
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      {msg.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      {msg.text}
    </div>
  );
}

/* ─── Skeleton row ─── */
function SkeletonRow({ cols = 4 }) {
  return (
    <TableRow>
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );
}

/* ══════════════════════════════════════════════ */
export function AdminPage() {
  /* ── Overview stats ── */
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  /* ── Blacklist ── */
  const [blacklist, setBlacklist] = useState([]);
  const [blLoading, setBlLoading] = useState(true);
  const [blMsg, setBlMsg] = useState(null);
  const [newDomain, setNewDomain] = useState("");
  const [newReason, setNewReason] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  /* ── Reports ── */
  const [reports, setReports] = useState([]);
  const [rptLoading, setRptLoading] = useState(true);
  const [rptMsg, setRptMsg] = useState(null);
  const [rptFilter, setRptFilter] = useState("PENDING");

  /* ─── Fetch stats ─── */
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await adminApi.getDashboard();
      setStats(data.data);
    } catch {
      /* silently fail */
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /* ─── Fetch blacklist ─── */
  const fetchBlacklist = useCallback(async () => {
    setBlLoading(true);
    try {
      const data = await adminApi.getBlacklist();
      setBlacklist(data.data || []);
    } catch (err) {
      setBlMsg({ type: "error", text: err.message });
    } finally {
      setBlLoading(false);
    }
  }, []);

  /* ─── Fetch reports ─── */
  const fetchReports = useCallback(async (status = "PENDING") => {
    setRptLoading(true);
    try {
      const data = await adminApi.getReports(status === "ALL" ? undefined : status);
      setReports(data.data || []);
    } catch (err) {
      setRptMsg({ type: "error", text: err.message });
    } finally {
      setRptLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchBlacklist();
    fetchReports("PENDING");
  }, [fetchStats, fetchBlacklist, fetchReports]);

  /* ─── Blacklist: add ─── */
  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    setIsAdding(true);
    setBlMsg(null);
    try {
      await adminApi.createBlacklistEntry(newDomain.trim(), newReason.trim() || "Manual entry");
      setNewDomain("");
      setNewReason("");
      setBlMsg({ type: "success", text: `"${newDomain.trim()}" added to blacklist.` });
      fetchBlacklist();
    } catch (err) {
      setBlMsg({ type: "error", text: err.message });
    } finally {
      setIsAdding(false);
    }
  };

  /* ─── Blacklist: delete ─── */
  const handleDeleteDomain = async (id, domain) => {
    if (!window.confirm(`Remove "${domain}" from blacklist?`)) return;
    setBlMsg(null);
    try {
      await adminApi.deleteBlacklistEntry(id);
      setBlacklist((prev) => prev.filter((e) => e._id !== id));
      setBlMsg({ type: "success", text: `"${domain}" removed.` });
    } catch (err) {
      setBlMsg({ type: "error", text: err.message });
    }
  };

  /* ─── Blacklist: toggle active ─── */
  const handleToggleActive = async (entry) => {
    try {
      const updated = await adminApi.updateBlacklistEntry(entry._id, { active: !entry.active });
      setBlacklist((prev) => prev.map((e) => (e._id === entry._id ? updated.data : e)));
    } catch (err) {
      setBlMsg({ type: "error", text: err.message });
    }
  };

  /* ─── Reports: update status ─── */
  const handleUpdateReport = async (id, status) => {
    setRptMsg(null);
    try {
      await adminApi.updateReport(id, status);
      setRptMsg({ type: "success", text: `Report marked as ${status}.` });
      fetchReports(rptFilter);
    } catch (err) {
      setRptMsg({ type: "error", text: err.message });
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500">System overview, blacklist management, and user reports.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchStats(); fetchBlacklist(); fetchReports(rptFilter); }} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-slate-200 shadow-sm animate-pulse">
              <CardHeader className="pb-2"><div className="h-4 bg-slate-200 rounded w-24" /></CardHeader>
              <CardContent><div className="h-8 bg-slate-200 rounded w-16" /></CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard title="Total Users" value={stats?.totalUsers} icon={Users} iconColor="text-blue-600" note="Registered accounts" />
            <StatCard title="Total Scans" value={stats?.totalScans} icon={ScanSearch} iconColor="text-indigo-600" note="All-time scans" />
            <StatCard title="Blocked Domains" value={stats?.totalBlacklistDomains} icon={ShieldOff} iconColor="text-red-600" note="Active blacklist entries" />
            <StatCard title="Dangerous Scans" value={stats?.totalDangerousScans} icon={AlertTriangle} iconColor="text-orange-600" note={`${stats?.totalSuspiciousScans} suspicious`} />
          </>
        )}
      </div>

      {/* ── Tabs: Blacklist / Reports ── */}
      <Tabs defaultValue="blacklist" className="space-y-4">
        <TabsList className="border border-slate-200 bg-white">
          <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
          <TabsTrigger value="reports">User Reports</TabsTrigger>
        </TabsList>

        {/* ── Blacklist ── */}
        <TabsContent value="blacklist" className="animate-in fade-in-50 duration-300">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Domain Blacklist</CardTitle>
              <CardDescription>Manage domains flagged as phishing or malicious.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Add form */}
              <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="new-domain">Domain</Label>
                  <Input
                    id="new-domain"
                    placeholder="evil-phish.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="new-reason">Reason</Label>
                  <Input
                    id="new-reason"
                    placeholder="Phishing landing page"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={isAdding} className="gap-2 h-10">
                    <PlusCircle className="h-4 w-4" />
                    {isAdding ? "Adding..." : "Add"}
                  </Button>
                </div>
              </form>

              <Feedback msg={blMsg} />

              <div className="rounded-md border border-slate-200">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blLoading ? (
                      Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                    ) : blacklist.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-20 text-center text-slate-400">
                          No blacklist entries yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      blacklist.map((entry) => (
                        <TableRow key={entry._id}>
                          <TableCell className="font-mono text-sm font-medium text-slate-900 dark:text-white">{entry.domain}</TableCell>
                          <TableCell className="text-sm text-slate-600 max-w-[200px] truncate">{entry.reason}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">{entry.source}</Badge>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleToggleActive(entry)}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${
                                entry.active
                                  ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              {entry.active ? "Active" : "Inactive"}
                            </button>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">{formatDate(entry.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => handleDeleteDomain(entry._id, entry.domain)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Reports ── */}
        <TabsContent value="reports" className="animate-in fade-in-50 duration-300">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>Review URLs reported as phishing by users.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Filter pills */}
              <div className="flex gap-2">
                {["PENDING", "APPROVED", "REJECTED", "ALL"].map((f) => (
                  <button
                    key={f}
                    onClick={() => { setRptFilter(f); fetchReports(f); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      rptFilter === f
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {f.charAt(0) + f.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <Feedback msg={rptMsg} />

              <div className="rounded-md border border-slate-200">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rptLoading ? (
                      Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                    ) : reports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-20 text-center text-slate-400">
                          No {rptFilter === "ALL" ? "" : rptFilter.toLowerCase()} reports.
                        </TableCell>
                      </TableRow>
                    ) : (
                      reports.map((rpt) => (
                        <TableRow key={rpt._id}>
                          <TableCell className="max-w-[200px] truncate text-sm font-medium text-slate-900 dark:text-white">{rpt.url}</TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {rpt.user?.email || rpt.user?.name || "Anonymous"}
                          </TableCell>
                          <TableCell className="text-sm text-slate-500 max-w-[160px] truncate">{rpt.reason}</TableCell>
                          <TableCell>
                            <Badge
                              variant={rpt.status === "APPROVED" ? "secondary" : rpt.status === "REJECTED" ? "destructive" : "outline"}
                              className={
                                rpt.status === "APPROVED"
                                  ? "bg-green-100 text-green-700"
                                  : rpt.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : ""
                              }
                            >
                              {rpt.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">{formatDate(rpt.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            {rpt.status === "PENDING" && (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleUpdateReport(rpt._id, "APPROVED")}
                                  title="Approve"
                                  className="text-green-500 hover:text-green-700 transition-colors"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateReport(rpt._id, "REJECTED")}
                                  title="Reject"
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
