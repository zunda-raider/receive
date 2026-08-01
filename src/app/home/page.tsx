"use client";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { calendarEvents, activityData, todayHint } from "@/lib/mock-data";
import { Calendar, Lightbulb, TrendingUp } from "lucide-react";

function MiniCalendar() {
  const now = new Date(2026, 7, 1); // 2026年8月
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 1;

  const eventDates = calendarEvents.map((e) => {
    const d = new Date(e.date);
    return d.getDate();
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekdays.map((w) => (
          <div key={w} className="text-center text-[10px] text-text-secondary py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => (
          <div key={i} className="relative flex items-center justify-center h-8">
            {day && (
              <>
                <span
                  className={`text-xs ${
                    day === today
                      ? "bg-coral text-white w-6 h-6 rounded-full flex items-center justify-center font-bold"
                      : "text-text-primary"
                  }`}
                >
                  {day}
                </span>
                {eventDates.includes(day) && day !== today && (
                  <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-teal" />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const upcomingEvents = calendarEvents.slice(0, 2);
  const summaryCards = [
    { label: "今月のマッチ", value: "12", color: "text-coral" },
    { label: "やり取り中", value: "4", color: "text-teal" },
    { label: "返信待ち", value: "2", color: "text-text-secondary" },
  ];

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
            2026年8月1日（金）
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="bg-navy-card rounded-[16px] p-3 border border-border-subtle text-center"
            >
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-teal" />
            <h2 className="text-sm font-semibold text-text-primary">8月のカレンダー</h2>
          </div>
          <MiniCalendar />
          <div className="mt-3 space-y-2">
            {upcomingEvents.map((evt, i) => {
              const d = new Date(evt.date);
              const weekday = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-navy-light rounded-xl px-3 py-2"
                >
                  <div className="w-1 h-8 rounded-full bg-teal" />
                  <div>
                    <p className="text-xs text-text-primary font-medium">
                      {d.getMonth() + 1}/{d.getDate()}({weekday}) {evt.time}
                    </p>
                    <p className="text-[11px] text-text-secondary">{evt.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-teal" />
            <h2 className="text-sm font-semibold text-text-primary">アクティビティ推移</h2>
          </div>
          <ActivityChart />
        </div>

        {/* Hint */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-coral/10 flex items-center justify-center shrink-0">
              <Lightbulb size={16} className="text-coral" />
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{todayHint}</p>
          </div>
        </div>
      </motion.div>
      <BottomTabBar />
    </AuthGuard>
  );
}
