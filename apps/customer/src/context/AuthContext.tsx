"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUserInfo } from "@/types/api";

import { authStorage } from "@/lib/authStorage";
import { setSessionHintCookie } from "@/lib/sessionHintCookie";

export type AuthContextType = {
	accessToken: string | null;
	user: AuthUserInfo | null;
	isAuthenticated: boolean;
	isReady: boolean;
	setAccessToken: (value: string | null) => void;
	setUser: (value: AuthUserInfo | null) => void;
	clearSession: () => void;
	hydrateFromStorage: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [accessToken, setAccessTokenState] = useState<string | null>(null);
	const [user, setUserState] = useState<AuthUserInfo | null>(null);
	const [isReady, setIsReady] = useState(false);

	const hydrateFromStorage = () => {
		const token = authStorage.getAccessToken();
		const storedUser = authStorage.getUserData() as AuthUserInfo | null;
		setSessionHintCookie(!!token);
		setAccessTokenState(token);
		if (storedUser) {
			setUserState(storedUser);
		}
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

	const setUser = (value: AuthUserInfo | null) => {
		authStorage.setUserData(value);
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
		[accessToken, isReady, user],
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuthStatus() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthStatus must be used within AuthProvider");
	}
	return context;
}
