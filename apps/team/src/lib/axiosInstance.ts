import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { authStorage } from "@/lib/authStorage";
import { API_PATH } from "@/constants/api";

const REFRESH_PATH = API_PATH.AUTH.REFRESH_TOKEN;

/** Same origin as main client; no auth interceptors on this instance. */
function getApiBaseURL(): string | undefined {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  return u || undefined;
}

const AUTH_PATHS_NO_REFRESH = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/refresh-token",
];

function isPublicAuthUrl(url: string | undefined): boolean {
  if (!url) return false;
  return AUTH_PATHS_NO_REFRESH.some((p) => url.includes(p));
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

async function callRefreshTokenAPI(): Promise<string> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) {
    authStorage.clearAuth();
    throw new Error("No refresh token");
  }

  const client = axios.create({
    baseURL: getApiBaseURL(),
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

function ensureRefreshedAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = callRefreshTokenAPI().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

const axiosInstance = axios.create({
  baseURL: getApiBaseURL(),
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = authStorage.getAccessToken();
  const userData = authStorage.getUserData() as Record<string, unknown> | null;
  
  let companyId: string | undefined = undefined;
  if (userData) {
    if (typeof userData.last_visited_company_id === "string") {
      companyId = userData.last_visited_company_id;
    } else if (userData.last_visited_company && typeof userData.last_visited_company === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      companyId = (userData.last_visited_company as any).id;
    } else if (typeof userData.last_visited_company === "string") {
      companyId = userData.last_visited_company;
    }
  }

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
      return Promise.reject({ response: { data: { ...response.data, message } } });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      isPublicAuthUrl(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
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
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
