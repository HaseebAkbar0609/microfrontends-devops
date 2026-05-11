"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { authStorage } from "@/lib/authStorage";

export type AuthContextType = {
  accessToken: string | null;
  user: unknown;
  isAuthenticated: boolean;
  isReady: boolean;
  setAccessToken: (value: string | null) => void;
  setUser: (value: unknown) => void;
  clearSession: () => void;
  hydrateFromStorage: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<unknown>(null);
  const [isReady, setIsReady] = useState(false);

  const hydrateFromStorage = () => {
    setAccessTokenState(authStorage.getAccessToken());
    setUserState(authStorage.getUserData());
  };

  useEffect(() => {
    hydrateFromStorage();
    setIsReady(true);
  }, []);

  const setAccessToken = (value: string | null) => {
    if (!value) {
      authStorage.clearAuth();
      setAccessTokenState(null);
      return;
    }
    authStorage.setAuthData(value);
    setAccessTokenState(value);
  };

  const setUser = (value: unknown) => {
    setUserState(value);
  };

  const clearSession = () => {
    authStorage.clearSession();
    setAccessTokenState(null);
    setUserState(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      accessToken,
      user,
      isAuthenticated: !!accessToken,
      isReady,
      setAccessToken,
      setUser,
      clearSession,
      hydrateFromStorage,
    }),
    [accessToken, isReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStatus() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthStatus must be used within AuthProvider");
  }
  return context;
}
