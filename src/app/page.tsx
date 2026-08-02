"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    num: "01",
    title: "相手を知る",
    description: "性格分析に基づくマッチング。相性の理由まで分かる",
  },
  {
    num: "02",
    title: "自分を知る",
    description: "恋愛傾向・行動パターンを読み解き、気づきを得る",
  },
  {
    num: "03",
    title: "会話を整える",
    description: "トーク画面を分析し、次の一手を提案する",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col px-7 overflow-hidden">
      {/* Soft blush atmosphere — color sweetness, not dark luxury pink */}
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full opacity-70"
        style={{ background: "radial-gradient(circle, #FCE9E6 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-10 -left-20 h-64 w-64 rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, #FFE4D6 0%, transparent 70%)" }}
      />

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 pt-14"
      >
        <p className="font-label text-gold mb-3">Invitation</p>
        <p className="font-display text-display text-text-primary">AIme</p>
        <div className="rule mt-5 w-14" />
      </motion.header>

      <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="font-display text-heading text-text-primary mb-5"
        >
          出会いを、
          <br />
          言葉の手前から整える。
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="text-text-secondary text-[15px] leading-[26px] mb-9 max-w-[300px]"
        >
          性格・会話・日々の選択から、あなたらしい関係の進み方を一緒に考えます。
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.42 }}
        >
          <Link
            href="/login"
            className="btn-gradient inline-flex items-center justify-center font-semibold text-sm px-10 py-3.5"
          >
            はじめる
          </Link>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="relative z-10 pb-12"
      >
        <div className="surface-card px-6 py-7">
          <p className="font-label text-gold mb-5">Features</p>
          <ul className="space-y-5">
            {features.map((f) => (
              <li key={f.num} className="flex gap-4">
                <span className="font-display text-sm text-coral shrink-0 w-7 pt-0.5">
                  {f.num}
                </span>
                <div>
                  <p className="text-[15px] font-medium text-text-primary mb-0.5">{f.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
