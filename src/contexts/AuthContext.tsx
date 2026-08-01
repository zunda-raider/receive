"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { currentUser, personalityResult, type UserProfile, type PersonalityScores } from "@/lib/mock-data";

interface AuthState {
  isLoggedIn: boolean;
  isOnboarded: boolean;
  user: UserProfile;
  personalityScores: PersonalityScores;
}

interface AuthContextType extends AuthState {
  login: (asNewUser: boolean) => void;
  logout: () => void;
  completeOnboarding: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  updatePersonalityScores: (scores: PersonalityScores) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    isOnboarded: false,
    user: currentUser,
    personalityScores: personalityResult,
  });
  const [hydrated, setHydrated] = useState(false);

  // Restore from sessionStorage
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = sessionStorage.getItem("auth-state");
        if (saved) {
          setState(JSON.parse(saved));
        }
      } catch {}
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist to sessionStorage
  useEffect(() => {
    if (hydrated) {
      sessionStorage.setItem("auth-state", JSON.stringify(state));
    }
  }, [state, hydrated]);

  const login = useCallback((asNewUser: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoggedIn: true,
      isOnboarded: !asNewUser,
    }));
  }, []);

  const logout = useCallback(() => {
    setState({
      isLoggedIn: false,
      isOnboarded: false,
      user: currentUser,
      personalityScores: personalityResult,
    });
    sessionStorage.removeItem("auth-state");
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, isOnboarded: true }));
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setState((prev) => ({ ...prev, user: { ...prev.user, ...updates } }));
  }, []);

  const updatePersonalityScores = useCallback((scores: PersonalityScores) => {
    setState((prev) => ({ ...prev, personalityScores: scores }));
  }, []);

  if (!hydrated) {
    return null; // Avoid hydration mismatch
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        completeOnboarding,
        updateUser,
        updatePersonalityScores,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
