"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, Brain, MessageSquareText } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "相手を知る",
    description: "性格分析に基づくマッチング。相性の理由まで分かる",
  },
  {
    icon: Brain,
    title: "自分を知る",
    description: "恋愛傾向・行動パターンをAIが分析。気づきを得る",
  },
  {
    icon: MessageSquareText,
    title: "会話を整える",
    description: "トーク画面を分析し、次の一手を提案する",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-[#0D1A30] to-[#0B1220]" />
        <div
          className="aurora-blob absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #FF7A59 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "10%",
            left: "-10%",
          }}
        />
        <div
          className="aurora-blob-2 absolute w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #4ECDC4 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "30%",
            right: "-15%",
          }}
        />
        <div
          className="aurora-blob-3 absolute w-[350px] h-[350px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #667eea 0%, transparent 70%)",
            filter: "blur(80px)",
            bottom: "20%",
            left: "20%",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="pt-12 pb-2"
        >
          <span className="text-sm font-semibold tracking-widest text-coral uppercase">
            MatchCoach
          </span>
        </motion.div>

        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center py-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold leading-tight text-text-primary mb-4"
          >
            マッチングを、
            <br />
            <span className="text-coral">もっと賢く。</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-text-secondary text-base leading-relaxed mb-8 max-w-[320px]"
          >
            自己分析・相性診断・トーク改善。
            <br />
            データに基づいて、あなたの恋愛を支援します。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-coral hover:bg-coral-hover text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-coral/20"
            >
              はじめる
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Feature cards (horizontal scroll) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="pb-12"
        >
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-4">
            できること
          </p>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[200px] bg-navy-card rounded-[20px] p-5 border border-border-subtle"
              >
                <div className="w-10 h-10 rounded-xl bg-navy-light flex items-center justify-center mb-3">
                  <f.icon size={20} className="text-teal" />
                </div>
                <h3 className="font-semibold text-text-primary text-sm mb-1">
                  {f.title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
