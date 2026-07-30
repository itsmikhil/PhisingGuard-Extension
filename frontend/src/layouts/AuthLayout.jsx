import { Outlet } from "react-router-dom";
import { Shield } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-4 ring-1 ring-white/10">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Phishing Guard</h1>
          <p className="text-slate-400 mt-1 text-sm">Enterprise Phishing Protection</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 p-8 border border-white/10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
