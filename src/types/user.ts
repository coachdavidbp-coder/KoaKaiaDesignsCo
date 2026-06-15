export type UserRole = "parent" | "student";

export interface ParentUser {
  uid: string;
  email: string;
  displayName: string;
  role: "parent";
  createdAt: string;
  updatedAt: string;
  settings: ParentSettings;
}

export interface ParentSettings {
  emailNotifications: boolean;
  weeklyReports: boolean;
  dailyReminders: boolean;
  reminderTime: string;
}

export type AvatarCharacter = "koa" | "mia" | "turbo" | "splash" | "rex" | "thunder" | "builder";
export type AvatarColor = "blue" | "purple" | "green" | "orange" | "red" | "pink" | "yellow";

export interface StudentProfile {
  id: string;
  parentUid: string;
  displayName: string;
  gradeLevel: number;
  avatar: {
    character: AvatarCharacter;
    color: AvatarColor;
  };
  pin: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
}

export interface AppUser {
  uid: string;
  email: string | null;
  role: UserRole;
  profile: ParentUser | null;
}
