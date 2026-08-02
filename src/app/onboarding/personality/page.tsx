"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { personalityQuestions, personalityLabels, type PersonalityScores } from "@/lib/mock-data";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const scaleLabels = [
  "あてはまらない",
  "やや\nあてはまらない",
  "どちらとも",
  "やや\nあてはまる",
  "あてはまる",
];

export default function OnboardingPersonalityPage() {
  const router = useRouter();
  const { completeOnboarding, updatePersonalityScores } = useAuth();

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState(1);

  const handleAnswer = useCallback(
    (value: number) => {
      setAnswers((prev) => ({ ...prev, [personalityQuestions[currentQ].id]: value }));
      if (currentQ < personalityQuestions.length - 1) {
        setDirection(1);
        setTimeout(() => setCurrentQ((c) => c + 1), 200);
      } else {
        // Calculate result
        setTimeout(() => setShowResult(true), 300);
      }
    },
    [currentQ]
  );

  // Calculate personality scores from answers
  const calculateScores = (): PersonalityScores => {
    const axes: Record<string, number[]> = {};
    personalityQuestions.forEach((q) => {
      if (!axes[q.axis]) axes[q.axis] = [];
      const answer = answers[q.id] ?? 3;
      axes[q.axis].push(answer);
    });
    const scores: Record<string, number> = {};
    Object.entries(axes).forEach(([axis, vals]) => {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      scores[axis] = Math.round((avg / 5) * 100);
    });
    return scores as unknown as PersonalityScores;
  };

  const handleComplete = () => {
    const scores = calculateScores();
    updatePersonalityScores(scores);
    completeOnboarding();
    router.push("/home");
  };

  const radarData = (() => {
    const scores = showResult ? calculateScores() : null;
    if (!scores) return [];
    return (Object.keys(personalityLabels) as (keyof PersonalityScores)[]).map((key) => ({
      axis: personalityLabels[key],
      value: scores[key],
    }));
  })();

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col px-5 pb-8"
      >
        <div className="pt-6 pb-4">
          <span className="text-xs text-text-secondary">診断結果</span>
        </div>

        <h1 className="text-lg font-bold text-text-primary mb-2">
          あなたの性格タイプ
        </h1>

        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-4">
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(184,20,63,0.12)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#7A5C66", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="あなた"
                  dataKey="value"
                  stroke="#B8143F"
                  fill="#B8143F"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-6">
          <p className="text-sm text-text-primary leading-relaxed">
            あなたは協調性が高く、相手の気持ちに寄り添える方です。
            新しい出会いにもオープンで、バランスの取れたコミュニケーションが取れます。
            じっくり関係を育てていくスタイルが合っています。
          </p>
        </div>

        <button
          onClick={handleComplete}
          className="btn-gradient w-full text-white font-semibold py-3.5 "
        >
          ホームへ
        </button>
      </motion.div>
    );
  }

  const q = personalityQuestions[currentQ];
  if (!q) return null;

  return (
    <div className="min-h-screen flex flex-col px-5 pb-8">
      {/* Progress */}
      <div className="pt-6 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => {
              if (currentQ > 0) {
                setDirection(-1);
                setCurrentQ((c) => c - 1);
              } else {
                router.back();
              }
            }}
            className="text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs text-text-secondary">ステップ 3/3</span>
        </div>
        <div className="flex gap-1.5">
          <div className="h-1 flex-1 rounded-full bg-coral" />
          <div className="h-1 flex-1 rounded-full bg-coral" />
          <div className="h-1 flex-1 rounded-full bg-coral" />
        </div>
      </div>

      <h1 className="text-lg font-bold text-text-primary mb-1">性格診断</h1>
      <p className="text-xs text-text-secondary mb-8">
        Q{currentQ + 1} / {personalityQuestions.length}
      </p>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            <p className="text-base font-semibold text-text-primary leading-relaxed mb-10 px-2">
              {q.text}
            </p>

            <div className="flex justify-center gap-3">
              {scaleLabels.map((label, i) => {
                const value = i + 1;
                const isSelected = answers[q.id] === value;
                const sizes = [36, 32, 28, 32, 36];
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(value)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`rounded-full border-2 transition-all ${
                        isSelected
                          ? "bg-coral border-coral"
                          : "border-text-secondary/30 hover:border-coral/50"
                      }`}
                      style={{ width: sizes[i], height: sizes[i] }}
                    />
                    <span className="text-[9px] text-text-secondary whitespace-pre-line leading-tight">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mt-8">
        {personalityQuestions.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentQ
                ? "bg-coral"
                : answers[personalityQuestions[i].id] !== undefined
                  ? "bg-coral/40"
                  : "bg-navy-light"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
