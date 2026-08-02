"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, MessageSquareText, HeartHandshake, Brain, User } from "lucide-react";

const tabs = [
  { href: "/home", icon: Home, label: "ホーム" },
  { href: "/recommend", icon: Users, label: "レコメンド" },
  { href: "/talk-analysis", icon: MessageSquareText, label: "トーク" },
  { href: "/date", icon: HeartHandshake, label: "デート" },
  { href: "/self-analysis", icon: Brain, label: "自己分析" },
  { href: "/profile", icon: User, label: "プロフィール" },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[480px]">
        <div
          className="flex items-center justify-around px-1 py-2.5 border-t border-gold-soft/50"
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`min-w-0 flex-1 flex flex-col items-center gap-0.5 px-0.5 py-1 transition-colors ${
                  isActive ? "text-coral" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <tab.icon size={18} strokeWidth={isActive ? 2.3 : 1.7} />
                <span className="whitespace-nowrap text-[9px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
