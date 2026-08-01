import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MatchCoach - マッチングを、もっと賢く",
  description: "マッチングアプリ利用者を支援する分析・コーチングツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-navy">
        <AuthProvider>
          <div className="mx-auto w-full max-w-[480px] min-h-screen flex flex-col relative">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
