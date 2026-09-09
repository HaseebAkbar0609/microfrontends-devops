const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const BASE_API_VERSION = `${BASE_URL}/api/v1`;

const PROFESSIONALS_BASE_PATH = "/professionals";

const BASE_PATHS = {
	AUTH: `${PROFESSIONALS_BASE_PATH}/auth`,
	USER: `${PROFESSIONALS_BASE_PATH}/user`,
	SUBSCRIPTIONS: `${PROFESSIONALS_BASE_PATH}/subscriptions`,
	CART: `${PROFESSIONALS_BASE_PATH}/cart`,
	USER_CARDS: `${PROFESSIONALS_BASE_PATH}/user-cards`,
	LOCATION: `/location`,
	TEAMS: `/teams`,
	COMPANIES: `/companies`,
	CUSTOMERS: `${PROFESSIONALS_BASE_PATH}/customers`,
};

export const API_PATH = {
	AUTH: {
		BASE: BASE_PATHS.AUTH,
		LOGIN: `${BASE_PATHS.AUTH}/login`,
		RESET_PASSWORD: `${BASE_PATHS.AUTH}/reset-password`,
		VERIFY_EMAIL: `${BASE_PATHS.AUTH}/verify-email`,
		VALIDATE_OTP: `${BASE_PATHS.AUTH}/validate-otp`,
		FORGOT_PASSWORD: `${BASE_PATHS.AUTH}/forgot-password`,
		LOGOUT: `${BASE_PATHS.AUTH}/logout`,
		REGISTER: `${BASE_PATHS.AUTH}/register`,
		GET_PROFILE: `${PROFESSIONALS_BASE_PATH}/profile/me`,
		SET_PASSWORD: `${BASE_PATHS.AUTH}/set-password`,
		COMPLETE_SUBSCRIPTION: `${BASE_PATHS.AUTH}/complete-subscription`,
	},
	SUBSCRIPTIONS: {
		LIST: `${BASE_PATHS.SUBSCRIPTIONS}/list`,
		CHECKOUT: `${BASE_PATHS.SUBSCRIPTIONS}/checkout`,
		CHANGE: `${BASE_PATHS.SUBSCRIPTIONS}/change`,
		OVERVIEW: "/subscriptions",
	},
	USER_CARDS: {
		SETUP_INTENT: `${BASE_PATHS.USER_CARDS}/setup-intent`,
		ATTACH_PAYMENT_METHOD: `${BASE_PATHS.USER_CARDS}/attach-payment-method`,
		LIST: `${BASE_PATHS.USER_CARDS}/list`,
	},
	CART: {
		ADD: `${BASE_PATHS.CART}/add`,
		GET: `${BASE_PATHS.CART}/get`,
		UPDATE: (cartItemId: string) => `${BASE_PATHS.CART}/${cartItemId}`,
		CLEAR: `${BASE_PATHS.CART}/clear`,
	},
	LOCATION: {
		COUNTRIES: `${BASE_PATHS.LOCATION}/countries`,
		CITIES: `${BASE_PATHS.LOCATION}/cities`,

	},
	TEAMS: {
		PROFESSIONAL_CATEGORIES_LIST: `${BASE_PATHS.TEAMS}/professionals/categories/list`,
	},
	COMPANIES: {
		INVITATION_ACCEPT: `${BASE_PATHS.COMPANIES}/validate/token`,
	},
	CUSTOMERS: {
		LIST: BASE_PATHS.CUSTOMERS,
		CREATE: BASE_PATHS.CUSTOMERS,
		UPDATE: (id: string) => `${BASE_PATHS.CUSTOMERS}/${id}`,
		GET: (id: string) => `${BASE_PATHS.CUSTOMERS}/${id}`,
		DELETE: (id: string) => `${BASE_PATHS.CUSTOMERS}/${id}`,
		UPLOAD_FILE: `/media/upload`,
	},
	ARTICLES: {
		LIST: `${PROFESSIONALS_BASE_PATH}/articles`,
		GET: (id: string) => `${PROFESSIONALS_BASE_PATH}/articles/${id}`,
		CREATE: `${PROFESSIONALS_BASE_PATH}/articles`,
		UPDATE: (id: string) => `${PROFESSIONALS_BASE_PATH}/articles/${id}`,
		DELETE: (id: string) => `${PROFESSIONALS_BASE_PATH}/articles/${id}`,
		TOGGLE_FAVORITE: (id: string) => `${PROFESSIONALS_BASE_PATH}/articles/${id}/favorite`,
		IMPORT: `${PROFESSIONALS_BASE_PATH}/articles/import`,
		SUPPLIER_ARTICLES_LIST: `${PROFESSIONALS_BASE_PATH}/supplier-articles`,
		SUPPLIER_ARTICLES_UPDATE: `${PROFESSIONALS_BASE_PATH}/supplier-articles/update`,
		SUPPLIER_ARTICLES_DELETE: (id: string) => `${PROFESSIONALS_BASE_PATH}/supplier-articles/${id}`,
	},
	SUPPLIERS: {
		LIST: `${PROFESSIONALS_BASE_PATH}/suppliers`,
		CREATE: `${PROFESSIONALS_BASE_PATH}/suppliers`,
		UPDATE: (id: string) => `${PROFESSIONALS_BASE_PATH}/suppliers/${id}`,
		GET: (id: string) => `${PROFESSIONALS_BASE_PATH}/suppliers/${id}`,
		DELETE: (id: string) => `${PROFESSIONALS_BASE_PATH}/suppliers/${id}`,
		UPLOAD_FILE: `/media/upload`,
	},
	PRICE_LISTS: {
		LIST: `${PROFESSIONALS_BASE_PATH}/pricelists`,
		CREATE: `${PROFESSIONALS_BASE_PATH}/pricelists`,
		GET: (id: string) => `${PROFESSIONALS_BASE_PATH}/pricelists/${id}`,
		UPDATE: (id: string) => `${PROFESSIONALS_BASE_PATH}/pricelists/${id}`,
		DELETE: (id: string) => `${PROFESSIONALS_BASE_PATH}/pricelists/${id}`,
		TOGGLE_FAVORITE: (id: string) => `${PROFESSIONALS_BASE_PATH}/pricelists/${id}/favorite`,
	},
	COST_CENTERS: {
		LIST: `${PROFESSIONALS_BASE_PATH}/cost-centers`,
		CREATE: `${PROFESSIONALS_BASE_PATH}/cost-centers`,
		GET: (id: string) => `${PROFESSIONALS_BASE_PATH}/cost-centers/${id}`,
		UPDATE: (id: string) => `${PROFESSIONALS_BASE_PATH}/cost-centers/${id}`,
		DELETE: (id: string) => `${PROFESSIONALS_BASE_PATH}/cost-centers/${id}`,
		TOGGLE_STATUS: `${PROFESSIONALS_BASE_PATH}/cost-centers/toggle-status`,
	},
	ACCOUNTS: {
		LIST: `${PROFESSIONALS_BASE_PATH}/accounts`,
		CREATE: `${PROFESSIONALS_BASE_PATH}/accounts`,
		UPDATE: (id: string) => `${PROFESSIONALS_BASE_PATH}/accounts/${id}`,
		GET: (id: string) => `${PROFESSIONALS_BASE_PATH}/accounts/${id}`,
		TOGGLE_STATUS: (id: string) => `${PROFESSIONALS_BASE_PATH}/accounts/${id}/status`,
	},
	BUDGETS: {
		LIST: `${PROFESSIONALS_BASE_PATH}/budgets`,
		CREATE: `${PROFESSIONALS_BASE_PATH}/budgets`,
		GET: (id: string) => `${PROFESSIONALS_BASE_PATH}/budgets/${id}`,
		UPDATE: (id: string) => `${PROFESSIONALS_BASE_PATH}/budgets/${id}`,
		DELETE: (id: string) => `${PROFESSIONALS_BASE_PATH}/budgets/${id}`,
		TOGGLE_STATUS: `${PROFESSIONALS_BASE_PATH}/budgets/toggle-status`,
		TOGGLE_FAVORITE: (id: string) => `${PROFESSIONALS_BASE_PATH}/budgets/${id}/favorite`,
	},
	WAGE_TYPES: {
		LIST: `${PROFESSIONALS_BASE_PATH}/wage-types`,
		CREATE: `${PROFESSIONALS_BASE_PATH}/wage-types`,
		GET: (id: string) => `${PROFESSIONALS_BASE_PATH}/wage-types/${id}`,
		UPDATE: (id: string) => `${PROFESSIONALS_BASE_PATH}/wage-types/${id}`,
		DELETE: (id: string) => `${PROFESSIONALS_BASE_PATH}/wage-types/${id}`,
		TOGGLE_STATUS: `${PROFESSIONALS_BASE_PATH}/wage-types/toggle-status`,
	},
	PLANNING: {
		LIST: `${PROFESSIONALS_BASE_PATH}/planning`,
		CREATE: `${PROFESSIONALS_BASE_PATH}/planning/tasks`,
		UPDATE: (id: string) => `${PROFESSIONALS_BASE_PATH}/planning/tasks/${id}`,
		DELETE: (id: string) => `${PROFESSIONALS_BASE_PATH}/planning/tasks/${id}`,
	},
	ORDERS: {
		BASE: `${PROFESSIONALS_BASE_PATH}/orders`,
		CREATE: `${PROFESSIONALS_BASE_PATH}/orders`,
		DRAFT: `${PROFESSIONALS_BASE_PATH}/orders/draft`,
		LIST: `${PROFESSIONALS_BASE_PATH}/orders`,
		GET: (id: string) => `${PROFESSIONALS_BASE_PATH}/orders/${id}`,
		UPDATE: (id: string) => `${PROFESSIONALS_BASE_PATH}/orders/${id}`,
		DELETE: (id: string) => `${PROFESSIONALS_BASE_PATH}/orders/${id}`,
		ORGANISATION: (id: string) => `${PROFESSIONALS_BASE_PATH}/orders/${id}/organisation`,
		UPLOAD_FILE: `/media/upload`,
	},
	B2B: {
		COMPANIES: `${PROFESSIONALS_BASE_PATH}/b2b/companies`,
		COMPANY_DETAIL: (id: string) => `${PROFESSIONALS_BASE_PATH}/b2b/companies/${id}`,
		COMPANY_VERIFY: (id: string) => `${PROFESSIONALS_BASE_PATH}/b2b/companies/${id}/verify`,
	},
};

export const appConstants = {
	LOCAL_COOKIE_NAME: "CZWAuthToken",
	LOCAL_REFRESH_COOKIE_NAME: "CZWREFRESHToken",
	/** Readable by middleware: "1" = user must complete subscription (manage-plans / cart only). */
	LOCAL_REQUIRES_SUBSCRIPTION_COOKIE_NAME: "CZWRequiresSubscription",
	/** Readable by middleware: "1" = client has a session (tokens in localStorage). */
	LOCAL_SESSION_HINT_COOKIE_NAME: "CZWHasSession",
	LOCAL_USER_DATA: "user",
	LOCAL_COMPANY_DATA: "company",
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
		(err) => err.code === errorCode,
	);
	return error?.message || "An error occurred. Please try again";
};
