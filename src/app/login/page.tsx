"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggedIn, isOnboarded } = useAuth();
  const router = useRouter();

  const handleLogin = (asNewUser: boolean) => {
    login(asNewUser);
    if (asNewUser) {
      router.push("/onboarding/profile");
    } else {
      router.push("/home");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    // Default: new user
    handleLogin(true);
  };

  // If already logged in, redirect
  if (isLoggedIn && isOnboarded) {
    router.push("/home");
    return null;
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Same aurora background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-[#0D1A30] to-[#0B1220]" />
        <div
          className="aurora-blob absolute w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #FF7A59 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "5%",
            right: "-20%",
          }}
        />
        <div
          className="aurora-blob-2 absolute w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #4ECDC4 0%, transparent 70%)",
            filter: "blur(80px)",
            bottom: "10%",
            left: "-10%",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-navy-card rounded-[20px] p-6 border border-border-subtle"
        >
          <div className="text-center mb-6">
            <span className="text-xs font-semibold tracking-widest text-coral uppercase">
              MatchCoach
            </span>
            <h1 className="text-xl font-bold text-text-primary mt-2">
              ログイン
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                ユーザー名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="任意の文字列を入力"
                className="w-full bg-navy-light border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-coral/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="任意の文字列を入力"
                className="w-full bg-navy-light border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-coral/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-coral hover:bg-coral-hover text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              ログイン
            </button>
          </form>

          {/* Demo toggle */}
          <div className="mt-6 pt-4 border-t border-border-subtle">
            <p className="text-xs text-text-secondary text-center mb-3">
              デモ用クイックログイン
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleLogin(true)}
                className="flex-1 bg-navy-light hover:bg-navy-light/80 text-text-primary text-xs font-medium py-2.5 rounded-xl border border-border-subtle transition-colors"
              >
                初回ユーザーとして試す
              </button>
              <button
                onClick={() => handleLogin(false)}
                className="flex-1 bg-navy-light hover:bg-navy-light/80 text-text-primary text-xs font-medium py-2.5 rounded-xl border border-border-subtle transition-colors"
              >
                既存ユーザーとして試す
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
