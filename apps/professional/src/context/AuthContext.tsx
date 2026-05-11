"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { authStorage } from "@/lib/authStorage";

export type AuthContextType = {
  accessToken: string | null;
  user: unknown;
  company: Company | null;
  isAuthenticated: boolean;
  isReady: boolean;
  setAccessToken: (value: string | null) => void;
  setUser: (value: User | null) => void;
  setCompany: (value: Company | null) => void;
  clearSession: () => void;
  hydrateFromStorage: () => void;
};

export type Company = {
  id: string;
  company_category: string;
  company_name: string;
  created_at: number | null;
  organization_number: string;
  updated_at: number | null;
};

export type User = {
  city: string;
  country: string;
  id: string;
  phone_number: string;
  postal_code: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [company, setCompanyState] = useState<Company | null>(null);
  const [isReady, setIsReady] = useState(false);

  const hydrateFromStorage = useCallback(() => {
    setAccessTokenState(authStorage.getAccessToken());
    setUserState(authStorage.getUserData() as User);
    setCompanyState(authStorage.getCompanyData() as Company);
  }, []);

  useEffect(() => {
    hydrateFromStorage();
    setIsReady(true);
  }, [hydrateFromStorage]);

  const setAccessToken = useCallback((value: string | null) => {
    if (!value) {
      authStorage.clearAuth();
      setAccessTokenState(null);
      return;
    }
    authStorage.setAuthData(value);
    setAccessTokenState(value);
  }, []);

  const setUser = useCallback((value: User | null) => {
    setUserState(value);
  }, []);

  const setCompany = useCallback((value: Company | null) => {
    setCompanyState(value);
  }, []);

  const clearSession = useCallback(() => {
    authStorage.clearAuth();
    setAccessTokenState(null);
    setUserState(null);
    setCompanyState(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      accessToken,
      user,
      company,
      isAuthenticated: !!accessToken,
      isReady,
      setAccessToken,
      setUser,
      setCompany,
      clearSession,
      hydrateFromStorage,
    }),
    [
      accessToken,
      isReady,
      user,
      company,
      clearSession,
      hydrateFromStorage,
      setAccessToken,
      setCompany,
      setUser,
    ]
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
