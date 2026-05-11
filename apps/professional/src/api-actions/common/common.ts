import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";

export interface Country {
  id: string;
  code: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

/** Normalized categories list (supports plain array or paginated `data` from API). */
export type CategoriesPageResult = {
  items: Category[];
  page: number;
  limit: number;
  total: number | null;
};

function readCategoriesTotal(o: Record<string, unknown>): number | null {
  if (typeof o.total_items === "number") return o.total_items;
  if (typeof o.total === "number") return o.total;
  if (typeof o.totalCount === "number") return o.totalCount;
  if (typeof o.count === "number") return o.count;
  const meta = o.meta;
  if (
    meta &&
    typeof meta === "object" &&
    meta !== null &&
    "total" in meta &&
    typeof (meta as { total: unknown }).total === "number"
  ) {
    return (meta as { total: number }).total;
  }
  return null;
}

function normalizeCategoriesPage(
  raw: unknown,
  requestedPage: number,
  requestedLimit: number
): CategoriesPageResult {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;

    // Check for items in 'items' or 'data'
    const items = Array.isArray(o.items)
      ? (o.items as Category[])
      : Array.isArray(o.data)
        ? (o.data as Category[])
        : null;

    if (items) {
      return {
        items,
        page: typeof o.page === "number" ? o.page : (typeof o.current_page === "number" ? o.current_page : requestedPage),
        limit: typeof o.limit === "number" ? o.limit : (typeof o.page_size === "number" ? o.page_size : requestedLimit),
        total: readCategoriesTotal(o),
      };
    }
  }

  if (Array.isArray(raw)) {
    return {
      items: raw as Category[],
      page: requestedPage,
      limit: requestedLimit,
      total: null,
    };
  }
  return {
    items: [],
    page: requestedPage,
    limit: requestedLimit,
    total: null,
  };
}

export async function getCountriesAction(): Promise<ActionResult<Country[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<Country[]>>(
      API_PATH.LOCATION.COUNTRIES
    );

    return { success: true, data: response.data?.data ?? [], error: null };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const errorResponse = apiError.response?.data as
      | { code?: string; message?: string }
      | undefined;
    const errorCode = errorResponse?.code;
    const errorMessage = errorResponse?.message;

    if (errorCode) {
      const msg = getErrorMessageByCode(String(errorCode));
      showToast("error", msg);
      return { success: false, data: null, error: msg, errorCode };
    }

    const message = errorMessage ?? "Failed to fetch countries.";
    showToast("error", message);
    return { success: false, data: null, error: message };
  }
}




export type GetCategoriesParams = {
  page?: number;
  limit?: number;
};

export async function getCategoriesAction(
  params?: GetCategoriesParams
): Promise<ActionResult<CategoriesPageResult>> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;
  try {
    const response = await axiosInstance.get<
      ApiResponse<Category[] | Record<string, unknown>>
    >(API_PATH.TEAMS.PROFESSIONAL_CATEGORIES_LIST, {
      params: { page, limit },
    });

    const normalized = normalizeCategoriesPage(
      response.data,
      page,
      limit
    );

    return { success: true, data: normalized, error: null };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const errorResponse = apiError.response?.data as
      | { code?: string; message?: string }
      | undefined;
    const errorCode = errorResponse?.code;
    const errorMessage = errorResponse?.message;

    if (errorCode) {
      const msg = getErrorMessageByCode(String(errorCode));
      showToast("error", msg);
      return { success: false, data: null, error: msg, errorCode };
    }

    const message = errorMessage ?? "Failed to fetch categories.";
    showToast("error", message);
    return { success: false, data: null, error: message };
  }
}
