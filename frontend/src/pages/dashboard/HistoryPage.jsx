import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, ExternalLink } from "lucide-react";

const historyData = [
  { id: "SCAN-8923", url: "https://secure-login.paypal-update.com/auth", status: "Malicious", user: "j.smith@company.com", date: "2023-10-26 14:32:01", confidence: "99%" },
  { id: "SCAN-8922", url: "https://github.com/settings/security", status: "Safe", user: "a.davis@company.com", date: "2023-10-26 14:15:22", confidence: "99.9%" },
  { id: "SCAN-8921", url: "http://win-free-iphone.net/claim?id=992", status: "Malicious", user: "system_auto", date: "2023-10-26 13:45:10", confidence: "98.5%" },
  { id: "SCAN-8920", url: "https://docs.google.com/document/d/123", status: "Safe", user: "m.wilson@company.com", date: "2023-10-26 11:20:05", confidence: "99.9%" },
  { id: "SCAN-8919", url: "https://microsoft-office-365-verify.com", status: "Malicious", user: "system_auto", date: "2023-10-26 10:05:33", confidence: "97.2%" },
  { id: "SCAN-8918", url: "https://slack.com/workspace-login", status: "Safe", user: "k.jones@company.com", date: "2023-10-26 09:15:11", confidence: "99.9%" },
  { id: "SCAN-8917", url: "http://update-flash-player.net", status: "Malicious", user: "system_auto", date: "2023-10-25 23:45:00", confidence: "96.4%" },
];

export function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = historyData.filter(item => 
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scan History</h1>
          <p className="text-slate-500">View and filter previous URL analysis results.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 bg-white">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search URLs or Scan IDs..." 
                className="pl-9 bg-slate-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[100px]">Scan ID</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-slate-600">{item.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] font-medium text-slate-900">
                            {item.url}
                          </span>
                          <a href="#" className="text-blue-500 hover:text-blue-700">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === "Safe" ? "secondary" : "destructive"} 
                          className={item.status === "Safe" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 font-mono text-sm">{item.confidence}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{item.user}</TableCell>
                      <TableCell className="text-right text-slate-500 text-sm">{item.date}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <div>Showing {filteredData.length} of {historyData.length} results</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
