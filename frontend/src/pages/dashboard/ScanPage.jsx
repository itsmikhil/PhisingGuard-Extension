import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Link as LinkIcon,
  Info,
  AlertCircle,
} from "lucide-react";
import { scanApi } from "../../lib/api";

const VERDICT_CONFIG = {
  SAFE: {
    label: "No Threats Detected",
    icon: ShieldCheck,
    iconBg: "bg-green-100 text-green-600",
    cardBorder: "border-green-200 bg-green-50/30",
    titleColor: "text-green-800",
    badgeClass: "bg-green-100 text-green-700",
    badgeVariant: "secondary",
  },
  SUSPICIOUS: {
    label: "Suspicious URL Detected",
    icon: ShieldQuestion,
    iconBg: "bg-yellow-100 text-yellow-600",
    cardBorder: "border-yellow-200 bg-yellow-50/30",
    titleColor: "text-yellow-800",
    badgeClass: "bg-yellow-100 text-yellow-700",
    badgeVariant: "secondary",
  },
  DANGEROUS: {
    label: "Malicious Phishing Detected",
    icon: ShieldAlert,
    iconBg: "bg-red-100 text-red-600",
    cardBorder: "border-red-200 bg-red-50/30",
    titleColor: "text-red-800",
    badgeClass: "",
    badgeVariant: "destructive",
  },
};

export function ScanPage() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setResult(null);
    setError("");
    setProgress(0);

    // Animate progress while waiting for API
    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress = Math.min(fakeProgress + Math.random() * 12, 90);
      setProgress(Math.round(fakeProgress));
    }, 200);

    try {
      const data = await scanApi.scan(url);
      clearInterval(interval);
      setProgress(100);
      setResult(data.data);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setError(err.message || "Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const config = result ? VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.SUSPICIOUS : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 text-white">Scan URL</h1>
        <p className="text-slate-500">
          Instantly analyze any link for phishing threats, malware, and deceptive routing.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Threat Analyzer</CardTitle>
          <CardDescription>Enter a full URL including http:// or https://</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleScan} className="flex space-x-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/login"
                className="pl-10 h-12 text-base"
                required
              />
            </div>

            <Button type="submit" disabled={isScanning || !url} className="h-12 px-8">
              {isScanning ? "Scanning..." : "Scan Now"}
              {!isScanning && <Search className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          {isScanning && (
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>Analyzing threat intelligence...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && config && (
        <Card
          className={`shadow-sm border-2 animate-in slide-in-from-bottom-4 fade-in duration-300 ${config.cardBorder}`}
        >
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${config.iconBg}`}>
                <config.icon className="w-8 h-8" />
              </div>

              <div>
                <CardTitle className={`text-xl ${config.titleColor}`}>
                  {config.label}
                </CardTitle>
                <CardDescription className="mt-1">
                  Analysis completed for:{" "}
                  <span className="font-medium text-slate-900 dark:text-white break-all">{result.url}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Score + Reasons */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Risk Score</span>
                  <Badge
                    variant={config.badgeVariant}
                    className={config.badgeClass}
                  >
                    {result.riskScore}/100
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Verdict</span>
                  <Badge
                    variant={config.badgeVariant}
                    className={config.badgeClass}
                  >
                    {result.verdict}
                  </Badge>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-slate-800">
                      {result.explanation?.title || "Scan complete"}
                    </span>
                    <p className="text-sm text-slate-600">
                      {result.explanation?.summary || "No further details available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}