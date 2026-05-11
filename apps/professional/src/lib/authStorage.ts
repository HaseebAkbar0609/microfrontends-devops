/**
 * Client-side auth persistence. Stores tokens in localStorage
 * so they survive reloads and can be read by the app (e.g. for protected routes).
 * Uses appConstants for token keys so it stays in sync with the rest of the app.
 */
import { appConstants } from "@/constants/api";
import { clearRequiresSubscriptionCookie } from "@/lib/requiresSubscriptionCookie";
import {
	clearSessionHintCookie,
	setSessionHintCookie,
} from "@/lib/sessionHintCookie";

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
      setSessionHintCookie(Boolean(accessToken?.trim()));
    }
  },
  setRefreshToken(refreshToken: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        appConstants.LOCAL_REFRESH_COOKIE_NAME,
        refreshToken
      );
    }
  },
  clearAuth() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(appConstants.LOCAL_COOKIE_NAME);
    localStorage.removeItem(appConstants.LOCAL_REFRESH_COOKIE_NAME);
    localStorage.removeItem(appConstants.LOCAL_USER_DATA);
    clearRequiresSubscriptionCookie();
    clearSessionHintCookie();
  },
  /** Clear tokens and cached user (full client sign-out). */
  clearSession() {
    this.clearAuth();
  },
  /** Set user data in localStorage. */
  setUserData(user: unknown) {
    if (typeof window !== "undefined") {
      localStorage.setItem(appConstants.LOCAL_USER_DATA, JSON.stringify(user));
    }
  },
  setCompanyData(company: unknown) {
    if (typeof window !== "undefined") {
      localStorage.setItem(appConstants.LOCAL_COMPANY_DATA, JSON.stringify(company));
    }
  },
  /** Get user data from localStorage. */
  getUserData(): unknown | null {
    if (typeof window === "undefined") return null;
    return JSON.parse(
      localStorage.getItem(appConstants.LOCAL_USER_DATA) ?? "{}"
    );
  },
  getCompanyData(): unknown | null {
    if (typeof window === "undefined") return null;
    return JSON.parse(
      localStorage.getItem(appConstants.LOCAL_COMPANY_DATA) ?? "{}"
    );
  },
  /** Clear user data from localStorage. */
  clearUserData() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(appConstants.LOCAL_USER_DATA);
  },
};
