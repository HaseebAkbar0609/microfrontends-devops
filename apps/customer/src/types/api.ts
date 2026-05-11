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
  response?: {
    data?: {
      code?: string;
      message?: string;
      is_verified?: boolean;
      email?: string;
    };
  };
}

export interface UserProfile {
	id: string;
	phone_number: string;
	postal_code: string;
	country: string;
	city: string;
	/** Street address when returned by the API */
	address?: string;
}

export interface AuthUserInfo {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	is_active?: boolean;
	status?: string;
	user_profile?: UserProfile;
}

export interface AuthResponseData extends AuthUserInfo {
	access_token?: string;
	token?: string;
	refresh_token?: string;
	is_verified?: boolean;
}

export type AuthApiResponse = ApiResponse<AuthResponseData> | AuthResponseData;

export type AuthAPIOptions = {
	setAccessToken?: (token: string | null) => void;
	setUser?: (user: AuthUserInfo | null) => void;
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
