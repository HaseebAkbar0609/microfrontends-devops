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
	SUPPLIER: `${API_PREFIX}/suppliers`,
	COST_CALCULATOR: "/api/v1/tools/cost-calculator",
	CONTENT: "/api/v1/tools/content",
	QUESTIONS: "/api/v1/tools/questions",

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
	PROFILE: {
		BASE: `${BASE_PATHS.USER}/profile`,
		ME: `${BASE_PATHS.USER}/profile`,
	},
	SETTINGS: {
		BASE: `${API_PREFIX}/settings`,
		ME: `${API_PREFIX}/settings`,
	},
	USERS: {
		BASE: `${API_PREFIX}/users`,
		detail: (userId: string) => `${API_PREFIX}/users/${encodeURIComponent(userId)}`,
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
		/** PATCH /api/v1/project/:projectId/details */
		details: (projectId: string) =>
			`${BASE_PATHS.PROJECT}/${encodeURIComponent(projectId)}/details`,
		/** GET/POST /api/v1/project/:projectId/documents */
		documents: (projectId: string) =>
			`${BASE_PATHS.PROJECT}/${encodeURIComponent(projectId)}/documents`,
		/** DELETE /api/v1/project/:projectId/documents/:documentId */
		documentDetail: (projectId: string, documentId: string) =>
			`${BASE_PATHS.PROJECT}/${encodeURIComponent(
				projectId,
			)}/documents/${encodeURIComponent(documentId)}`,
		/** GET/POST /api/v1/project/:projectId/meeting-minutes */
		meetingMinutes: (projectId: string) =>
			`${BASE_PATHS.PROJECT}/${encodeURIComponent(projectId)}/meeting-minutes`,
		/** DELETE /api/v1/project/:projectId/meeting-minutes/:minuteId */
		meetingMinuteDetail: (projectId: string, minuteId: string) =>
			`${BASE_PATHS.PROJECT}/${encodeURIComponent(
				projectId,
			)}/meeting-minutes/${encodeURIComponent(minuteId)}`,
		/** GET /api/v1/project/:projectId/timelines */
		timelines: (projectId: string) =>
			`${BASE_PATHS.PROJECT}/${encodeURIComponent(projectId)}/timelines`,
		/** GET /api/v1/project/:projectId/org-plan */
		orgPlan: (projectId: string) =>
			`${BASE_PATHS.PROJECT}/${encodeURIComponent(projectId)}/org-plan`,
	},
	QUOTE: {
		approve: (quoteId: string) =>
			`/api/v1/quote/${encodeURIComponent(quoteId)}/approve`,
		reject: (quoteId: string) =>
			`/api/v1/quote/${encodeURIComponent(quoteId)}/reject`,
		details: (quoteId: string) =>
			`/api/v1/quote/${encodeURIComponent(quoteId)}/details`,
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
	SUPPLIER: {
		LIST: `${BASE_PATHS.SUPPLIER}/list`,
		CREATE: `${BASE_PATHS.SUPPLIER}/create`,
		detail: (id: string) => `${BASE_PATHS.SUPPLIER}/${encodeURIComponent(id)}`,
		update: (id: string) => `${BASE_PATHS.SUPPLIER}/${encodeURIComponent(id)}`,
		delete: (id: string) => `${BASE_PATHS.SUPPLIER}/${encodeURIComponent(id)}`,
		TEST_CONNECTION: `${BASE_PATHS.SUPPLIER}/test-connection`,
	},
	// NOTE: endpoints not live yet — consultant data currently comes from local
	// dummy data (see api-actions/consultant/).
	CONSULTANT: {
		LIST: `${BASE_PATHS.CONSULTANT}/list`,
		TYPES: `${BASE_PATHS.CONSULTANT}/types`,
		REQUESTS: `${BASE_PATHS.CONSULTANT}/requests`,
	},
	COST_CALCULATOR: {
		CONFIG: `${BASE_PATHS.COST_CALCULATOR}/config`,
		CALCULATE: `${BASE_PATHS.COST_CALCULATOR}/calculate`,
		PRODUCTS: `${BASE_PATHS.COST_CALCULATOR}/products`,
		HOURLY_RATES: `${BASE_PATHS.COST_CALCULATOR}/hourly-rates`,
	},
	CONTENT: {
		LIST: BASE_PATHS.CONTENT,
		CATEGORIES: `${BASE_PATHS.CONTENT}/categories`,
	},
	QUESTIONS: {
		LIST: BASE_PATHS.QUESTIONS,
		CREATE: BASE_PATHS.QUESTIONS,
		detail: (ticketId: string) => `${BASE_PATHS.QUESTIONS}/${encodeURIComponent(ticketId)}`,
		reply: (ticketId: string) => `${BASE_PATHS.QUESTIONS}/${encodeURIComponent(ticketId)}/reply`,
	},
	DISCOUNT: {
		LIST: "/api/v1/discounts",
		FILTERS: "/api/v1/discounts/filters",
		detail: (discountId: string) => `/api/v1/discounts/${encodeURIComponent(discountId)}`,
		apply: (discountId: string) => `/api/v1/discounts/${encodeURIComponent(discountId)}/apply`,
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

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

