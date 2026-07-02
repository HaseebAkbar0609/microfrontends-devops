/**
 * Client-side auth persistence. Stores token and user in localStorage
 * so they survive reloads and can be read by the app (e.g. for protected routes).
 * Uses appConstants for token key so it stays in sync with the rest of the app.
 */
import { appConstants } from "@/constants/api";

export const authStorage = {
	getAccessToken(): string | null {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(appConstants.LOCAL_COOKIE_NAME);
	},
	getRefreshToken(): string | null {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(appConstants.LOCAL_REFRESH_COOKIE_NAME);
	},
	/** Persist auth token using the app's cookie name constant (SSR-safe: no-op when window is undefined). */
	setAuthData(accessToken: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem(appConstants.LOCAL_COOKIE_NAME, accessToken);
		}
	},
	setRefreshToken(refreshToken: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem(
				appConstants.LOCAL_REFRESH_COOKIE_NAME,
				refreshToken,
			);
		}
	},
	clearAuth() {
		if (typeof window === "undefined") return;
		localStorage.removeItem(appConstants.LOCAL_COOKIE_NAME);
		localStorage.removeItem(appConstants.LOCAL_REFRESH_COOKIE_NAME);
	},
	/** Clear tokens and cached user (full client sign-out). */
	clearSession() {
		this.clearAuth();
		if (typeof window !== "undefined") {
			localStorage.removeItem("user");
		}
	},
	/** Persist user object for display/permissions (SSR-safe: no-op when window is undefined). */
	setUserData(user: unknown) {
		if (typeof window !== "undefined") {
			localStorage.setItem("user", JSON.stringify(user));
		}
	},
	getUserData(): unknown | null {
		if (typeof window === "undefined") return null;
		const user = localStorage.getItem("user");
		try {
			return user ? JSON.parse(user) : null;
		} catch {
			return null;
		}
	},
};
