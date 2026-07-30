import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, ExternalLink, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { userApi } from "../../lib/api";

const VERDICT_BADGE = {
  SAFE: { variant: "secondary", className: "bg-green-100 text-green-700 hover:bg-green-100", label: "Safe" },
  SUSPICIOUS: { variant: "secondary", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100", label: "Suspicious" },
  DANGEROUS: { variant: "destructive", className: "", label: "Dangerous" },
};

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("ALL");
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const LIMIT = 10;

  const fetchHistory = useCallback(async (p = 1) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await userApi.getHistory(p, LIMIT);
      setHistory(data.history || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load history.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const filteredData = history.filter((item) => {
    const matchesSearch =
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerdict =
      verdictFilter === "ALL" || item.verdict === verdictFilter;
    return matchesSearch && matchesVerdict;
  });

  const handlePrev = () => {
    if (page > 1) fetchHistory(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) fetchHistory(page + 1);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 text-white">Scan History</h1>
          <p className="text-slate-500">View and filter previous URL analysis results.</p>
        </div>
        <span className="text-sm text-slate-400">{total} total records</span>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search URLs or IDs..."
                className="pl-9 bg-slate-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Verdict filter pills */}
            <div className="flex gap-2">
              {["ALL", "SAFE", "SUSPICIOUS", "DANGEROUS"].map((v) => (
                <button
                  key={v}
                  onClick={() => setVerdictFilter(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    verdictFilter === v
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {v === "ALL" ? "All" : v.charAt(0) + v.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="rounded-md border border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[140px]">ID</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Verdict</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                      {history.length === 0 ? "No scans yet. Go scan a URL!" : "No results match your filter."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => {
                    const badge = VERDICT_BADGE[item.verdict] || VERDICT_BADGE.SUSPICIOUS;
                    return (
                      <TableRow key={item._id}>
                        <TableCell className="font-mono text-xs text-slate-500 truncate max-w-[140px]">
                          {item._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] font-medium text-slate-900 dark:text-white">
                              {item.url}
                            </span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={badge.variant} className={badge.className}>
                            {badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 font-mono text-sm">
                          {item.riskScore}/100
                        </TableCell>
                        <TableCell className="text-right text-slate-500 text-sm">
                          {formatDate(item.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <div>
              Page {page} of {totalPages} ({total} results)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={page <= 1 || isLoading}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={page >= totalPages || isLoading}
                className="gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
