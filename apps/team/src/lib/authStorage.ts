/**
 * Client-side auth persistence. Stores tokens in localStorage
 * so they survive reloads and can be read by the app (e.g. for protected routes).
 * Uses appConstants for token keys so it stays in sync with the rest of the app.
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
        refreshToken
      );
    }
  },
  clearAuth() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(appConstants.LOCAL_COOKIE_NAME);
    localStorage.removeItem(appConstants.LOCAL_REFRESH_COOKIE_NAME);
    localStorage.removeItem(appConstants.LOCAL_USER_DATA);
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
  /** Get user data from localStorage. */
  getUserData(): unknown | null {
    if (typeof window === "undefined") return null;
    const rawUserData = localStorage.getItem(appConstants.LOCAL_USER_DATA);
    if (!rawUserData) return null;

    try {
      return JSON.parse(rawUserData);
    } catch {
      return null;
    }
  },
  /** Clear user data from localStorage. */
  clearUserData() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(appConstants.LOCAL_USER_DATA);
  },
};
