"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Hash } from "lucide-react";
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
  onSubmit: (name: string, character: AvatarCharacter, color: AvatarColor, pin: string) => Promise<void>;
  onCancel: () => void;
}

export function AddStudentForm({ onSubmit, onCancel }: AddStudentFormProps) {
  const [selectedChar, setSelectedChar] = useState<AvatarCharacter>("koa");
  const [selectedColor, setSelectedColor] = useState<AvatarColor>("blue");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data.displayName, selectedChar, selectedColor, data.pin);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
      <div className="flex justify-center">
        <Avatar character={selectedChar} color={selectedColor} size="xl" />
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
