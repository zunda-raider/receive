"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { calendarEvents, type CalendarEvent } from "@/lib/mock-data";

const REFERENCE_DATE = "2026-08-02";
const MIN_MONTH_INDEX = 2026 * 12 + 1;
const MAX_MONTH_INDEX = 2027 * 12 + 1;
const CUSTOM_EVENTS_KEY = "aime:custom-date-events:v1";

type DisplayEvent = CalendarEvent & { isCustom: boolean };

export default function DateCalendar({ selectedDate }: { selectedDate?: string }) {
  const selectedYear = selectedDate ? Number(selectedDate.slice(0, 4)) : 2026;
  const selectedMonth = selectedDate ? Number(selectedDate.slice(5, 7)) - 1 : 7;
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(selectedYear, selectedMonth, 1));
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);
  const [registrationDate, setRegistrationDate] = useState<string | null>(null);
  const [registrationTime, setRegistrationTime] = useState("19:00");
  const [registrationTitle, setRegistrationTitle] = useState("");
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const monthIndex = year * 12 + month;
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const dateEvents: DisplayEvent[] = [
    ...calendarEvents.filter((event) => event.type === "date").map((event) => ({ ...event, isCustom: false })),
    ...customEvents.map((event) => ({ ...event, isCustom: true })),
  ];
  const eventMap = new Map(
    dateEvents
      .filter((event) => event.date.startsWith(monthKey))
      .map((event) => [Number(event.date.slice(-2)), event]),
  );
  const upcomingDates = dateEvents
    .filter((event) => event.date >= REFERENCE_DATE)
    .toSorted((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [...Array<null>(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = window.localStorage.getItem(CUSTOM_EVENTS_KEY);
        if (saved) setCustomEvents(JSON.parse(saved) as CalendarEvent[]);
      } catch {
        window.localStorage.removeItem(CUSTOM_EVENTS_KEY);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const moveMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const openRegistration = (date: string, event?: DisplayEvent) => {
    setRegistrationDate(date);
    setRegistrationTime(event?.time ?? "19:00");
    setRegistrationTitle(event?.title ?? "");
  };

  const closeRegistration = () => {
    setRegistrationDate(null);
    setRegistrationTitle("");
  };

  const saveRegistration = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!registrationDate || !registrationTitle.trim() || !registrationTime) return;
    const newEvent: CalendarEvent = {
      date: registrationDate,
      time: registrationTime,
      title: registrationTitle.trim(),
      type: "date",
    };
    setCustomEvents((current) => {
      const next = [...current.filter((event) => event.date !== registrationDate), newEvent];
      window.localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(next));
      return next;
    });
    closeRegistration();
  };

  return (
    <section className="rounded-[22px] border border-border-subtle bg-navy-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => moveMonth(-1)} disabled={monthIndex <= MIN_MONTH_INDEX} aria-label="前の月を表示" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-navy-light hover:text-text-primary disabled:opacity-20">
          <ChevronLeft size={17} />
        </button>
        <div className="flex items-center gap-2">
          <CalendarDays size={17} className="text-teal" />
          <h2 className="text-sm font-semibold text-text-primary">{year}年{month + 1}月</h2>
        </div>
        <button type="button" onClick={() => moveMonth(1)} disabled={monthIndex >= MAX_MONTH_INDEX} aria-label="次の月を表示" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-navy-light hover:text-text-primary disabled:opacity-20">
          <ChevronRight size={17} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {weekdays.map((weekday) => <span key={weekday} className="py-1 text-center text-[10px] text-text-secondary">{weekday}</span>)}
        {days.map((day, index) => {
          const event = day ? eventMap.get(day) : undefined;
          const date = day ? `${monthKey}-${String(day).padStart(2, "0")}` : "";
          const isSelected = date === selectedDate;
          const isToday = date === REFERENCE_DATE;
          return (
            <div key={`${day ?? "blank"}-${index}`} className="flex h-10 items-center justify-center">
              {event && !event.isCustom ? (
                <Link href={`/date?date=${event.date}`} aria-label={`${event.title}の目標設定を開く`} className={`relative flex items-center justify-center overflow-hidden rounded-full text-xs font-semibold transition-colors ${isSelected ? "h-9 w-9 bg-teal text-navy shadow-[0_0_18px_rgba(78,205,196,0.28)]" : "h-8 w-8 text-text-primary hover:bg-navy-light"}`}>
                  {day}<span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-teal" />
                </Link>
              ) : event ? (
                <button type="button" onClick={() => openRegistration(event.date, event)} aria-label={`${event.title}を編集`} className="relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-text-primary transition-colors hover:bg-navy-light">
                  {day}<span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-teal" />
                </button>
              ) : day ? (
                <button type="button" onClick={() => openRegistration(date)} aria-label={`${date}にデートを登録`} className={`flex items-center justify-center rounded-full text-xs transition-colors hover:bg-navy-light ${isToday ? "h-9 w-9 border border-coral text-coral" : "h-8 w-8 text-text-primary"}`}>{day}</button>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 border-t border-border-subtle pt-3 text-[10px] text-text-secondary">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full border border-coral" />今日</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal" />デート</span>
      </div>
      <div className="mt-3 space-y-2 border-t border-border-subtle pt-3">
        <p className="text-[10px] font-medium text-text-secondary">直近のデート予定</p>
        {upcomingDates.map((event) => event.isCustom ? (
          <button type="button" key={`${event.date}-${event.time}`} onClick={() => openRegistration(event.date, event)} className="flex w-full items-center gap-3 rounded-xl bg-navy-light px-3 py-2 text-left transition-colors hover:bg-white/10">
            <span className="h-8 w-1 rounded-full bg-teal" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-text-primary">{Number(event.date.slice(5, 7))}/{Number(event.date.slice(-2))} {event.time}</p>
              <p className="truncate text-[10px] text-text-secondary">{event.title}</p>
            </div>
            <span className="text-[9px] font-medium text-teal">編集</span>
          </button>
        ) : (
          <Link key={`${event.date}-${event.time}`} href={`/date?date=${event.date}`} className="flex items-center gap-3 rounded-xl bg-navy-light px-3 py-2 transition-colors hover:bg-white/10">
            <span className="h-8 w-1 rounded-full bg-teal" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-text-primary">{Number(event.date.slice(5, 7))}/{Number(event.date.slice(-2))} {event.time}</p>
              <p className="truncate text-[10px] text-text-secondary">{event.title}</p>
            </div>
          </Link>
        ))}
      </div>
      {registrationDate ? (
        <div role="dialog" aria-modal="true" aria-labelledby="date-registration-title" className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <button type="button" aria-label="登録画面を閉じる" onClick={closeRegistration} className="absolute inset-0 cursor-default" />
          <form onSubmit={saveRegistration} className="relative w-full max-w-[440px] rounded-[22px] border border-border-subtle bg-navy-card p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 id="date-registration-title" className="text-base font-bold text-text-primary">デートを登録</h2>
                <p className="mt-1 text-[11px] text-text-secondary">日時と予定の内容を入力してください。</p>
              </div>
              <button type="button" onClick={closeRegistration} aria-label="閉じる" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-navy-light"><X size={17} /></button>
            </div>
            <div className="mt-4 space-y-3">
              <label className="block text-[11px] text-text-secondary">日付
                <input type="date" value={registrationDate} readOnly className="mt-1.5 w-full rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs text-text-primary outline-none" />
              </label>
              <label className="block text-[11px] text-text-secondary">時間
                <input type="time" value={registrationTime} required onChange={(event) => setRegistrationTime(event.target.value)} className="mt-1.5 w-full rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs text-text-primary outline-none focus:border-teal" />
              </label>
              <label className="block text-[11px] text-text-secondary">内容
                <input type="text" value={registrationTitle} required onChange={(event) => setRegistrationTitle(event.target.value)} placeholder="例：美咲さんとディナー" className="mt-1.5 w-full rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-teal" />
              </label>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={closeRegistration} className="flex-1 rounded-xl border border-border-subtle py-2.5 text-xs font-semibold text-text-secondary">キャンセル</button>
              <button type="submit" className="flex-1 rounded-xl bg-coral py-2.5 text-xs font-semibold text-white">登録する</button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
