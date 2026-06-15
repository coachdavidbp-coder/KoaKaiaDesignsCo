import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — Summer Quest",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
