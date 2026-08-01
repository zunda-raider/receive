"use client";
import { useState, useRef, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ShieldAlert, Send, Bot, User } from "lucide-react";
import {
  selfAnalysisTrends,
  selfAnalysisPatterns,
  selfAnalysisStrengths,
  selfAnalysisChallenges,
  selfAnalysisSummary,
  chatMessages as initialMessages,
  chatResponses,
  personalityLabels,
} from "@/lib/mock-data";
import type { PersonalityScores } from "@/lib/mock-data";

export default function SelfAnalysisPage() {
  const { personalityScores } = useAuth();
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>(initialMessages);
  const [input, setInput] = useState("");
  const [responseIdx, setResponseIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = chatResponses[responseIdx % chatResponses.length];
      setMessages((prev) => [...prev, { role: "ai" as const, text: response }]);
      setResponseIdx((i) => i + 1);
      setIsTyping(false);
    }, 1500);
  };

  // Personality summary line
  const topAxes = (Object.keys(personalityScores) as (keyof PersonalityScores)[])
    .sort((a, b) => personalityScores[b] - personalityScores[a])
    .slice(0, 2)
    .map((k) => personalityLabels[k]);

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col px-5 pb-24 pt-6"
      >
        {/* Banner */}
        <div className="bg-coral/10 rounded-xl px-3 py-2 flex items-center gap-2 mb-4">
          <ShieldAlert size={16} className="text-coral shrink-0" />
          <p className="text-xs text-coral">この内容は相手には公開されません</p>
        </div>

        <h1 className="text-lg font-bold text-text-primary mb-2">自己分析</h1>

        {/* Summary */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-4">
          <p className="text-xs text-teal font-medium mb-1">統合サマリー</p>
          <p className="text-sm text-text-primary leading-relaxed mb-2">{selfAnalysisSummary}</p>
          <p className="text-[11px] text-text-secondary">
            性格診断の強み: {topAxes.join("・")}
          </p>
        </div>

        {/* Chat UI */}
        <div className="bg-navy-card rounded-[20px] border border-border-subtle mb-4 flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-border-subtle">
            <p className="text-xs text-text-secondary font-medium">AIインタビュー</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[280px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-teal/20 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-teal" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-coral text-white rounded-br-sm"
                      : "bg-navy-light text-text-primary rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-coral/20 flex items-center justify-center shrink-0">
                    <User size={14} className="text-coral" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-teal/20 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-teal" />
                </div>
                <div className="bg-navy-light rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="px-3 py-2 border-t border-border-subtle flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="回答を入力..."
              className="flex-1 bg-navy-light rounded-xl px-3 py-2 text-xs text-text-primary placeholder-text-secondary focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-coral hover:bg-coral-hover disabled:opacity-40 text-white rounded-xl px-3 py-2 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Analysis results */}
        <h2 className="text-sm font-semibold text-text-primary mb-3">分析結果</h2>

        {/* Trends */}
        <div className="space-y-3 mb-4">
          {selfAnalysisTrends.map((trend) => (
            <div key={trend.label} className="bg-navy-card rounded-xl p-3 border border-border-subtle">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-text-primary font-medium">{trend.label}</p>
                <span className="text-xs text-teal font-semibold">{trend.value}%</span>
              </div>
              <div className="h-1.5 bg-navy-light rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal to-coral"
                  style={{ width: `${trend.value}%` }}
                />
              </div>
              <p className="text-[10px] text-text-secondary">{trend.description}</p>
            </div>
          ))}
        </div>

        {/* Patterns */}
        <h3 className="text-xs text-text-secondary font-medium mb-2">繰り返すパターン</h3>
        <div className="space-y-2 mb-4">
          {selfAnalysisPatterns.map((p) => (
            <div key={p.title} className="bg-navy-card rounded-xl p-3 border border-border-subtle">
              <p className="text-xs text-text-primary font-semibold mb-1">{p.title}</p>
              <p className="text-[11px] text-text-secondary leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        {/* Strengths / Challenges */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h3 className="text-xs text-teal font-medium mb-2">強み</h3>
            <div className="flex flex-wrap gap-1.5">
              {selfAnalysisStrengths.map((s) => (
                <span key={s} className="px-2 py-1 rounded-full bg-teal/10 text-[10px] text-teal">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs text-coral font-medium mb-2">課題</h3>
            <div className="flex flex-wrap gap-1.5">
              {selfAnalysisChallenges.map((c) => (
                <span key={c} className="px-2 py-1 rounded-full bg-coral/10 text-[10px] text-coral">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <BottomTabBar />
    </AuthGuard>
  );
}
