"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, MessageSquareText, Brain, User } from "lucide-react";

const tabs = [
  { href: "/home", icon: Home, label: "ホーム" },
  { href: "/recommend", icon: Users, label: "レコメンド" },
  { href: "/talk-analysis", icon: MessageSquareText, label: "トーク" },
  { href: "/self-analysis", icon: Brain, label: "自己分析" },
  { href: "/profile", icon: User, label: "プロフィール" },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[480px]">
        <div
          className="flex items-center justify-around py-2 px-1"
          style={{
            background: "rgba(20, 28, 46, 0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors ${
                  isActive
                    ? "text-coral"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
