import { useState } from "react";
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

export function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">
          Manage your account settings and organization preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="border border-slate-200 bg-white">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent
          value="general"
          className="space-y-6 animate-in fade-in-50 duration-300"
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and email address.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="max-w-md space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>

              <div className="max-w-md space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="admin@phishingguard.com"
                  disabled
                />
                <p className="text-xs text-slate-500">
                  To change your email, please contact support.
                </p>
              </div>
            </CardContent>

            <CardFooter className="rounded-b-xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>
                Manage your organization details.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="max-w-md space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  defaultValue="Acme Corp Security"
                />
              </div>
            </CardContent>

            <CardFooter className="rounded-b-xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent
          value="security"
          className="space-y-6 animate-in fade-in-50 duration-300"
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a long, random password to stay
                secure.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="max-w-md space-y-2">
                <Label htmlFor="current-password">
                  Current Password
                </Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="max-w-md space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="max-w-md space-y-2">
                <Label htmlFor="confirm-password">
                  Confirm New Password
                </Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between rounded-b-xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-sm text-slate-500">
                Last changed 3 months ago
              </p>

              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Updating..." : "Update password"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    Authenticator App
                  </p>

                  <p className="text-sm text-slate-500">
                    Use an app like Google Authenticator to get 2FA
                    codes.
                  </p>
                </div>

                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent
          value="notifications"
          className="space-y-6 animate-in fade-in-50 duration-300"
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive.
              </CardDescription>
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

        {/* API */}
        <TabsContent
          value="api"
          className="space-y-6 animate-in fade-in-50 duration-300"
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage your API keys for programmatic access to
                Phishing Guard.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">
                  Production API Key
                </Label>

                <div className="flex max-w-lg space-x-2">
                  <Input
                    id="api-key"
                    defaultValue="sk_prod_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    type="password"
                  />

                  <Button variant="outline">Copy</Button>

                  <Button
                    variant="secondary"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Revoke
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex items-start rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <div className="mr-3 mt-0.5">ℹ️</div>

                <p>
                  Keep your API keys secure. Never expose them in
                  client-side code, public repositories, or share them
                  via insecure channels.
                </p>
              </div>
            </CardContent>

            <CardFooter className="rounded-b-xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button variant="outline">Generate New Key</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}