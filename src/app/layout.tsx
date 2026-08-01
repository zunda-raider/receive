import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIme",
  description: "AImeは、あなたの人生の選択に寄り添い、後悔のない未来へと導きます。",
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
