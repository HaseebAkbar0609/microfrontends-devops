/**
 * Centralized portal and navigation URLs.
 * Dynamically resolves URLs based on the current environment (Local, Dev, Production)
 * using window.location.hostname in the browser.
 */

// Base URL definitions
export const DEV_CUSTOMER_URL = "https://dev.customer.timeflowsystem.com";
export const PROD_CUSTOMER_URL = "https://customer.timeflowsystem.com";
export const LOCAL_CUSTOMER_URL = "http://localhost:3001";

export const DEV_PROFESSIONAL_URL = "https://dev.workspace.timeflowsystem.com";
export const PROD_PROFESSIONAL_URL = "https://professional.timeflowsystem.com";
export const LOCAL_PROFESSIONAL_URL = "http://localhost:3002";

export const getCustomerBaseUrl = (): string => {
	if (typeof window !== "undefined") {
		const hostname = window.location.hostname.toLowerCase();
		if (hostname.includes("dev.")) {
			return DEV_CUSTOMER_URL;
		}
		if (hostname.includes("timeflowsystem.com")) {
			return PROD_CUSTOMER_URL;
		}
	}
	return LOCAL_CUSTOMER_URL;
};

export const getProfessionalBaseUrl = (): string => {
	if (typeof window !== "undefined") {
		const hostname = window.location.hostname.toLowerCase();
		if (hostname.includes("dev.")) {
			return DEV_PROFESSIONAL_URL;
		}
		if (hostname.includes("timeflowsystem.com")) {
			return PROD_PROFESSIONAL_URL;
		}
	}
	return LOCAL_PROFESSIONAL_URL;
};

// Helper functions - use these in components for dynamic URLs
export const getCustomerLoginUrl = (): string => `${getCustomerBaseUrl()}/login`;
export const getCustomerRegisterUrl = (): string => `${getCustomerBaseUrl()}/register`;
export const getCustomerCreateOfferUrl = (): string => `${getCustomerBaseUrl()}/create-offer`;

export const getProfessionalLoginUrl = (): string => `${getProfessionalBaseUrl()}/login`;
export const getProfessionalRegisterUrl = (): string => `${getProfessionalBaseUrl()}/register`;

// WARNING: Only use these constants in client-side code (useEffect, event handlers)
// For SSR-safe usage, call the getter functions above instead
// These are kept for backward compatibility but may cause hydration warnings
let _customerLoginUrl = `${LOCAL_CUSTOMER_URL}/login`;
let _customerRegisterUrl = `${LOCAL_CUSTOMER_URL}/register`;
let _customerCreateOfferUrl = `${LOCAL_CUSTOMER_URL}/create-offer`;
let _professionalLoginUrl = `${LOCAL_PROFESSIONAL_URL}/login`;
let _professionalRegisterUrl = `${LOCAL_PROFESSIONAL_URL}/register`;

// Initialize on client-side only
if (typeof window !== "undefined") {
	_customerLoginUrl = getCustomerLoginUrl();
	_customerRegisterUrl = getCustomerRegisterUrl();
	_customerCreateOfferUrl = getCustomerCreateOfferUrl();
	_professionalLoginUrl = getProfessionalLoginUrl();
	_professionalRegisterUrl = getProfessionalRegisterUrl();
}

export const CUSTOMER_LOGIN_URL = _customerLoginUrl;
export const CUSTOMER_REGISTER_URL = _customerRegisterUrl;
export const CUSTOMER_CREATE_OFFER_URL = _customerCreateOfferUrl;
export const PROFESSIONAL_LOGIN_URL = _professionalLoginUrl;
export const PROFESSIONAL_REGISTER_URL = _professionalRegisterUrl;

export const CALENDLY_DEMO_URL =
	"https://calendly.com/timeflowsystem/har-kan-du-boka-30-min-mote-med-timeflowsystem";
