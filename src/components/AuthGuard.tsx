"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarded?: boolean;
}

export default function AuthGuard({ children, requireOnboarded = true }: AuthGuardProps) {
  const { isLoggedIn, isOnboarded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    } else if (requireOnboarded && !isOnboarded) {
      router.replace("/onboarding/profile");
    }
  }, [isLoggedIn, isOnboarded, requireOnboarded, router]);

  if (!isLoggedIn) return null;
  if (requireOnboarded && !isOnboarded) return null;

  return <>{children}</>;
}
