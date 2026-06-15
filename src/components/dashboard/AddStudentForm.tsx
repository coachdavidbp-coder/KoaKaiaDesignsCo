"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, User, Hash } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";
import { AvatarCharacter, AvatarColor } from "@/types/user";

const schema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(20, "Name too long"),
  pin: z
    .string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must be 4 numbers"),
});
type FormData = z.infer<typeof schema>;

const CHARACTERS: AvatarCharacter[] = ["koa", "mia", "turbo", "splash", "rex", "thunder", "builder"];
const COLORS: AvatarColor[] = ["blue", "purple", "green", "orange", "red", "pink", "yellow"];

const COLOR_SWATCHES: Record<AvatarColor, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  green: "bg-emerald-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-400",
};

interface AddStudentFormProps {
  onSubmit: (name: string, character: AvatarCharacter, color: AvatarColor, pin: string, avatarUrl?: string) => Promise<void>;
  onCancel: () => void;
}

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      const max = 300;
      if (width > height) {
        if (width > max) { height = Math.round((height * max) / width); width = max; }
      } else {
        if (height > max) { width = Math.round((width * max) / height); height = max; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas unavailable")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("load failed")); };
    img.src = objectUrl;
  });
}

export function AddStudentForm({ onSubmit, onCancel }: AddStudentFormProps) {
  const [selectedChar, setSelectedChar] = useState<AvatarCharacter>("koa");
  const [selectedColor, setSelectedColor] = useState<AvatarColor>("blue");
  const [isLoading, setIsLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true);
    try {
      const url = await resizeToDataUrl(file);
      setPhotoUrl(url);
    } catch {}
    finally {
      setPhotoLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data.displayName, selectedChar, selectedColor, data.pin, photoUrl);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoSelect}
      />

      {/* Avatar preview + photo upload */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {photoUrl ? (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <Avatar character={selectedChar} color={selectedColor} size="xl" />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={photoLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-sm font-semibold hover:bg-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
          {photoLoading ? "Processing…" : photoUrl ? "Change Photo" : "📷 Add Photo"}
        </button>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">CHOOSE COMPANION</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {CHARACTERS.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => setSelectedChar(char)}
              className={cn(
                "p-2 rounded-xl border-2 transition-all text-xl",
                selectedChar === char
                  ? "border-blue-500 bg-blue-500/20 scale-110"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              )}
            >
              <Avatar character={char} color={selectedColor} size="sm" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">CHOOSE COLOR</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={cn(
                "w-8 h-8 rounded-full transition-all border-2",
                COLOR_SWATCHES[color],
                selectedColor === color
                  ? "border-white scale-125 shadow-lg"
                  : "border-transparent hover:scale-110"
              )}
            />
          ))}
        </div>
      </div>

      <Input
        label="Explorer's Name"
        type="text"
        placeholder="Enter name..."
        leftIcon={<User className="w-4 h-4" />}
        error={errors.displayName?.message}
        {...register("displayName")}
      />

      <Input
        label="4-Digit PIN"
        type="text"
        placeholder="0000"
        maxLength={4}
        inputMode="numeric"
        pattern="\d*"
        leftIcon={<Hash className="w-4 h-4" />}
        hint="Your child will use this PIN to select their profile"
        error={errors.pin?.message}
        {...register("pin")}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" isLoading={isLoading}>
          Create Explorer
        </Button>
      </div>
    </form>
  );
}
