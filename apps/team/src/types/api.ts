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
export interface AuthCompanyInfo {
	id?: string;
	name?: string;
	country?: string;
	code?: string;
}

export interface AuthAdminDetails {
	id?: string;
	name?: string;
	full_name?: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	role?: string;
	company_name?: string;
	current_company?: AuthCompanyInfo;
	companies?: AuthCompanyInfo[];
}

export interface AuthUserInfo {
	id: string;
	phone_number: string;
	postal_code: string;
	country: string;
	city: string;
	name?: string;
	full_name?: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	role?: string;
	company_name?: string;
	current_company?: AuthCompanyInfo;
	companies?: AuthCompanyInfo[];
	admin_details?: AuthAdminDetails;
}
export interface AuthResponseData {
	access_token?: string;
	token?: string;
	refresh_token?: string;
	user?: AuthUserInfo;
	id?: string;
	is_verified?: boolean;
	email?: string;
	first_name?: string;
	last_name?: string;
	is_active?: boolean;
	status?: string;
	user_profile?: unknown;
	last_visited_company?: unknown;
}
export interface ApiError {
  response?: {
    data?: {
      code?: string;
      message?: string;
      is_verified?: boolean;
      email?: string;
    };
  };
}
export type AuthAPIOptions = {
	setAccessToken?: (token: string | null) => void;
	setUser?: (user: unknown) => void;
};

export interface PaginatedResponse<T> {
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
}
