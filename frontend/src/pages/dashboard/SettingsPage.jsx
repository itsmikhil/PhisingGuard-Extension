import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle } from "lucide-react";
import { userApi } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null); // { type: 'success'|'error', text }

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Sync name if user context changes
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setIsSavingProfile(true);
    setProfileMsg(null);
    try {
      const data = await userApi.updateProfile(name.trim());
      updateUser(data.data?.user || { ...user, name: name.trim() });
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMsg({ type: "error", text: "All password fields are required." });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setIsSavingPassword(true);
    setPasswordMsg(null);
    // Simulate — backend doesn't have a change-password endpoint yet
    setTimeout(() => {
      setIsSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordMsg({ type: "success", text: "Password updated. (Feature coming soon — endpoint pending)" });
    }, 600);
  };

  const Feedback = ({ msg }) =>
    msg ? (
      <div
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm border ${
          msg.type === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}
      >
        {msg.type === "success" ? (
          <CheckCircle className="h-4 w-4 shrink-0" />
        ) : (
          <AlertCircle className="h-4 w-4 shrink-0" />
        )}
        {msg.text}
      </div>
    ) : null;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 text-white">Settings</h1>
        <p className="text-slate-500">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="border border-slate-200 bg-white">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6 animate-in fade-in-50 duration-300">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your display name.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="max-w-md space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="max-w-md space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user?.email || ""} disabled />
                <p className="text-xs text-slate-500">
                  To change your email, please contact support.
                </p>
              </div>

              <Feedback msg={profileMsg} />
            </CardContent>

            <CardFooter className="rounded-b-xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button onClick={handleSaveProfile} disabled={isSavingProfile || !name.trim()}>
                {isSavingProfile ? "Saving..." : "Save changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6 animate-in fade-in-50 duration-300">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a long, random password to stay secure.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="max-w-md space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="max-w-md space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="max-w-md space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>

              <Feedback msg={passwordMsg} />
            </CardContent>

            <CardFooter className="flex items-center justify-between rounded-b-xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-sm text-slate-500">Use at least 6 characters</p>
              <Button onClick={handleSavePassword} disabled={isSavingPassword}>
                {isSavingPassword ? "Updating..." : "Update password"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 text-white">Authenticator App</p>
                  <p className="text-sm text-slate-500">
                    Use an app like Google Authenticator to get 2FA codes.
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6 animate-in fade-in-50 duration-300">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Threat Alerts</Label>
                  <p className="text-sm text-slate-500">
                    Receive an email when a malicious URL is detected.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Summary</Label>
                  <p className="text-sm text-slate-500">
                    Receive a weekly digest of scanning activity.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">System Updates</Label>
                  <p className="text-sm text-slate-500">
                    Get notified about new features and updates.
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}