"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Settings, Home, Users, BarChart2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/parent", label: "Home", icon: Home },
  { href: "/parent/students", label: "Students", icon: Users },
  { href: "/parent/progress", label: "Progress", icon: BarChart2 },
  { href: "/parent/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { profile, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-game-surface/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/parent" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:animate-bounce">🌟</span>
          <div>
            <p className="text-sm font-bold text-white leading-none">Summer Quest</p>
            <p className="text-xs text-gray-500 leading-none">Road to 2nd Grade</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/parent" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "text-white bg-blue-500/20 border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {active && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-xl bg-blue-500/10"
                    style={{ zIndex: -1 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {profile && (
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white leading-none">{profile.displayName}</p>
              <p className="text-xs text-gray-500 leading-none mt-0.5">Parent</p>
            </div>
          )}
          <button
            onClick={logout}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-game-surface/95 backdrop-blur-xl border-t border-white/10 flex z-40">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/parent" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-all",
                active ? "text-blue-400" : "text-gray-500"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
