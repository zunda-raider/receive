"use client";
import { useState, useRef } from "react";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import { motion } from "framer-motion";
import { UploadCloud, Image as ImageIcon, Camera, AlertCircle, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { talkAnalysisResult } from "@/lib/mock-data";

export default function TalkAnalysisPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof talkAnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(talkAnalysisResult);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      startAnalysis();
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AuthGuard>
      <div className="flex-1 px-5 pb-24 pt-6 flex flex-col min-h-screen">
        <h1 className="text-lg font-bold text-text-primary mb-2">トーク分析</h1>
        
        {!result && !analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col justify-center gap-6 pb-20"
          >
            <p className="text-xs text-text-secondary text-center leading-relaxed">
              相手とのトーク画面のスクリーンショットをアップロードして、
              <br />会話の傾向と次の一手をAIが分析します。
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border-subtle hover:border-coral/50 bg-navy-card rounded-[24px] p-8 flex flex-col items-center justify-center cursor-pointer transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-navy-light flex items-center justify-center mb-4">
                <UploadCloud size={28} className="text-teal" />
              </div>
              <p className="text-sm font-semibold text-text-primary mb-1">画像をアップロード</p>
              <p className="text-[11px] text-text-secondary">PNG, JPG (最大10MB)</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-navy-light hover:bg-navy-light/80 text-text-primary font-medium py-3.5 rounded-xl border border-border-subtle transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <ImageIcon size={18} />
                ライブラリから選択
              </button>
              <button
                onClick={startAnalysis}
                className="flex-1 bg-coral hover:bg-coral-hover text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-coral/20"
              >
                <Camera size={18} />
                サンプルで見る
              </button>
            </div>
          </motion.div>
        )}

        {analyzing && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-20">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-navy-light animate-[spin_3s_linear_infinite]" />
              <div
                className="absolute inset-0 rounded-full border-4 border-t-coral border-r-teal border-b-transparent border-l-transparent animate-[spin_1s_linear_infinite]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={24} className="text-coral animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-text-primary">分析中...</p>
              <p className="text-xs text-text-secondary">会話のテンポと発話量を計算しています</p>
            </div>
          </div>
        )}

        {result && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col gap-5"
          >
            {/* Action to reset */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-text-secondary">分析が完了しました</p>
              <button onClick={() => setResult(null)} className="text-xs text-coral font-medium">
                やり直す
              </button>
            </div>

            {/* Temperature Gauge */}
            <div className="bg-navy-card rounded-[20px] p-5 border border-border-subtle flex flex-col items-center text-center">
              <h2 className="text-xs text-text-secondary font-medium mb-3">会話の温度</h2>
              <div className="relative w-32 h-32 mb-2">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <path
                    d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"
                    fill="none"
                    stroke="#1A2540"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(result.temperature / 100) * 251.2}, 251.2`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ECDC4" />
                      <stop offset="100%" stopColor="#FF7A59" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-text-primary leading-none">
                    {result.temperature}
                  </span>
                  <span className="text-[10px] text-text-secondary mt-1">/100</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-teal">{result.temperatureLabel}</p>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="bg-coral/10 rounded-xl p-4 border border-coral/20 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-coral" />
                  <h3 className="text-xs font-semibold text-coral">気をつけるポイント</h3>
                </div>
                <ul className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="text-[11px] text-text-primary leading-relaxed flex items-start gap-1.5">
                      <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-coral" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-navy-card rounded-xl p-3 border border-border-subtle">
                <p className="text-[10px] text-text-secondary mb-1">返信間隔</p>
                <p className="text-[11px] font-medium text-text-primary">{result.metrics.replyInterval}</p>
              </div>
              <div className="bg-navy-card rounded-xl p-3 border border-border-subtle">
                <p className="text-[10px] text-text-secondary mb-1">メッセージ量</p>
                <p className="text-[11px] font-medium text-text-primary">{result.metrics.messageRatio}</p>
              </div>
              <div className="bg-navy-card rounded-xl p-3 border border-border-subtle">
                <p className="text-[10px] text-text-secondary mb-1">質問の数</p>
                <p className="text-[11px] font-medium text-text-primary">{result.metrics.questionCount}</p>
              </div>
              <div className="bg-navy-card rounded-xl p-3 border border-border-subtle">
                <p className="text-[10px] text-text-secondary mb-1">話題の広がり</p>
                <p className="text-[11px] font-medium text-text-primary">{result.metrics.topicSpread}</p>
              </div>
            </div>

            {/* Topics */}
            <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle">
              <h3 className="text-xs text-text-secondary font-medium mb-3">相手の関心が高かった話題</h3>
              <div className="flex flex-wrap gap-2">
                {result.interestedTopics.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full bg-teal/10 text-xs text-teal font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3 mt-2 flex items-center gap-2">
                <Sparkles size={16} className="text-coral" />
                次の一手の提案
              </h3>
              <div className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="bg-navy-card rounded-xl p-4 border border-border-subtle relative overflow-hidden group">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm text-text-primary font-medium">{s.text}</p>
                      <button
                        onClick={() => handleCopy(s.text, i)}
                        className={`shrink-0 p-2 rounded-lg transition-colors ${
                          copiedIndex === i
                            ? "bg-teal/20 text-teal"
                            : "bg-navy-light text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {copiedIndex === i ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed bg-navy-light/50 p-2 rounded-lg border border-border-subtle">
                      <span className="text-teal font-medium">Why?</span> {s.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <BottomTabBar />
    </AuthGuard>
  );
}
