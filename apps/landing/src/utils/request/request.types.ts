import { AxiosError, AxiosRequestConfig } from "axios";

export interface ApiResponseData<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  errors?: Record<string, string[]>;
}

export interface ApiErrorData {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  code?: string;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

export class ApiError extends Error {
  public readonly name: string = "ApiError";
  public readonly status: number;
  public readonly data: ApiErrorData | null;

  constructor(error: AxiosError<ApiErrorData>) {
    super();
    this.status = error.response?.status || 500;
    this.message =
      error.response?.data?.message || error.message || "An error occurred";
    this.data = error.response?.data || null;
  }
}

export interface UseApiStateOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}
