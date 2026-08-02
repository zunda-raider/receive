"use client";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import DateCalendar from "@/components/DateCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { activityData, todayHint } from "@/lib/mock-data";
import { Flag, Lightbulb, TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function ActivityChart() {
  const chronologicalActivity = [...activityData].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const max = Math.max(...chronologicalActivity.map((activity) => activity.points));
  const chartData = chronologicalActivity.map((activity) => {
    const [, month, day] = activity.date.split("-");

    return {
      ...activity,
      label: `${Number(month)}/${Number(day)}`,
    };
  });

  return (
    <div
      className="h-24 w-full"
      role="img"
      aria-label="7月27日から8月2日までのアクティビティポイント折れ線グラフ"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8A94A6", fontSize: 10 }}
            interval={0}
          />
          <YAxis hide domain={[0, max]} />
          <Tooltip
            cursor={{ stroke: "rgba(78,205,196,0.2)" }}
            contentStyle={{
              background: "#182238",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "#F7F8FA",
              fontSize: 12,
            }}
            formatter={(value) => [`${value} pts`, "ポイント"]}
            labelStyle={{ color: "#8A94A6" }}
          />
          <Line
            type="linear"
            dataKey="points"
            stroke="#4ECDC4"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#4ECDC4", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#FF7A59", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
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
