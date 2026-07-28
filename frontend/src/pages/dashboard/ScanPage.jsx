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
  Link as LinkIcon,
  Info,
} from "lucide-react";

export function ScanPage() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleScan = (e) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);

          // Mock result logic based on URL text
          setResult(
            url.includes("paypal") || url.includes("free")
              ? "malicious"
              : "safe"
          );

          return 100;
        }

        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Scan URL</h1>
        <p className="text-slate-500">
          Instantly analyze any link for phishing threats, malware, and
          deceptive routing.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Threat Analyzer</CardTitle>
          <CardDescription>
            Enter a full URL including http:// or https://
          </CardDescription>
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

            <Button
              type="submit"
              disabled={isScanning || !url}
              className="h-12 px-8"
            >
              {isScanning ? "Scanning..." : "Scan Now"}
              {!isScanning && <Search className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          {isScanning && (
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>Analyzing AI threat models...</span>
                <span>{progress}%</span>
              </div>

              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card
          className={`shadow-sm border-2 animate-in slide-in-from-bottom-4 fade-in duration-300 ${
            result === "safe"
              ? "border-green-200 bg-green-50/30"
              : "border-red-200 bg-red-50/30"
          }`}
        >
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div
                className={`p-3 rounded-full ${
                  result === "safe"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {result === "safe" ? (
                  <ShieldCheck className="w-8 h-8" />
                ) : (
                  <ShieldAlert className="w-8 h-8" />
                )}
              </div>

              <div>
                <CardTitle
                  className={`text-xl ${
                    result === "safe"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {result === "safe"
                    ? "No Threats Detected"
                    : "Malicious Phishing Detected"}
                </CardTitle>

                <CardDescription className="mt-1">
                  Analysis completed for:{" "}
                  <span className="font-medium text-slate-900 break-all">
                    {url}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500">
                    Domain Age
                  </span>

                  {result === "safe" ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      Established
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Suspicious (2 days)
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500">
                    SSL Certificate
                  </span>

                  {result === "safe" ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      Valid (Let's Encrypt)
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-700"
                    >
                      Missing/Invalid
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    AI Confidence
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    99.8%
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />

                  <p className="text-sm text-slate-600">
                    {result === "safe"
                      ? "This URL matches known safe patterns and contains no obfuscated scripts or deceptive forms. Proceed with confidence."
                      : "Warning: This URL contains exact visual matches to known credential-harvesting templates. Do not enter any personal information."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}