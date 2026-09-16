const BASE_URL = process.env.PUBLIC_API_BASE_URL;
export const BASE_API_VERSION = `${BASE_URL}/v1`;

const API_PREFIX = "/api/v1/teams";

const BASE_PATHS = {
	AUTH: `${API_PREFIX}/auth`,
	USER: `${API_PREFIX}/user`,
};


export const API_PATH = {
 	AUTH: {
		 BASE: BASE_PATHS.AUTH,
    LOGIN: `${BASE_PATHS.AUTH}/login`,
    REFRESH_TOKEN: `${BASE_PATHS.AUTH}/refresh-token`,
    VALIDATE_INVITATION: `${BASE_PATHS.AUTH}/validate-invitation`,
    ACCEPT_INVITATION: `${BASE_PATHS.AUTH}/accept-invitation`,
    RESET_PASSWORD: `${BASE_PATHS.AUTH}/reset-password`,
    VALIDATE_OTP: `${BASE_PATHS.AUTH}/validate-otp`,
    FORGOT_PASSWORD: `${BASE_PATHS.AUTH}/forgot-password`,
    LOGOUT: `${BASE_PATHS.AUTH}/logout`,
	},

  //   LIST: {
  //     BY_ID: (id: string) => `${BASE_PATHS.LIST}/${id}`,

  //   },
};

export const appConstants = {
  LOCAL_COOKIE_NAME: "CZWAuthToken",
  LOCAL_REFRESH_COOKIE_NAME: "CZWREFRESHToken",
  LOCAL_USER_DATA: "user",
  API_RESPONSES: {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    INVALID_RESPONSE: 422,
  },
  INTERNAL_SERVER_ERROR_MESSAGE: "Internal Server Error",
};

// Error code mappings with user-friendly messages
export const ERROR_CODES = {
  SUC000: {
    code: "SUC000",
    message: "Success Code",
    status: [200, 201],
  },

  AUTH001: {
    code: "AUTH001",
    message: "The email address or password provided is incorrect.",
    status: [400],
  },
  AUTH002: {
    code: "AUTH002",
    message: "An account with this email address already exists.",
    status: [409],
  },
} as const;

// Helper function to get error message by code
export const getErrorMessageByCode = (errorCode: string): string => {
  const error = Object.values(ERROR_CODES).find(
    (err) => err.code === errorCode
  );
  return error?.message || "An error occurred. Please try again";
};
