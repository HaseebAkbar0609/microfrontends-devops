export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ActionResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  errorCode?: string;
}

export interface ApiError {
  response?: { data?: { code?: string; message?: string } };
}

export interface PaginatedResponse<T> {
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
}
