"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, User, Trophy, BookOpen, PenLine, Pencil, Calculator } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface GameNavProps {
  profileId: string;
  achievementCount?: number;
}

export function GameNav({ profileId, achievementCount = 0 }: GameNavProps) {
  const pathname = usePathname();

  const items = [
    { href: `/student/${profileId}`, label: "Map", icon: Map },
    { href: `/student/${profileId}/reading`,  label: "Read",    icon: BookOpen },
    { href: `/student/${profileId}/spelling`, label: "Spell",   icon: PenLine },
    { href: `/student/${profileId}/writing`,  label: "Write",   icon: Pencil },
    { href: `/student/${profileId}/math`,     label: "Math",    icon: Calculator },
    { href: `/student/${profileId}/character`, label: "Me",     icon: User },
    { href: `/student/${profileId}/achievements`, label: "Badges", icon: Trophy },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 safe-bottom">
      <div className="max-w-5xl mx-auto flex">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === `/student/${profileId}`
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition-all relative",
                active ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
              )}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full bg-blue-400"
                />
              )}
              <div className="relative">
                <Icon className="w-5 h-5" />
                {label === "Badges" && achievementCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                    {achievementCount}
                  </span>
                )}
              </div>
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
