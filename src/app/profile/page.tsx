"use client";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import BottomTabBar from "@/components/BottomTabBar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import GeneratedAvatar from "@/components/GeneratedAvatar";
import { Edit3, Check, Globe } from "lucide-react";
import { hobbyOptions } from "@/lib/mock-data";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValues({ ...editValues, [field]: value });
  };

  const saveEdit = (field: string) => {
    updateUser({ [field]: field === "age" || field === "height" ? Number(editValues[field]) : editValues[field] });
    setEditingField(null);
  };

  const [editHobbies, setEditHobbies] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState(user.hobbies);

  const fields = [
    { key: "nickname", label: "ニックネーム", value: user.nickname },
    { key: "age", label: "年齢", value: String(user.age) },
    { key: "location", label: "居住地", value: user.location },
    { key: "job", label: "職業", value: user.job },
    { key: "height", label: "身長", value: `${user.height}cm` },
    { key: "bodyType", label: "体型", value: user.bodyType },
  ];

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-5 pb-24 pt-6"
      >
        {/* Public label */}
        <div className="flex items-center gap-2 mb-4">
          <Globe size={14} className="text-teal" />
          <span className="text-xs text-teal font-medium">公開情報</span>
        </div>

        <h1 className="text-lg font-bold text-text-primary mb-5">公開プロフィール</h1>

        {/* Preview card (how others see you) */}
        <div className="bg-navy-card rounded-[20px] p-4 border border-border-subtle mb-6">
          <p className="text-[10px] text-text-secondary mb-3 uppercase tracking-wider">相手からの見え方</p>
          <div className="flex items-start gap-3">
            <GeneratedAvatar name={user.nickname} size={56} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h3 className="font-bold text-text-primary text-sm">{user.nickname}</h3>
                <span className="text-xs text-text-secondary">{user.age}歳</span>
              </div>
              <p className="text-xs text-text-secondary">{user.location} ・ {user.job}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {user.hobbies.slice(0, 3).map((h) => (
                  <span key={h} className="px-2 py-0.5 rounded-full bg-navy-light text-[10px] text-text-secondary">
                    {h}
                  </span>
                ))}
                {user.hobbies.length > 3 && (
                  <span className="text-[10px] text-text-secondary">+{user.hobbies.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.key} className="bg-navy-card rounded-xl p-3 border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-text-secondary">{f.label}</p>
                  {editingField === f.key ? (
                    <input
                      value={editValues[f.key] ?? ""}
                      onChange={(e) => setEditValues({ ...editValues, [f.key]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(f.key)}
                      autoFocus
                      className="bg-navy-light border border-coral/30 rounded-lg px-2 py-1 text-sm text-text-primary focus:outline-none mt-1 w-full"
                    />
                  ) : (
                    <p className="text-sm text-text-primary font-medium">{f.value}</p>
                  )}
                </div>
                {editingField === f.key ? (
                  <button onClick={() => saveEdit(f.key)} className="text-teal">
                    <Check size={16} />
                  </button>
                ) : (
                  <button onClick={() => startEdit(f.key, f.key === "height" ? String(user.height) : f.value)} className="cursor-pointer text-text-secondary hover:text-text-primary">
                    <Edit3 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Hobbies */}
          <div className="bg-navy-card rounded-xl p-3 border border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-text-secondary">趣味</p>
              <button
                onClick={() => {
                  if (editHobbies) {
                    updateUser({ hobbies: selectedHobbies });
                  }
                  setEditHobbies(!editHobbies);
                }}
                className={editHobbies ? "text-teal" : "cursor-pointer text-text-secondary hover:text-text-primary"}
              >
                {editHobbies ? <Check size={14} /> : <Edit3 size={14} />}
              </button>
            </div>
            {editHobbies ? (
              <div className="flex flex-wrap gap-1.5">
                {hobbyOptions.map((h) => (
                  <button
                    key={h}
                    onClick={() =>
                      setSelectedHobbies((prev) =>
                        prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
                      )
                    }
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      selectedHobbies.includes(h)
                        ? "bg-coral text-white"
                        : "bg-navy-light text-text-secondary"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {user.hobbies.map((h) => (
                  <span key={h} className="px-2.5 py-1 rounded-full bg-navy-light text-[11px] text-text-secondary">
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="bg-navy-card rounded-xl p-3 border border-border-subtle">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-text-secondary">自己紹介文</p>
              {editingField === "bio" ? (
                <button onClick={() => saveEdit("bio")} className="text-teal">
                  <Check size={14} />
                </button>
              ) : (
                <button onClick={() => startEdit("bio", user.bio)} className="cursor-pointer text-text-secondary hover:text-text-primary">
                  <Edit3 size={14} />
                </button>
              )}
            </div>
            {editingField === "bio" ? (
              <textarea
                value={editValues.bio ?? ""}
                onChange={(e) => setEditValues({ ...editValues, bio: e.target.value })}
                autoFocus
                rows={3}
                className="w-full bg-navy-light border border-coral/30 rounded-lg px-2 py-1 text-sm text-text-primary focus:outline-none resize-none"
              />
            ) : (
              <p className="text-sm text-text-primary leading-relaxed">{user.bio}</p>
            )}
          </div>
        </div>
      </motion.div>
      <BottomTabBar />
    </AuthGuard>
  );
}
