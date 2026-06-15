"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Mail, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { profile, logout, sendPasswordReset } = useAuth();
  const [resetSent, setResetSent] = useState(false);

  const handlePasswordReset = async () => {
    if (!profile?.email) return;
    const ok = await sendPasswordReset(profile.email);
    if (ok) setResetSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-gray-400">Manage your account and preferences</p>
      </motion.div>

      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold text-white">Account</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Name</p>
              <p className="text-sm font-medium text-white">{profile?.displayName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Email</p>
              <p className="text-sm font-medium text-white">{profile?.email}</p>
            </div>
            <div className="pt-2 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePasswordReset}
                disabled={resetSent}
              >
                {resetSent ? "✓ Reset email sent!" : "Change Password"}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-400">
            <p>Notification preferences will be available in a future update.</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-purple-400" />
            <h2 className="font-semibold text-white">Reports</h2>
          </div>
          <p className="text-sm text-gray-400">Weekly progress reports and Second Grade Readiness Report will be available as your explorer progresses.</p>
        </Card>

        <Card className="p-5">
          <Button
            variant="danger"
            className="w-full"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={logout}
          >
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );
}
