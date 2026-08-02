"use client";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GeneratedAvatar from "@/components/GeneratedAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { personalityLabels, recommendations } from "@/lib/mock-data";
import type { PersonalityScores } from "@/lib/mock-data";
import { Heart, X, MapPin, Briefcase } from "lucide-react";

type Filter = "all" | "score" | "new" | "hobby";

const idealPartnerTraits: Record<keyof PersonalityScores, string> = {
  extraversion: "会話やお出かけを一緒に楽しめる",
  agreeableness: "気持ちを言葉で伝え合い、思いやりを返してくれる",
  conscientiousness: "約束や日々の小さな積み重ねを大切にする",
  emotionalStability: "穏やかに話し合えて、安心感をくれる",
  openness: "新しい体験や価値観を一緒に楽しめる",
  dominance: "お互いの希望を率直に話し合える",
};

export default function RecommendPage() {
  const { personalityScores } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const strongestTraits = (Object.keys(personalityScores) as (keyof PersonalityScores)[])
    .sort((a, b) => personalityScores[b] - personalityScores[a])
    .slice(0, 2);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "score", label: "マッチ度順" },
    { key: "new", label: "新着" },
    { key: "hobby", label: "趣味が近い" },
  ];

  let sorted = recommendations.filter((r) => !dismissed.has(r.id));
  if (filter === "score") sorted = [...sorted].sort((a, b) => b.matchScore - a.matchScore);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-5 pb-24 pt-8"
      >
        <p className="font-label text-gold mb-2">Match</p>
        <h1 className="font-display text-heading text-text-primary mb-5">相互レコメンド</h1>

        {/* Ideal partner summary */}
        <div className="surface-card p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[11px] tracking-wide text-teal">あなたに合う人</p>
          </div>
          <p className="text-sm leading-relaxed text-text-primary">
            {idealPartnerTraits[strongestTraits[0]]}、{idealPartnerTraits[strongestTraits[1]]}人が合いそうです。
          </p>
          <p className="text-[10px] text-text-secondary mt-2">
            あなたの{strongestTraits.map((trait) => personalityLabels[trait]).join("・")}の強みをもとにしています
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap border transition-colors ${
                filter === f.key
                  ? "bg-coral text-white border-coral"
                  : "bg-transparent text-text-secondary border-border-subtle hover:border-coral/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {sorted.map((rec) => (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/recommend/${rec.id}`}>
                  <div className="surface-card px-4 py-4">
                    <div className="flex items-start gap-3 mb-3">
                      <GeneratedAvatar name={rec.name} size={52} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-bold text-text-primary text-sm">{rec.name}</h3>
                          <span className="text-xs text-text-secondary">{rec.age}歳</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-0.5 text-[11px] text-text-secondary">
                            <MapPin size={10} />
                            {rec.location}
                          </span>
                          <span className="flex items-center gap-0.5 text-[11px] text-text-secondary">
                            <Briefcase size={10} />
                            {rec.job}
                          </span>
                        </div>
                      </div>
                      {/* Match score circle */}
                      <div className="relative w-12 h-12">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#FCE9E6"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={rec.matchScore >= 80 ? "#B8143F" : "#FF6F5E"}
                            strokeWidth="3"
                            strokeDasharray={`${rec.matchScore}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-text-primary">
                          {rec.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Hobbies */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {rec.hobbies.map((h) => (
                        <span key={h} className="px-2 py-0.5 rounded-full bg-navy-light text-[10px] text-text-secondary">
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Reason */}
                    <p className="text-[11px] text-coral/90 leading-relaxed">{rec.reason}</p>
                  </div>
                </Link>

                {/* Action buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => { e.preventDefault(); handleDismiss(rec.id); }}
                    className="flex-1 flex items-center justify-center gap-1 bg-navy-card border border-border-subtle rounded-xl py-2 text-text-secondary text-xs hover:border-text-secondary/30 transition-colors"
                  >
                    <X size={14} />
                    スキップ
                  </button>
                  <button className="btn-gradient flex-1 flex items-center justify-center gap-1 rounded-xl py-2 text-white text-xs">
                    <Heart size={14} />
                    気になる
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      <BottomTabBar />
    </AuthGuard>
  );
}
