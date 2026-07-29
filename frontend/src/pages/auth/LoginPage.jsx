import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
        <p className="text-sm text-slate-400 mt-2">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              id="email"
              type="email"
              placeholder="admin@phishingguard.com"
              className="pl-10 h-11 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          className="w-full h-11 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
          Create one
        </Link>
      </div>
    </div>
  );
}
