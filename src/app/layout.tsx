import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Fraunces, Inter, Zen_Kaku_Gothic_New, Zen_Old_Mincho } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AIme",
  description: "AImeは、あなたの人生の選択に寄り添い、後悔のない未来へと導きます。",
};

const fontVars = {
  "--font-sans": "var(--font-inter), var(--font-zen-kaku), sans-serif",
  "--font-display": "var(--font-fraunces), var(--font-zen-mincho), serif",
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${zenKaku.variable} ${fraunces.variable} ${zenOldMincho.variable} h-full antialiased`}
      style={fontVars}
    >
      <body className="min-h-full flex flex-col bg-navy">
        <AuthProvider>
          <div className="mx-auto w-full max-w-[480px] min-h-screen flex flex-col relative z-10 bg-navy">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
