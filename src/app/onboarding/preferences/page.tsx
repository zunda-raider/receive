"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { hobbyOptions, bodyTypeOptions } from "@/lib/mock-data";

export default function OnboardingPreferencesPage() {
  const router = useRouter();

  const [ageRange, setAgeRange] = useState([22, 32]);
  const [heightRange, setHeightRange] = useState([150, 175]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(["こだわらない"]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [distance, setDistance] = useState(30);
  const [priorities, setPriorities] = useState<Record<string, boolean>>({
    age: false,
    bodyType: false,
    height: false,
    hobbies: true,
    distance: false,
  });

  const toggleBodyType = (bt: string) => {
    if (bt === "こだわらない") {
      setSelectedBodyTypes(["こだわらない"]);
    } else {
      setSelectedBodyTypes((prev) => {
        const next = prev.filter((x) => x !== "こだわらない");
        return next.includes(bt) ? next.filter((x) => x !== bt) : [...next, bt];
      });
    }
  };

  const toggleHobby = (h: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );
  };

  const togglePriority = (key: string) => {
    setPriorities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col px-5 pb-8"
    >
      {/* Progress */}
      <div className="pt-6 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => router.back()} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs text-text-secondary">ステップ 2/3</span>
        </div>
        <div className="flex gap-1.5">
          <div className="h-1 flex-1 rounded-full bg-coral" />
          <div className="h-1 flex-1 rounded-full bg-coral" />
          <div className="h-1 flex-1 rounded-full bg-navy-light" />
        </div>
      </div>

      <h1 className="text-lg font-bold text-text-primary mb-1">
        相手に求める条件
      </h1>
      <p className="text-xs text-text-secondary mb-6">
        マッチングの精度が上がります
      </p>

      <div className="space-y-6 flex-1 overflow-y-auto">
        {/* Age range */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-text-secondary">年齢</label>
            <button
              onClick={() => togglePriority("age")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                priorities.age ? "bg-coral/20 text-coral" : "bg-navy-light text-text-secondary"
              }`}
            >
              {priorities.age ? "重視する" : "こだわらない"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-primary w-8">{ageRange[0]}</span>
            <input
              type="range"
              min={18}
              max={50}
              value={ageRange[0]}
              onChange={(e) => setAgeRange([Math.min(Number(e.target.value), ageRange[1]), ageRange[1]])}
              className="flex-1"
            />
            <span className="text-xs text-text-secondary">〜</span>
            <input
              type="range"
              min={18}
              max={50}
              value={ageRange[1]}
              onChange={(e) => setAgeRange([ageRange[0], Math.max(Number(e.target.value), ageRange[0])])}
              className="flex-1"
            />
            <span className="text-sm text-text-primary w-8">{ageRange[1]}</span>
          </div>
        </div>

        {/* Body type */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-text-secondary">体型</label>
            <button
              onClick={() => togglePriority("bodyType")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                priorities.bodyType ? "bg-coral/20 text-coral" : "bg-navy-light text-text-secondary"
              }`}
            >
              {priorities.bodyType ? "重視する" : "こだわらない"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {bodyTypeOptions.map((bt) => (
              <button
                key={bt}
                onClick={() => toggleBodyType(bt)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedBodyTypes.includes(bt)
                    ? "bg-coral text-white"
                    : "bg-navy-light text-text-secondary border border-border-subtle hover:border-coral/30"
                }`}
              >
                {bt}
              </button>
            ))}
          </div>
        </div>

        {/* Height range */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-text-secondary">身長 (cm)</label>
            <button
              onClick={() => togglePriority("height")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                priorities.height ? "bg-coral/20 text-coral" : "bg-navy-light text-text-secondary"
              }`}
            >
              {priorities.height ? "重視する" : "こだわらない"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-primary w-10">{heightRange[0]}</span>
            <input
              type="range"
              min={140}
              max={200}
              value={heightRange[0]}
              onChange={(e) => setHeightRange([Math.min(Number(e.target.value), heightRange[1]), heightRange[1]])}
              className="flex-1"
            />
            <span className="text-xs text-text-secondary">〜</span>
            <input
              type="range"
              min={140}
              max={200}
              value={heightRange[1]}
              onChange={(e) => setHeightRange([heightRange[0], Math.max(Number(e.target.value), heightRange[0])])}
              className="flex-1"
            />
            <span className="text-sm text-text-primary w-10">{heightRange[1]}</span>
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-text-secondary">趣味</label>
            <button
              onClick={() => togglePriority("hobbies")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                priorities.hobbies ? "bg-coral/20 text-coral" : "bg-navy-light text-text-secondary"
              }`}
            >
              {priorities.hobbies ? "重視する" : "こだわらない"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hobbyOptions.map((h) => (
              <button
                key={h}
                onClick={() => toggleHobby(h)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedHobbies.includes(h)
                    ? "bg-teal text-navy"
                    : "bg-navy-light text-text-secondary border border-border-subtle hover:border-teal/30"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-text-secondary">距離</label>
            <button
              onClick={() => togglePriority("distance")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                priorities.distance ? "bg-coral/20 text-coral" : "bg-navy-light text-text-secondary"
              }`}
            >
              {priorities.distance ? "重視する" : "こだわらない"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={5}
              max={50}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-text-primary w-14 text-right">〜{distance}km</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/onboarding/personality")}
        className="mt-6 w-full bg-coral hover:bg-coral-hover text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        次へ
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}
