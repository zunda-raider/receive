"use client";

import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Lightbulb,
  MapPin,
  MessageCircleMore,
  Save,
  Send,
  Sparkles,
  Target,
  UserCircle2,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import DateCalendar from "@/components/DateCalendar";
import GeneratedAvatar from "@/components/GeneratedAvatar";
import {
  datePlans,
  latestPastDate,
  upcomingDatePlan,
  type DatePlan,
} from "@/lib/mock-data";
import { isReviewSaved } from "@/lib/date-storage";

type Preparation = {
  purpose: string;
  questions: string[];
  actions: string[];
  purposeNote: string;
  questionsNote: string;
  actionsNote: string;
};

type ChatMessage = { role: "ai" | "user"; text: string };

type SavedDateState = {
  version: 1;
  preparation: Preparation;
  chat: ChatMessage[];
  savedAt: string;
};

const getInitialPreparation = (datePlan: DatePlan): Preparation => ({
  purpose: datePlan.initialPurpose,
  questions: datePlan.initialQuestions,
  actions: datePlan.initialActions,
  purposeNote: "",
  questionsNote: "",
  actionsNote: "",
});

const getInitialChat = (datePlan: DatePlan): ChatMessage[] => [{
  role: "ai",
  text: `${Number(datePlan.date.slice(5, 7))}月${Number(datePlan.date.slice(-2))}日の${datePlan.partner.name}さんとのデート、一緒に準備しましょう。会話・服装・緊張など、気になることを聞いてくださいね。`,
}];

const quickQuestions = [
  "最初に何話したらいい？",
  "会話が途切れたら？",
];

function getAiResponse(input: string, partnerName: string) {
  if (/服|コーデ|ファッション/.test(input)) {
    return "清潔感のあるニットポロとネイビーのパンツなら、今回のお店にちょうどいい上品さです。香りは控えめにして、靴の汚れだけ出発前に確認しましょう。";
  }
  if (/緊張|不安/.test(input)) {
    return "緊張するのは、相手との時間を大切にしたい証拠です。到着前に4秒吸って6秒吐く呼吸を3回。『楽しませる』より『一つ知って帰る』を目標にすると楽になります。";
  }
  if (/途切|沈黙|話題/.test(input)) {
    return `沈黙は失敗ではありません。お店や料理について一言触れてから、『休日はどんな場所でゆっくりすることが多い？』と${partnerName}さんの好きな過ごし方につなげてみましょう。`;
  }
  if (/最初|挨拶|何を話/.test(input)) {
    return "まずは『今日は来てくれてありがとう。ここまで迷わなかった？』くらいの軽い一言で十分です。席についてから、最近行ったカフェや展示の話を聞くと自然に広がります。";
  }
  if (/次|二回|また/.test(input)) {
    return `会話の中で${partnerName}さんが楽しそうに話した場所を覚えておき、『今度そこ、一緒に行けたら楽しそう』と軽く伝えるのがおすすめです。結論を急がず、帰宅後のお礼でも誘えます。`;
  }
  return `${partnerName}さんの話を急がず聞き、一つの話題を少し深掘りするのがおすすめです。あなた自身も楽しむことを忘れずにいきましょう。`;
}

function ChoiceSection({
  title,
  description,
  icon,
  options,
  selected,
  onToggle,
  freeText,
  onFreeTextChange,
  freeTextPlaceholder,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  freeText: string;
  onFreeTextChange: (value: string) => void;
  freeTextPlaceholder: string;
}) {
  return (
    <section className="rounded-sm border border-border-subtle bg-navy-card p-4">
      <div className="mb-3 flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">{icon}</span>
        <div>
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          <p className="mt-0.5 text-[11px] text-text-secondary">{description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-left text-[11px] leading-relaxed transition-colors ${active ? "border-teal/60 bg-teal/10 text-teal" : "border-border-subtle bg-navy-light text-text-secondary hover:text-text-primary"}`}
            >
              {active ? <Check size={13} /> : null}
              {option}
            </button>
          );
        })}
      </div>
      <div className="mt-3 border-t border-border-subtle pt-3">
        <label className="block text-[10px] font-medium text-text-secondary">
          選択肢にない内容を入力
          <textarea
            value={freeText}
            onChange={(event) => onFreeTextChange(event.target.value)}
            placeholder={freeTextPlaceholder}
            rows={2}
            className="mt-1.5 w-full resize-none rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs leading-relaxed text-text-primary outline-none placeholder:text-text-secondary focus:border-teal"
          />
        </label>
      </div>
    </section>
  );
}

function DatePlanContent({ datePlan }: { datePlan: DatePlan }) {
  const storageKey = `aime:date-plan:v1:${datePlan.id}`;
  const initialPreparation = useMemo(() => getInitialPreparation(datePlan), [datePlan]);
  const initialChat = useMemo(() => getInitialChat(datePlan), [datePlan]);
  const [preparation, setPreparation] = useState(initialPreparation);
  const [chat, setChat] = useState<ChatMessage[]>(initialChat);
  const [chatInput, setChatInput] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const responseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        try {
          const saved = JSON.parse(raw) as SavedDateState;
          if (saved.version === 1) {
            const restoredPreparation: Preparation = {
              ...initialPreparation,
              ...saved.preparation,
              purposeNote: saved.preparation.purposeNote ?? "",
              questionsNote: saved.preparation.questionsNote ?? "",
              actionsNote: saved.preparation.actionsNote ?? "",
            };
            setPreparation(restoredPreparation);
            setChat(saved.chat);
            setSavedAt(saved.savedAt);
            setSavedSnapshot(JSON.stringify({ preparation: restoredPreparation, chat: saved.chat }));
          }
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      } else {
        setSavedSnapshot(JSON.stringify({ preparation: initialPreparation, chat: initialChat }));
      }
      setReviewCompleted(isReviewSaved(latestPastDate.id));
    });
    return () => {
      active = false;
      if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
    };
  }, [initialChat, initialPreparation, storageKey]);

  const currentSnapshot = JSON.stringify({ preparation, chat });
  const isDirty = currentSnapshot !== savedSnapshot;

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2400);
  };

  const toggleMultiple = (key: "questions" | "actions", value: string) => {
    setPreparation((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  };

  const sendMessage = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isAiTyping) return;
    setChat((current) => [...current, { role: "user", text: trimmed }]);
    setChatInput("");
    setIsAiTyping(true);
    responseTimerRef.current = setTimeout(() => {
      setChat((current) => [...current, { role: "ai", text: getAiResponse(trimmed, datePlan.partner.name) }]);
      setIsAiTyping(false);
      responseTimerRef.current = null;
    }, 900);
  };

  const submitChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(chatInput);
  };

  const savePlan = () => {
    const timestamp = new Date().toISOString();
    const payload: SavedDateState = { version: 1, preparation, chat, savedAt: timestamp };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    setSavedAt(timestamp);
    setSavedSnapshot(currentSnapshot);
    flash("デートの準備を保存しました");
  };

  return (
    <AuthGuard>
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 space-y-4 px-5 pb-28 pt-6">
        <header>
          <h1 className="text-xl font-bold text-text-primary">デートの準備</h1>
          <p className="mt-1 text-xs text-text-secondary">当日を自然体で楽しむために、少しだけ準備しておきましょう。</p>
        </header>

        <DateCalendar selectedDate={datePlan.date} />

        {!reviewCompleted ? (
          <section className="rounded-sm border border-coral/30 bg-coral/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="mt-0.5 shrink-0 text-coral" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-coral">前回の振り返りがまだです</p>
                <p className="mt-1 text-sm font-medium text-text-primary">7/27 彩花さんとのカフェ</p>
                <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">覚えているうちに記録すると、次のデートへのヒントが見つかります。</p>
                <Link href={`/date/review?date=${latestPastDate.date}&id=${latestPastDate.id}`} className="mt-3 inline-flex items-center rounded-lg bg-coral px-3 py-2 text-xs font-semibold text-white">振り返りを回答する</Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="flex items-center gap-3 rounded-[18px] border border-teal/20 bg-teal/10 p-3 text-xs text-teal">
            <CheckCircle2 size={18} />7/27の振り返りは回答済みです
          </section>
        )}

        <section className="surface-card overflow-hidden p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-teal px-2.5 py-1 text-[10px] font-bold text-white">{datePlan.date < "2026-08-02" ? "過去のデート" : "予定のデート"}</span>
            <span className={`text-[10px] ${isDirty ? "text-coral" : "text-teal"}`}>{isDirty ? "未保存の変更あり" : "保存済み"}</span>
          </div>
          <h2 className="mt-3 text-lg font-bold text-text-primary">{datePlan.title}</h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-text-secondary">
            <span className="flex items-center gap-1"><CalendarDays size={13} />{Number(datePlan.date.slice(5, 7))}月{Number(datePlan.date.slice(-2))}日</span>
            <span className="flex items-center gap-1"><Clock3 size={13} />{datePlan.time}</span>
            <span className="flex items-center gap-1"><MapPin size={13} />{datePlan.location}</span>
          </div>
        </section>

        <section className="rounded-sm border border-border-subtle bg-navy-card p-4">
          <div className="flex items-start gap-3">
            <GeneratedAvatar name={datePlan.partner.name} size={64} />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-text-primary">{datePlan.partner.name}さん</h2>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-text-secondary">
                <span className="flex items-center gap-1"><UserCircle2 size={12} />{datePlan.partner.age}歳・{datePlan.partner.location}</span>
                <span className="flex items-center gap-1"><Briefcase size={12} />{datePlan.partner.job}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-text-secondary">{datePlan.partner.bio}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {datePlan.partner.hobbies.map((hobby) => <span key={hobby} className="rounded-full bg-navy-light px-2.5 py-1 text-[10px] text-text-secondary">{hobby}</span>)}
          </div>
          <div className="mt-4 rounded-xl bg-teal/10 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-teal"><Sparkles size={14} />相性がよさそうな理由</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">{datePlan.partner.compatibility}</p>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-navy-light p-3">
              <p className="text-[10px] font-semibold text-text-primary">共通点</p>
              {datePlan.partner.commonPoints.map((point) => <p key={point} className="mt-1.5 flex gap-1 text-[10px] text-text-secondary"><Check size={11} className="mt-0.5 shrink-0 text-teal" />{point}</p>)}
            </div>
            <div className="rounded-xl bg-navy-light p-3">
              <p className="text-[10px] font-semibold text-text-primary">会話のヒント</p>
              {datePlan.partner.conversationTips.map((tip) => <p key={tip} className="mt-1.5 flex gap-1 text-[10px] text-text-secondary"><Lightbulb size={11} className="mt-0.5 shrink-0 text-coral" />{tip}</p>)}
            </div>
          </div>
        </section>

        <ChoiceSection title="今回の目的" description="このデートで一番大切にしたいことを1つ選択" icon={<Target size={16} />} options={datePlan.purposeOptions} selected={[preparation.purpose]} onToggle={(purpose) => setPreparation((current) => ({ ...current, purpose }))} freeText={preparation.purposeNote} onFreeTextChange={(purposeNote) => setPreparation((current) => ({ ...current, purposeNote }))} freeTextPlaceholder="今回のデートで意識したいことを自由に入力" />
        <ChoiceSection title="確認したいこと" description={`${datePlan.partner.name}さんについて知りたいことを複数選べます`} icon={<MessageCircleMore size={16} />} options={datePlan.questionOptions} selected={preparation.questions} onToggle={(value) => toggleMultiple("questions", value)} freeText={preparation.questionsNote} onFreeTextChange={(questionsNote) => setPreparation((current) => ({ ...current, questionsNote }))} freeTextPlaceholder="聞いてみたいことを自由に入力" />
        <ChoiceSection title="行動目標" description="当日に意識する小さな目標を選びましょう" icon={<CheckCircle2 size={16} />} options={datePlan.actionOptions} selected={preparation.actions} onToggle={(value) => toggleMultiple("actions", value)} freeText={preparation.actionsNote} onFreeTextChange={(actionsNote) => setPreparation((current) => ({ ...current, actionsNote }))} freeTextPlaceholder="自分なりの行動目標を自由に入力" />

        <section className="overflow-hidden rounded-sm border border-border-subtle bg-navy-card">
          <div className="p-4 pb-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-text-primary"><Sparkles size={16} className="text-coral" />おすすめファッション</p>
            <p className="mt-1 text-[11px] text-text-secondary">初回ディナー向け・スマートカジュアル</p>
          </div>
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-navy-light">
            <Image src="/images/date-outfit.png" alt="アイボリーのニットポロ、ネイビーのパンツ、ブラウンのローファーと小物を平置きしたデートコーデ" fill sizes="(max-width: 480px) 100vw, 440px" className="object-cover" />
          </div>
          <p className="p-4 text-[11px] leading-relaxed text-text-secondary">{datePlan.fashionCaption}</p>
        </section>

        <section className="rounded-sm border border-border-subtle bg-navy-card p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral/10"><Sparkles size={17} className="text-coral" /></span>
            <div><h2 className="text-sm font-semibold text-text-primary">デート相談AI</h2><p className="text-[10px] text-text-secondary">{datePlan.partner.name}さんとの予定に合わせて回答します</p></div>
          </div>
          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto rounded-xl bg-navy-light/60 p-3" aria-live="polite">
            {chat.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[88%]  px-3 py-2 text-[11px] leading-relaxed ${message.role === "user" ? "rounded-br-sm bg-coral text-white" : "rounded-bl-sm bg-navy-card text-text-secondary"}`}>{message.text}</p>
              </div>
            ))}
            {isAiTyping ? (
              <div className="flex justify-start" aria-label="AIが回答を考えています">
                <div className="flex items-center gap-1.5  rounded-bl-sm bg-navy-card px-3 py-2.5">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal"
                      style={{ animationDelay: `${dot * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {quickQuestions.map((question) => <button key={question} type="button" disabled={isAiTyping} onClick={() => sendMessage(question)} className="min-w-0 rounded-full border border-border-subtle bg-navy-light px-2 py-1.5 text-[10px] text-text-secondary disabled:opacity-40">{question}</button>)}
          </div>
          <form onSubmit={submitChat} className="mt-3 flex gap-2">
            <label htmlFor="date-ai-question" className="sr-only">デート相談を入力</label>
            <input id="date-ai-question" value={chatInput} disabled={isAiTyping} onChange={(event) => setChatInput(event.target.value)} placeholder={isAiTyping ? "AIが回答を考えています..." : "気になることを相談..."} className="min-w-0 flex-1 rounded-xl border border-border-subtle bg-navy-light px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-teal disabled:opacity-60" />
            <button type="submit" aria-label="相談を送信" disabled={!chatInput.trim() || isAiTyping} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal text-white disabled:opacity-40"><Send size={16} /></button>
          </form>
        </section>

        <section className="pt-1">
          <button type="button" onClick={savePlan} disabled={!isDirty || isAiTyping} className="flex w-full items-center justify-center gap-2 btn-gradient py-3.5 text-sm font-semibold text-white transition-colors disabled:bg-navy-light disabled:text-text-secondary disabled:shadow-none disabled:bg-none">
            {isAiTyping ? <Sparkles size={18} /> : isDirty ? <Save size={18} /> : <CheckCircle2 size={18} />}{isAiTyping ? "回答を待っています" : isDirty ? "準備内容を保存する" : "保存済み"}
          </button>
          <p className="mt-2 text-center text-[10px] text-text-secondary">{savedAt ? `${new Date(savedAt).toLocaleString("ja-JP")} に保存` : "この端末に保存されます"}</p>
        </section>
      </motion.main>
      {notice ? <div role="status" className="fixed left-1/2 top-5 z-[70] -translate-x-1/2 rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white shadow-xl">{notice}</div> : null}
      <BottomTabBar />
    </AuthGuard>
  );
}

function DatePageFromSearch() {
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date") ?? "2026-08-05";
  const customTitle = searchParams.get("title");
  const customTime = searchParams.get("time");
  const customId = searchParams.get("id");
  const registeredPlan = datePlans.find((plan) => plan.date === selectedDate);
  const partnerName = customTitle?.match(/^(.+?)さん/)?.[1];
  const datePlan = registeredPlan ?? (customTitle && customTime ? {
    ...upcomingDatePlan,
    id: customId ?? `custom-date-${selectedDate}-${customTime.replace(":", "")}`,
    date: selectedDate,
    time: customTime,
    title: customTitle,
    location: "場所未設定",
    partner: partnerName
      ? { ...upcomingDatePlan.partner, name: partnerName }
      : upcomingDatePlan.partner,
  } : upcomingDatePlan);
  return <DatePlanContent key={datePlan.id} datePlan={datePlan} />;
}

export default function DatePage() {
  return <Suspense fallback={null}><DatePageFromSearch /></Suspense>;
}
