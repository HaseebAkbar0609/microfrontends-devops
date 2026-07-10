const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const BASE_API_VERSION = `${BASE_URL}/v1`;

const API_PREFIX = "/api/v1/customers";

const BASE_PATHS = {
	AUTH: `${API_PREFIX}/auth`,
	USER: `${API_PREFIX}/user`,
	PROJECT: "/api/v1/project",
	LOCATION: "/api/v1/location",
	TEAMS: "/api/v1/teams",
	COMPANIES: "/api/v1/companies",
	CONSULTANT: `${API_PREFIX}/consultants`,
};

export const API_PATH = {
	AUTH: {
		BASE: BASE_PATHS.AUTH,
		LOGIN: `${BASE_PATHS.AUTH}/login`,
		REGISTER: `${BASE_PATHS.AUTH}/register`,
		RESET_PASSWORD: `${BASE_PATHS.AUTH}/reset-password`,
		FORGOT_PASSWORD: `${BASE_PATHS.AUTH}/forgot-password`,
		VERIFY_EMAIL: `${BASE_PATHS.AUTH}/verify-email`,
		VALIDATE_OTP: `${BASE_PATHS.AUTH}/validate-otp`,
		PROFILE: `${BASE_PATHS.USER}/profile`,
	},
	PROJECT: {
		ACTIVE: `${BASE_PATHS.PROJECT}/active`,
		SAVE: `${BASE_PATHS.PROJECT}/save`,
		LIST: `${BASE_PATHS.PROJECT}/list`,
		/** GET /api/v1/project/:projectId */
		detail: (projectId: string) =>
			`${BASE_PATHS.PROJECT}/${encodeURIComponent(projectId)}`,
		/** PATCH /api/v1/project/:projectId/status */
		status: (projectId: string) =>
			`${BASE_PATHS.PROJECT}/${encodeURIComponent(projectId)}/status`,
	},
	MEDIA: {
		UPLOAD: "/api/v1/media/upload",
	},
	INVITATION: {
		ACCEPT: "/api/v1/companies/invitation/accept",
	},
	COMPANIES: {
		USER_ACTIVE_INACTIVE: (companyUserId: string) =>
			`${BASE_PATHS.COMPANIES}/user/active-inactive/${companyUserId}`,
	},
	LOCATION: {
		COUNTRIES: `${BASE_PATHS.LOCATION}/countries`,
		CITIES: `${BASE_PATHS.LOCATION}/cities`,
	},
	TEAMS: {
		CUSTOMER_CATEGORIES_LIST: `${BASE_PATHS.TEAMS}/customers/categories/list`,
		PROFESSIONALS_SUBCATEGORIES_LIST: `${BASE_PATHS.TEAMS}/professionals/subcategories/list`,
	},
	CONSULTANT: {
		LIST: `${BASE_PATHS.CONSULTANT}/list`,
	},
};

export const appConstants = {
	LOCAL_COOKIE_NAME: "CZWAuthToken",
	LOCAL_REFRESH_COOKIE_NAME: "CZWREFRESHToken",
	LOCAL_SESSION_HINT_COOKIE_NAME: "czw_customer_session",
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
	AUTH003: {
		code: "AUTH003",
		message:
			"Registration failed. Please check your details and try again.",
		status: [400, 422],
	},
} as const;

// Helper function to get error message by code
export const getErrorMessageByCode = (errorCode: string): string => {
	const error = Object.values(ERROR_CODES).find(
		(err) => err.code === errorCode,
	);
	return error?.message || "An error occurred. Please try again";
};
