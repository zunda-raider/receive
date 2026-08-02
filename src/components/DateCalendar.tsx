"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from "lucide-react";
import { calendarEvents, datePlans } from "@/lib/mock-data";
import {
  CUSTOM_EVENTS_KEY,
  DATE_DATA_CHANGED_EVENT,
  REFERENCE_DATE,
  getDateHref,
  getEventId,
  isReviewSaved,
  readCustomEvents,
  type StoredDateEvent,
} from "@/lib/date-storage";

const MIN_MONTH_INDEX = 2026 * 12 + 1;
const MAX_MONTH_INDEX = 2027 * 12 + 1;
type DisplayEvent = StoredDateEvent & { isCustom: boolean; dateId: string; reviewed: boolean };

export default function DateCalendar({ selectedDate }: { selectedDate?: string }) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2026, 7, 1));
  const [customEvents, setCustomEvents] = useState<StoredDateEvent[]>([]);
  const [reviewRevision, setReviewRevision] = useState(0);
  const [registrationDate, setRegistrationDate] = useState<string | null>(null);
  const [registrationTime, setRegistrationTime] = useState("19:00");
  const [registrationTitle, setRegistrationTitle] = useState("");
  const [showAll, setShowAll] = useState(false);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const monthIndex = year * 12 + month;

  useEffect(() => {
    const refresh = () => {
      setCustomEvents(readCustomEvents());
      setReviewRevision((value) => value + 1);
    };
    queueMicrotask(refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(DATE_DATA_CHANGED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(DATE_DATA_CHANGED_EVENT, refresh);
    };
  }, []);

  const dateEvents = useMemo<DisplayEvent[]>(() => {
    void reviewRevision;
    return [
      ...calendarEvents.filter((event) => event.type === "date").map((event) => ({ ...event, isCustom: false })),
      ...customEvents.map((event) => ({ ...event, isCustom: true })),
    ].map((event) => {
      const dateId = getEventId(event, datePlans);
      return { ...event, dateId, reviewed: event.date < REFERENCE_DATE && isReviewSaved(dateId) };
    });
  }, [customEvents, reviewRevision]);

  const eventMap = new Map(dateEvents.map((event) => [event.date, event]));
  const listedDates = dateEvents
    .filter((event) => (event.date < REFERENCE_DATE && !event.reviewed) || event.date > REFERENCE_DATE)
    .toSorted((a, b) => {
      const aPast = a.date < REFERENCE_DATE;
      const bPast = b.date < REFERENCE_DATE;
      if (aPast !== bPast) return aPast ? -1 : 1;
      return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
    });
  const visibleDates = showAll ? listedDates : listedDates.slice(0, 2);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const offset = index - firstDay + 1;
    const cellDate = new Date(year, month, offset);
    const cellYear = cellDate.getFullYear();
    const cellMonth = cellDate.getMonth();
    const day = cellDate.getDate();
    return {
      day,
      date: `${cellYear}-${String(cellMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      inCurrentMonth: offset >= 1 && offset <= daysInMonth,
    };
  });

  const openRegistration = (date: string) => {
    setRegistrationDate(date);
    setRegistrationTime("19:00");
    setRegistrationTitle("");
  };
  const closeRegistration = () => { setRegistrationDate(null); setRegistrationTitle(""); };
  const saveRegistration = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!registrationDate || !registrationTitle.trim()) return;
    const newEvent: StoredDateEvent = { id: `custom-date-${registrationDate}-${registrationTime.replace(":", "")}`, date: registrationDate, time: registrationTime, title: registrationTitle.trim(), type: "date" };
    const next = [...customEvents.filter((event) => event.date !== registrationDate), newEvent];
    window.localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(next));
    setCustomEvents(next);
    window.dispatchEvent(new Event(DATE_DATA_CHANGED_EVENT));
    closeRegistration();
  };

  return (
    <section className="surface-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => setVisibleMonth(new Date(year, month - 1, 1))} disabled={monthIndex <= MIN_MONTH_INDEX} aria-label="前の月を表示" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-navy-light disabled:opacity-20"><ChevronLeft size={17} /></button>
        <div className="flex items-center gap-2"><CalendarDays size={17} className="text-teal" /><h2 className="text-sm font-semibold text-text-primary">{year}年{month + 1}月</h2></div>
        <button type="button" onClick={() => setVisibleMonth(new Date(year, month + 1, 1))} disabled={monthIndex >= MAX_MONTH_INDEX} aria-label="次の月を表示" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-navy-light disabled:opacity-20"><ChevronRight size={17} /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {["日", "月", "火", "水", "木", "金", "土"].map((weekday) => <span key={weekday} className="py-1 text-center text-[10px] text-text-secondary">{weekday}</span>)}
        {calendarDays.map(({ day, date, inCurrentMonth }) => {
          const event = eventMap.get(date);
          const selected = date === selectedDate;
          const today = date === REFERENCE_DATE;
          const stateColor = event?.reviewed ? "bg-text-secondary" : event && event.date < REFERENCE_DATE ? "bg-coral" : "bg-teal";
          const cellClass = `relative flex items-center justify-center rounded-full text-xs transition-colors ${selected ? "h-9 w-9 bg-coral font-semibold text-white" : `h-8 w-8 hover:bg-navy-light ${inCurrentMonth ? "text-text-primary" : event ? "font-semibold text-text-primary" : "text-text-secondary/40"} ${today ? "ring-1 ring-coral" : ""}`}`;
          return <div key={date} className="flex h-10 items-center justify-center">
            {event ? <Link href={getDateHref(event, event.dateId)} aria-label={`${event.title}を開く`} className={cellClass}>{day}{!selected ? <span className={`absolute -bottom-0.5 h-1.5 w-1.5 rounded-full ${stateColor}`} /> : null}</Link>
              : <button type="button" onClick={() => openRegistration(date)} aria-label={`${date}にデートを登録`} className={cellClass}>{day}</button>}
          </div>;
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border-subtle pt-3 text-[10px] text-text-secondary">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-text-secondary" />振り返り済み</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-coral" />未振り返り</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal" />デート予定</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-coral" />今日</span>
      </div>
      <div className="mt-3 space-y-2 border-t border-border-subtle pt-3">
        <p className="text-[10px] font-medium text-text-secondary">デート予定・振り返り</p>
        {visibleDates.length === 0 ? <p className="py-2 text-center text-[10px] text-text-secondary">対象の予定はありません</p> : null}
        {visibleDates.map((event) => {
          const past = event.date < REFERENCE_DATE;
          return <Link key={event.dateId} href={getDateHref(event, event.dateId)} className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-coral/5 ${past ? "bg-coral/10" : "bg-navy-light"}`}>
            <span className={`h-8 w-1 rounded-full ${past ? "bg-coral" : "bg-teal"}`} />
            <div className="min-w-0 flex-1"><p className="text-[10px] font-medium text-text-primary">{Number(event.date.slice(5, 7))}/{Number(event.date.slice(-2))} {event.time}</p><p className="truncate text-[10px] text-text-secondary">{event.title}</p></div>
            <span className={`text-[9px] font-semibold ${past ? "text-coral" : "text-teal"}`}>{past ? "振り返る" : "予定"}</span>
          </Link>;
        })}
        {listedDates.length > 2 ? <button type="button" aria-expanded={showAll} onClick={() => setShowAll((value) => !value)} className="-mb-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[10px] font-medium text-text-secondary hover:bg-navy-light">{showAll ? <>閉じる <ChevronUp size={13} /></> : <>すべての予定を表示 <ChevronDown size={13} /></>}</button> : null}
      </div>
      {registrationDate ? <div role="dialog" aria-modal="true" aria-labelledby="date-registration-title" className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 sm:items-center">
        <button type="button" aria-label="登録画面を閉じる" onClick={closeRegistration} className="absolute inset-0 cursor-default" />
        <form onSubmit={saveRegistration} className="relative w-full max-w-[440px] rounded-[22px] border border-border-subtle bg-navy-card p-5 shadow-2xl">
          <div className="flex items-start justify-between"><div><h2 id="date-registration-title" className="text-base font-bold">デートを登録</h2><p className="mt-1 text-[11px] text-text-secondary">日時と予定の内容を入力してください。</p></div><button type="button" onClick={closeRegistration} aria-label="閉じる" className="flex h-8 w-8 items-center justify-center text-text-secondary"><X size={17} /></button></div>
          <div className="mt-4 space-y-3">
            <label className="block text-[11px] text-text-secondary">日付<input type="date" value={registrationDate} readOnly className="mt-1.5 w-full rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs text-text-primary" /></label>
            <label className="block text-[11px] text-text-secondary">時間<input type="time" value={registrationTime} required onChange={(e) => setRegistrationTime(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs text-text-primary outline-none focus:border-teal" /></label>
            <label className="block text-[11px] text-text-secondary">内容<input type="text" value={registrationTitle} required onChange={(e) => setRegistrationTitle(e.target.value)} placeholder="例：美咲さんとディナー" className="mt-1.5 w-full rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-teal" /></label>
          </div>
          <div className="mt-5 flex gap-2"><button type="button" onClick={closeRegistration} className="flex-1 rounded-xl border border-border-subtle py-2.5 text-xs font-semibold text-text-secondary">キャンセル</button><button type="submit" className="flex-1 rounded-xl bg-coral py-2.5 text-xs font-semibold text-white">登録する</button></div>
        </form>
      </div> : null}
    </section>
  );
}
