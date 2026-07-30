import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle2 } from "lucide-react";

export function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center py-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Password Reset Successfully
        </h2>

        <p className="text-sm text-slate-500">
          Redirecting you to login...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Set new password
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          Your new password must be different from previous used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">
            Confirm New Password
          </Label>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              required
            />
          </div>
        </div>

        <Button
          className="w-full mt-6"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Resetting password..." : "Reset password"}
        </Button>
      </form>
    </div>
  );
}