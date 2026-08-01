"use client";
import { use } from "react";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import GeneratedAvatar from "@/components/GeneratedAvatar";
import { recommendations, personalityLabels } from "@/lib/mock-data";
import type { PersonalityScores } from "@/lib/mock-data";
import { ArrowLeft, Heart, MapPin, Briefcase, Ruler, UserCircle } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function RecommendDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { personalityScores: myScores } = useAuth();

  const rec = recommendations.find((r) => r.id === id);
  if (!rec) {
    return (
      <AuthGuard>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-secondary">見つかりませんでした</p>
        </div>
        <BottomTabBar />
      </AuthGuard>
    );
  }

  const radarData = (Object.keys(personalityLabels) as (keyof PersonalityScores)[]).map((key) => ({
    axis: personalityLabels[key],
    あなた: myScores[key],
    [rec.name]: rec.personalityScores[key],
  }));

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 px-5 pb-24 pt-6"
      >
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-xs mb-4"
        >
          <ArrowLeft size={16} />
          戻る
        </button>

        {/* Profile header */}
        <div className="flex items-start gap-4 mb-5">
          <GeneratedAvatar name={rec.name} size={72} />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text-primary">{rec.name}</h1>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="flex items-center gap-0.5 text-xs text-text-secondary">
                <UserCircle size={12} />{rec.age}歳
              </span>
              <span className="flex items-center gap-0.5 text-xs text-text-secondary">
                <MapPin size={12} />{rec.location}
              </span>
              <span className="flex items-center gap-0.5 text-xs text-text-secondary">
                <Briefcase size={12} />{rec.job}
              </span>
              <span className="flex items-center gap-0.5 text-xs text-text-secondary">
                <Ruler size={12} />{rec.height}cm
              </span>
            </div>
          </div>
          {/* Match score */}
          <div className="relative w-14 h-14 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1A2540"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#FF7A59"
                strokeWidth="3"
                strokeDasharray={`${rec.matchScore}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-primary">
              {rec.matchScore}%
            </span>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-4">
          <p className="text-xs text-text-secondary mb-1">自己紹介</p>
          <p className="text-sm text-text-primary leading-relaxed">{rec.bio}</p>
        </div>

        {/* Hobbies */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-4">
          <p className="text-xs text-text-secondary mb-2">趣味</p>
          <div className="flex flex-wrap gap-1.5">
            {rec.hobbies.map((h) => (
              <span key={h} className="px-2.5 py-1 rounded-full bg-navy-light text-[11px] text-text-secondary">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Match reason */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-4">
          <p className="text-xs text-text-secondary mb-1">相性の理由</p>
          <p className="text-sm text-teal leading-relaxed">{rec.reason}</p>
        </div>

        {/* Radar comparison */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-6">
          <p className="text-xs text-text-secondary mb-2">性格比較</p>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#8A94A6", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="あなた" dataKey="あなた" stroke="#FF7A59" fill="#FF7A59" fillOpacity={0.2} strokeWidth={2} />
                <Radar name={rec.name} dataKey={rec.name} stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.2} strokeWidth={2} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#8A94A6" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action button */}
        <button className="w-full bg-coral hover:bg-coral-hover text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
          <Heart size={18} />
          気になる
        </button>
      </motion.div>
      <BottomTabBar />
    </AuthGuard>
  );
}
