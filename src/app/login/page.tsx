"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggedIn, isOnboarded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && isOnboarded) {
      router.replace("/home");
    }
  }, [isLoggedIn, isOnboarded, router]);

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
    handleLogin(true);
  };

  if (isLoggedIn && isOnboarded) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex flex-col px-6 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-20 right-[-10%] h-64 w-64 rounded-full opacity-80"
        style={{ background: "radial-gradient(circle, #FCE9E6 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="surface-card px-6 py-8"
        >
          <p className="font-label text-gold mb-2">Welcome</p>
          <p className="font-display text-[2rem] text-text-primary mb-1">AIme</p>
          <h1 className="font-display text-heading text-text-primary mb-2">ログイン</h1>
          <p className="text-sm text-text-secondary mb-7 leading-[26px]">
            続きから、静かに始めましょう
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-label text-gold mb-2 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="任意の文字列を入力"
                className="input-invite w-full px-4 py-3 text-[15px] text-text-primary placeholder-text-secondary/70 focus:outline-none focus:border-coral/40"
              />
            </div>
            <div>
              <label className="font-label text-gold mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="任意の文字列を入力"
                className="input-invite w-full px-4 py-3 text-[15px] text-text-primary placeholder-text-secondary/70 focus:outline-none focus:border-coral/40"
              />
            </div>
            <button
              type="submit"
              className="btn-gradient w-full font-semibold text-sm py-3.5 mt-2"
            >
              ログイン
            </button>
          </form>

          <div className="mt-8 pt-6">
            <div className="rule mb-5" />
            <p className="font-label text-text-secondary mb-3">Demo</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleLogin(true)}
                className="w-full rounded-[14px] bg-blush text-text-primary text-xs font-medium py-3 hover:bg-blush/80 transition-colors"
              >
                初回ユーザーとして試す
              </button>
              <button
                onClick={() => handleLogin(false)}
                className="w-full rounded-[14px] bg-blush text-text-primary text-xs font-medium py-3 hover:bg-blush/80 transition-colors"
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
