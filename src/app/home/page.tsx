"use client";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import DateCalendar from "@/components/DateCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { activityData, todayHint } from "@/lib/mock-data";
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
            tick={{ fill: "#7A5C66", fontSize: 10 }}
            interval={0}
          />
          <YAxis hide domain={[0, max]} />
          <Tooltip
            cursor={{ stroke: "rgba(184,20,63,0.15)" }}
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid rgba(232,213,172,0.8)",
              borderRadius: 14,
              color: "#2B1620",
              fontSize: 12,
              boxShadow: "0 6px 24px rgba(184,20,63,0.10)",
            }}
            formatter={(value) => [`${value} pts`, "ポイント"]}
            labelStyle={{ color: "#7A5C66" }}
          />
          <Line
            type="monotone"
            dataKey="points"
            stroke="#B8143F"
            strokeWidth={2.25}
            dot={{ r: 3, fill: "#B8143F", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#FF6F5E", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();

  const getGreeting = () => {
    const h = 18;
    if (h < 12) return "おはようございます";
    if (h < 18) return "こんにちは";
    return "こんばんは";
  };

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-5 pb-24 pt-8"
      >
        <header className="mb-7">
          <p className="font-label text-gold mb-2">AIme</p>
          <h1 className="font-display text-heading text-text-primary">
            {getGreeting()}、
            <br />
            {user.nickname}さん
          </h1>
          <p className="text-xs text-text-secondary mt-2">2026年8月2日（日）</p>
        </header>

        <section className="surface-card px-5 py-5 mb-4">
          <p className="font-label text-gold mb-2">Today&apos;s Goal</p>
          <p className="font-display text-[17px] leading-relaxed text-text-primary">
            {user.goal || "目標を設定して、理想の出会いに近づきましょう"}
          </p>
        </section>

        <section className="surface-panel px-5 py-4 mb-4 bg-blush/60">
          <p className="font-label text-gold mb-2">Note</p>
          <p className="text-[15px] leading-[26px] text-text-primary">{todayHint}</p>
        </section>

        <div className="mb-4">
          <DateCalendar />
        </div>

        <section className="surface-card px-5 py-5 mb-4">
          <p className="font-label text-gold mb-3">Activity</p>
          <ActivityChart />
        </section>
      </motion.div>
      <BottomTabBar />
    </AuthGuard>
  );
}
