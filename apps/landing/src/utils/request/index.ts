import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/configs";
import { ApiError, ApiErrorData, ApiResponseData, RequestConfig, UploadProgressCallback, UseApiStateOptions } from "./request.types";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const axiosError = error as AxiosError<ApiErrorData>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: any) => {
    if (config.skipAuth) {
      return config;
    }

    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    toast.error(getErrorMessage(error));

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export class ApiResponse<T = any> {
  public readonly data: T;
  public readonly status: number;
  public readonly message: string;
  public readonly success: boolean;

  constructor(response: AxiosResponse<ApiResponseData<T>>) {
    this.data = response.data.data || (response.data as T);
    this.status = response.status;
    this.message = response.data.message || "Success";
    this.success = response.status >= 200 && response.status < 300;
  }
}

export const request = {
  async get<T = any>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<ApiResponseData<T>>(url, config);
      return new ApiResponse<T>(response);
    } catch (error) {
      throw new ApiError(error as AxiosError<ApiErrorData>);
    }
  },

  async post<T = any>(
    url: string,
    data: any = {},
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponseData<T>>(
        url,
        data,
        config
      );
      return new ApiResponse<T>(response);
    } catch (error) {
      throw new ApiError(error as AxiosError<ApiErrorData>);
    }
  },

  async put<T = any>(
    url: string,
    data: any = {},
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<ApiResponseData<T>>(
        url,
        data,
        config
      );
      return new ApiResponse<T>(response);
    } catch (error) {
      throw new ApiError(error as AxiosError<ApiErrorData>);
    }
  },

  async patch<T = any>(
    url: string,
    data: any = {},
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<ApiResponseData<T>>(
        url,
        data,
        config
      );
      return new ApiResponse<T>(response);
    } catch (error) {
      throw new ApiError(error as AxiosError<ApiErrorData>);
    }
  },

  async delete<T = any>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<ApiResponseData<T>>(url, config);
      return new ApiResponse<T>(response);
    } catch (error) {
      throw new ApiError(error as AxiosError<ApiErrorData>);
    }
  },

  async upload<T = any>(
    url: string,
    type: "video" | "image",
    file: File,
    onProgress?: UploadProgressCallback,
    additionalData: Record<string, string | number | boolean> = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(type, file);

    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress
        ? (progressEvent: any) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          }
        : undefined,
    };

    try {
      const response = await apiClient.post<ApiResponseData<T>>(
        url,
        formData,
        config
      );
      return new ApiResponse<T>(response);
    } catch (error) {
      throw new ApiError(error as AxiosError<ApiErrorData>);
    }
  },

  async download(
    url: string,
    config: RequestConfig = {}
  ): Promise<AxiosResponse<Blob>> {
    try {
      const response = await apiClient.get<Blob>(url, {
        ...config,
        responseType: "blob",
      });
      return response;
    } catch (error) {
      throw new ApiError(error as AxiosError<ApiErrorData>);
    }
  },
};

// This can be used if you're using React
export const createApiHook = <T = any>(
  apiCall: () => Promise<ApiResponse<T>>
) => {
  return (options: UseApiStateOptions = {}) => {
    // Implementation would depend on React hooks
    // This is just a structure for potential use
    return {
      data: null as T | null,
      loading: false,
      error: null as ApiError | null,
      execute: apiCall,
    };
  };
};
