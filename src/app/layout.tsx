import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Summer Quest: Road to 2nd Grade",
  description:
    "An epic educational adventure game for rising 2nd graders. Collect 100 Knowledge Crystals and defeat The Forgetful Fog!",
  keywords: ["educational game", "summer learning", "1st grade", "2nd grade readiness"],
  authors: [{ name: "KoaKaia Designs Co" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Summer Quest",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#06080F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-game`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#1F2937",
                color: "#F9FAFB",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                iconTheme: { primary: "#10B981", secondary: "#F9FAFB" },
              },
              error: {
                iconTheme: { primary: "#EF4444", secondary: "#F9FAFB" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
