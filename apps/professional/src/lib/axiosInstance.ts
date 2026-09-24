import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
// Bare `i18next` singleton only — NOT `@/utils/localization`. That wrapper
// eagerly calls `.use(initReactI18next).init(...)` as a module-load side
// effect, which touches React internals (it creates a Context). This module
// is imported extremely broadly (every api-action goes through it), including
// during Next's server-side page-data collection pass, where that side
// effect crashes with "createContext is not a function" on unrelated pages.
// The bare package re-exports the exact same singleton instance that
// `@/utils/localization` configures elsewhere (in app/providers.tsx, which
// only ever runs in the browser) — by the time any interceptor here actually
// calls `.t()`, that instance is already initialized, so this is safe.
import i18n from "i18next";

import { BASE_API_VERSION } from "@/constants/api";
import { authStorage } from "@/lib/authStorage";
import { getUserLanguage } from "@/utils/userLanguage";
import localizationConstants from "@/utils/translation/constants";
import { ACCOUNT_EXPIRED_ERROR_CODE } from "@/types/lifecycle";
import { LIFECYCLE_UPGRADE_PATH } from "@/features/account-lifecycle/constants";
import { STAFF_LICENSE_ERROR_CODE } from "@/features/admin/users/live/license.constants";
import { setRequiresSubscriptionCookie } from "@/lib/requiresSubscriptionCookie";

const REFRESH_PATH = "/professionals/auth/refresh-token";

const AUTH_PATHS_NO_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/professionals/auth/refresh-token",
  "/auth/handoff/redeem",
];

function isPublicAuthUrl(url: string | undefined): boolean {
  if (!url) return false;
  return AUTH_PATHS_NO_REFRESH.some((p) => url.includes(p));
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/**
 * True for tfs-backend's stable "Demo/Trial account is read-only" error —
 * see tfs-backend/app/api/dependencies/entitlement.py and
 * tfs-backend/docs/account-lifecycle-design.md §4 for the contract. Any
 * write request can get this back once an account's Demo/Trial has expired;
 * the proactive UI guards (ContentCreationGuard, useCanCreateContent) exist
 * to avoid users hitting this in the first place, but the backend enforces
 * it regardless, so every write path needs to surface it clearly.
 */
function isAccountExpiredReadOnlyError(error: AxiosError): boolean {
  const data = error.response?.data as { message?: string } | undefined;
  return (
    error.response?.status === 403 &&
    data?.message === ACCOUNT_EXPIRED_ERROR_CODE
  );
}

let refreshPromise: Promise<string> | null = null;

async function callRefreshTokenAPI(): Promise<string> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) {
    authStorage.clearAuth();
    throw new Error("No refresh token");
  }

  const client = axios.create({
    baseURL: BASE_API_VERSION,
    headers: { "Content-Type": "application/json" },
  });

  const { data } = await client.post<{
    success?: boolean;
    message?: string;
    data?: {
      access_token?: string;
      refresh_token?: string;
    };
  }>(REFRESH_PATH, { refresh_token: refreshToken });

  const access = data?.data?.access_token;
  const newRefresh = data?.data?.refresh_token;

  if (!access) {
    authStorage.clearAuth();
    throw new Error(data?.message || "Token refresh failed");
  }

  authStorage.setAuthData(access);
  if (newRefresh) {
    authStorage.setRefreshToken(newRefresh);
  }

  return access;
}

export function ensureRefreshedAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = callRefreshTokenAPI().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

const axiosInstance = axios.create({
  baseURL: BASE_API_VERSION,
});

axiosInstance.interceptors.request.use((config) => {
  const lang = getUserLanguage();
  config.headers["Accept-Language"] = lang;

  if (typeof window === "undefined") return config;

  const rawToken = authStorage.getAccessToken();
  const token = rawToken?.trim() ?? "";
  const company = authStorage.getCompanyData();
  const companyId =
    company &&
    typeof company === "object" &&
    company !== null &&
    "id" in company &&
    typeof (company as { id: unknown }).id === "string"
      ? (company as { id: string }).id.trim()
      : "";

  if (token && !isPublicAuthUrl(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
    if (companyId) {
      config.headers["X-Company-ID"] = companyId;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const bodyStatus = response.data?.status;
    if (bodyStatus !== undefined && bodyStatus !== 200 && bodyStatus !== 201) {
      const message = response.data?.message || "Something went wrong";
      return Promise.reject({ response: { data: { message } } });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    const details = (error.response?.data as { details?: { code?: string } })?.details;
    if (error.response?.status === 403 && details?.code === STAFF_LICENSE_ERROR_CODE) {
      setRequiresSubscriptionCookie(true);
      if (typeof window !== "undefined" && window.location.pathname !== "/manage-plans") window.location.href = "/manage-plans";
      return Promise.reject(error);
    }

    if (isAccountExpiredReadOnlyError(error)) {
      toast.error(i18n.t(localizationConstants.lifecycleToastBlockedTitle), {
        description: i18n.t(localizationConstants.lifecycleToastBlockedMessage),
        action: {
          label: i18n.t(localizationConstants.lifecycleUpgradeCta),
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = LIFECYCLE_UPGRADE_PATH;
            }
          },
        },
      });
      return Promise.reject(error);
    }

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      isPublicAuthUrl(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      authStorage.clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      const accessToken = await ensureRefreshedAccessToken();
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } catch {
      authStorage.clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
