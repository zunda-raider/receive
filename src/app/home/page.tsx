"use client";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import DateCalendar from "@/components/DateCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { activityData, todayHint } from "@/lib/mock-data";
import { Flag, Lightbulb, TrendingUp } from "lucide-react";

function ActivityChart() {
  const max = Math.max(...activityData.map((d) => d.count));
  return (
    <div className="flex items-end gap-2 h-20">
      {activityData.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-teal/70"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: 4 }}
          />
          <span className="text-[10px] text-text-secondary">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();

  const getGreeting = () => {
    const h = 18; // 18:00
    if (h < 12) return "おはようございます";
    if (h < 18) return "こんにちは";
    return "こんばんは";
  };

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-5 pb-24 pt-6"
      >
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-lg font-bold text-text-primary">
            {getGreeting()}、{user.nickname}さん
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            2026年8月2日（日）
          </p>
        </div>

        {/* Goal */}
        <div className="mb-5 rounded-[20px] border border-coral/20 bg-gradient-to-br from-coral/10 to-navy-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-coral/15">
              <Flag size={16} className="text-coral" />
            </div>
            <p className="text-xs font-medium text-coral">あなたの目標</p>
          </div>
          <p className="text-sm font-medium leading-relaxed text-text-primary">
            {user.goal || "目標を設定して、理想の出会いに近づきましょう"}
          </p>
        </div>

        {/* Hint */}
        <div className="mb-5 rounded-[20px] border border-border-subtle bg-navy-card p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-coral/10">
              <Lightbulb size={16} className="text-coral" />
            </div>
            <p className="text-xs leading-relaxed text-text-secondary">{todayHint}</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-4"><DateCalendar /></div>

        {/* Activity */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-teal" />
            <h2 className="text-sm font-semibold text-text-primary">アクティビティ推移</h2>
          </div>
          <ActivityChart />
        </div>

      </motion.div>
      <BottomTabBar />
    </AuthGuard>
  );
}
