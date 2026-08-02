"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { hobbyOptions } from "@/lib/mock-data";

export default function OnboardingProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState(user.nickname);
  const [goal, setGoal] = useState(user.goal ?? "");
  const [age, setAge] = useState(String(user.age));
  const [location, setLocation] = useState(user.location);
  const [job, setJob] = useState(user.job);
  const [height, setHeight] = useState(String(user.height));
  const [bodyType, setBodyType] = useState(user.bodyType);
  const [hobbies, setHobbies] = useState<string[]>(user.hobbies);
  const [bio, setBio] = useState(user.bio);

  const bodyTypes = ["スリム", "やや細め", "普通", "グラマー", "ぽっちゃり"];

  const toggleHobby = (h: string) => {
    setHobbies((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );
  };

  const handleNext = () => {
    updateUser({
      nickname,
      goal,
      age: Number(age),
      location,
      job,
      height: Number(height),
      bodyType,
      hobbies,
      bio,
    });
    router.push("/onboarding/preferences");
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
          <span className="text-xs text-text-secondary">ステップ 1/3</span>
        </div>
        <div className="flex gap-1.5">
          <div className="h-1 flex-1 rounded-full bg-coral" />
          <div className="h-1 flex-1 rounded-full bg-navy-light" />
          <div className="h-1 flex-1 rounded-full bg-navy-light" />
        </div>
      </div>

      <h1 className="text-lg font-bold text-text-primary mb-1">
        プロフィールを入力
      </h1>
      <p className="text-xs text-text-secondary mb-6">
        あなたについて教えてください
      </p>

      <div className="space-y-4 flex-1">
        {/* Nickname */}
        <div>
          <label className="block text-xs text-text-secondary mb-1">ニックネーム</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-navy-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-coral/50"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-xs text-text-secondary mb-1">目標</label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="例：10月末までに、自然体で話せる相手と3回デートする"
            rows={2}
            maxLength={100}
            className="w-full bg-navy-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-coral/50 resize-none"
          />
          <p className="mt-1 text-[10px] text-text-secondary">
            期限や実現したいことを、自由に書いてください
          </p>
        </div>

        {/* Age + Location */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-text-secondary mb-1">年齢</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-navy-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-coral/50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-text-secondary mb-1">居住地</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-navy-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-coral/50"
            />
          </div>
        </div>

        {/* Job */}
        <div>
          <label className="block text-xs text-text-secondary mb-1">職業</label>
          <input
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="w-full bg-navy-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-coral/50"
          />
        </div>

        {/* Height + Body type */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-text-secondary mb-1">身長 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-navy-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-coral/50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-text-secondary mb-1">体型</label>
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="w-full bg-navy-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-coral/50"
            >
              {bodyTypes.map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <label className="block text-xs text-text-secondary mb-2">趣味（複数選択）</label>
          <div className="flex flex-wrap gap-2">
            {hobbyOptions.map((h) => (
              <button
                key={h}
                onClick={() => toggleHobby(h)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  hobbies.includes(h)
                    ? "bg-coral text-white"
                    : "bg-navy-light text-text-secondary border border-border-subtle hover:border-coral/30"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs text-text-secondary mb-1">自己紹介文</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full bg-navy-card border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-coral/50 resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleNext}
        className="btn-gradient mt-6 w-full text-white font-semibold py-3.5  flex items-center justify-center gap-2"
      >
        次へ
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}
