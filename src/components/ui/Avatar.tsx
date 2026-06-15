import { cn } from "@/lib/utils/cn";
import { AvatarCharacter, AvatarColor } from "@/types/user";

interface AvatarProps {
  character: AvatarCharacter;
  color: AvatarColor;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showName?: boolean;
  name?: string;
}

const CHARACTER_EMOJI: Record<AvatarCharacter, string> = {
  koa: "🧒",
  mia: "🐕",
  turbo: "🚛",
  splash: "🐬",
  rex: "🦕",
  thunder: "🏈",
  builder: "🤖",
};

const CHARACTER_LABEL: Record<AvatarCharacter, string> = {
  koa: "Koa",
  mia: "Mia",
  turbo: "Turbo",
  splash: "Splash",
  rex: "Rex",
  thunder: "Coach Thunder",
  builder: "Builder Bot",
};

const COLOR_STYLES: Record<AvatarColor, string> = {
  blue: "from-blue-600 to-blue-400 ring-blue-500/50",
  purple: "from-purple-600 to-purple-400 ring-purple-500/50",
  green: "from-emerald-600 to-emerald-400 ring-emerald-500/50",
  orange: "from-orange-600 to-orange-400 ring-orange-500/50",
  red: "from-red-600 to-red-400 ring-red-500/50",
  pink: "from-pink-600 to-pink-400 ring-pink-500/50",
  yellow: "from-yellow-500 to-yellow-300 ring-yellow-500/50",
};

const SIZE_STYLES = {
  sm: "w-8 h-8 text-lg ring-2",
  md: "w-12 h-12 text-2xl ring-2",
  lg: "w-16 h-16 text-3xl ring-2",
  xl: "w-24 h-24 text-5xl ring-4",
};

export function Avatar({ character, color, avatarUrl, size = "md", className, showName, name }: AvatarProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 overflow-hidden",
          COLOR_STYLES[color],
          SIZE_STYLES[size]
        )}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name ?? CHARACTER_LABEL[character]} className="w-full h-full object-cover rounded-full" />
        ) : (
          <span role="img" aria-label={CHARACTER_LABEL[character]}>
            {CHARACTER_EMOJI[character]}
          </span>
        )}
      </div>
      {showName && (
        <span className="text-xs font-medium text-gray-300 truncate max-w-[80px]">
          {name ?? CHARACTER_LABEL[character]}
        </span>
      )}
    </div>
  );
}
