"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Check, CheckCircle2, Clock3, MapPin, Save, UserRound } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import DateCalendar from "@/components/DateCalendar";
import { datePlans } from "@/lib/mock-data";
import { DATE_DATA_CHANGED_EVENT, getReviewKey, type DateReviewAnswers, type SavedDateReview } from "@/lib/date-storage";

const emptyAnswers: DateReviewAnswers = { overallFeeling: "", meetAgain: "", partnerReactions: [], goodThings: [], goodThingsNote: "", improvements: [], improvementsNote: "", learnedAboutPartner: "", nextTopics: [], nextTopicsNote: "", nextAction: "" };
const reactionOptions = ["楽しそうだった", "会話が弾んだ", "相手から質問があった", "次につながる話が出た", "少し距離を感じた"];
const goodOptions = ["自然体で話せた", "相手の話をよく聞けた", "共通点が見つかった", "自分のことも伝えられた", "お店やプランがよかった"];
const improvementOptions = ["緊張しすぎた", "自分ばかり話した", "質問が少なかった", "相手に合わせすぎた", "次の約束につなげられなかった"];
const topicOptions = ["休日の過ごし方", "趣味をもっと深掘り", "恋愛観・価値観", "行ってみたい場所", "仕事や将来のこと"];

function SingleChoice({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return <section className="rounded-[20px] border border-border-subtle bg-navy-card p-4"><h2 className="text-sm font-semibold text-text-primary">{title}</h2><div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">{options.map((option) => <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={`rounded-xl border px-3 py-2.5 text-left text-[11px] transition-colors ${value === option ? "border-coral/60 bg-coral/10 text-coral" : "border-border-subtle bg-navy-light text-text-secondary"}`}>{option}</button>)}</div></section>;
}

function MultiChoice({ title, options, values, onChange, note, onNoteChange, placeholder }: { title: string; options: string[]; values: string[]; onChange: (values: string[]) => void; note?: string; onNoteChange?: (value: string) => void; placeholder?: string }) {
  const toggle = (option: string) => onChange(values.includes(option) ? values.filter((value) => value !== option) : [...values, option]);
  return <section className="rounded-[20px] border border-border-subtle bg-navy-card p-4"><h2 className="text-sm font-semibold text-text-primary">{title}</h2><p className="mt-1 text-[10px] text-text-secondary">複数選択できます</p><div className="mt-3 flex flex-wrap gap-2">{options.map((option) => { const active = values.includes(option); return <button key={option} type="button" aria-pressed={active} onClick={() => toggle(option)} className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] ${active ? "border-teal/60 bg-teal/10 text-teal" : "border-border-subtle bg-navy-light text-text-secondary"}`}>{active ? <Check size={13} /> : null}{option}</button>; })}</div>{onNoteChange ? <textarea value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder={placeholder} rows={3} className="mt-3 w-full resize-none rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs leading-relaxed text-text-primary outline-none placeholder:text-text-secondary focus:border-teal" /> : null}</section>;
}

function ReviewContent() {
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date") ?? "2026-07-27";
  const registeredPlan = datePlans.find((plan) => plan.date === selectedDate);
  const title = searchParams.get("title") ?? registeredPlan?.title ?? "登録したデート";
  const time = searchParams.get("time") ?? registeredPlan?.time ?? "時間未設定";
  const dateId = searchParams.get("id") ?? registeredPlan?.id ?? `custom-date-${selectedDate}-${time.replace(":", "")}`;
  const partnerName = registeredPlan?.partner.name ?? title.match(/^(.+?)さん/)?.[1] ?? "お相手";
  const location = registeredPlan?.location ?? "場所未設定";
  const storageKey = getReviewKey(dateId);
  const [answers, setAnswers] = useState<DateReviewAnswers>(emptyAnswers);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState(false);
  const snapshot = useMemo(() => JSON.stringify(answers), [answers]);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const saved = JSON.parse(raw) as SavedDateReview;
          const restored = { ...emptyAnswers, ...saved.answers };
          setAnswers(restored); setSavedSnapshot(JSON.stringify(restored)); setSavedAt(saved.savedAt);
        } else setSavedSnapshot(JSON.stringify(emptyAnswers));
      } catch { window.localStorage.removeItem(storageKey); setSavedSnapshot(JSON.stringify(emptyAnswers)); }
      setLoaded(true);
    });
  }, [storageKey]);

  const set = <K extends keyof DateReviewAnswers>(key: K, value: DateReviewAnswers[K]) => setAnswers((current) => ({ ...current, [key]: value }));
  const save = () => {
    const timestamp = new Date().toISOString();
    const payload: SavedDateReview = { version: 1, answers, savedAt: timestamp, completed: true };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    setSavedAt(timestamp); setSavedSnapshot(snapshot); setNotice(true);
    window.dispatchEvent(new Event(DATE_DATA_CHANGED_EVENT));
    window.setTimeout(() => setNotice(false), 2400);
  };
  const dirty = loaded && snapshot !== savedSnapshot;

  return <AuthGuard><motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 space-y-4 px-5 pb-28 pt-6">
    <header><p className="text-xs font-semibold text-coral">DATE REVIEW</p><h1 className="mt-1 text-xl font-bold text-text-primary">デートを振り返る</h1><p className="mt-1 text-xs text-text-secondary">感じたことを残して、次の一歩に活かしましょう。</p></header>
    <DateCalendar selectedDate={selectedDate} />
    <section className="surface-card p-4"><div className="flex items-center justify-between"><span className="bg-navy-light px-2.5 py-1 text-[10px] font-semibold text-coral">{savedAt ? "振り返り済み・編集できます" : "未振り返り"}</span>{dirty ? <span className="text-[10px] text-coral">未保存の変更あり</span> : null}</div><h2 className="mt-3 text-lg font-bold text-text-primary">{title}</h2><div className="mt-3 grid gap-2 text-[11px] text-text-secondary sm:grid-cols-2"><span className="flex items-center gap-1.5"><UserRound size={13} />{partnerName}さん</span><span className="flex items-center gap-1.5"><CalendarDays size={13} />{Number(selectedDate.slice(5, 7))}月{Number(selectedDate.slice(-2))}日</span><span className="flex items-center gap-1.5"><Clock3 size={13} />{time}</span><span className="flex items-center gap-1.5"><MapPin size={13} />{location}</span></div></section>
    <SingleChoice title="全体の手応え" options={["よかった", "ふつう", "もう少し"]} value={answers.overallFeeling} onChange={(value) => set("overallFeeling", value)} />
    <SingleChoice title="また会いたいか" options={["また会いたい", "もう少し知りたい", "まだ分からない", "今回で終わりにしたい"]} value={answers.meetAgain} onChange={(value) => set("meetAgain", value)} />
    <MultiChoice title="相手の反応" options={reactionOptions} values={answers.partnerReactions} onChange={(value) => set("partnerReactions", value)} />
    <MultiChoice title="よかったこと" options={goodOptions} values={answers.goodThings} onChange={(value) => set("goodThings", value)} note={answers.goodThingsNote} onNoteChange={(value) => set("goodThingsNote", value)} placeholder="よかった場面や、自分らしくできたこと" />
    <MultiChoice title="改善したいこと" options={improvementOptions} values={answers.improvements} onChange={(value) => set("improvements", value)} note={answers.improvementsNote} onNoteChange={(value) => set("improvementsNote", value)} placeholder="次回は少し変えてみたいこと" />
    <section className="rounded-[20px] border border-border-subtle bg-navy-card p-4"><h2 className="text-sm font-semibold">相手について新しく分かったこと</h2><textarea value={answers.learnedAboutPartner} onChange={(event) => set("learnedAboutPartner", event.target.value)} rows={4} placeholder="好きなこと、価値観、印象に残った話など" className="mt-3 w-full resize-none rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs leading-relaxed outline-none placeholder:text-text-secondary focus:border-teal" /></section>
    <MultiChoice title="次に話したいこと" options={topicOptions} values={answers.nextTopics} onChange={(value) => set("nextTopics", value)} note={answers.nextTopicsNote} onNoteChange={(value) => set("nextTopicsNote", value)} placeholder="次に聞いてみたいことや話題" />
    <SingleChoice title="次のアクション" options={["お礼を送る", "次のデートに誘う", "少し時間を置く", "今回で終了する", "まだ決めない"]} value={answers.nextAction} onChange={(value) => set("nextAction", value)} />
    <section className="pt-1"><button type="button" onClick={save} disabled={!dirty && Boolean(savedAt)} className="flex w-full items-center justify-center gap-2 btn-gradient py-3.5 text-sm font-semibold text-white disabled:bg-navy-light disabled:text-text-secondary disabled:shadow-none disabled:bg-none">{!dirty && savedAt ? <CheckCircle2 size={18} /> : <Save size={18} />}{!dirty && savedAt ? "保存済み" : "振り返りを保存"}</button><p className="mt-2 text-center text-[10px] text-text-secondary">{savedAt ? `${new Date(savedAt).toLocaleString("ja-JP")} に保存` : "この端末に保存されます"}</p></section>
  </motion.main>{notice ? <div role="status" className="fixed left-1/2 top-5 z-[70] -translate-x-1/2 bg-teal px-4 py-2 text-xs font-semibold text-white shadow-xl">振り返りを保存しました</div> : null}<BottomTabBar /></AuthGuard>;
}

export default function ReviewPage() { return <Suspense fallback={null}><ReviewContent /></Suspense>; }
