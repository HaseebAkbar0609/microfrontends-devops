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
	// Authoritative when set: baked in per-environment at build time (see
	// apps/landing/Dockerfile), so it's correct regardless of what hostname
	// this page happens to be reached through (an IP, a preview domain, a
	// load balancer's own name — none of which match the sniffing below).
	if (process.env.NEXT_PUBLIC_CUSTOMER_URL) {
		return process.env.NEXT_PUBLIC_CUSTOMER_URL;
	}
	if (typeof window !== "undefined") {
		const hostname = window.location.hostname.toLowerCase();
		if (hostname.includes("dev.")) {
			return DEV_CUSTOMER_URL;
		}
		if (hostname.includes("timeflowsystem.com")) {
			return PROD_CUSTOMER_URL;
		}
	}
	if (process.env.NODE_ENV === "production") {
		return PROD_CUSTOMER_URL;
	}
	return LOCAL_CUSTOMER_URL;
};

export const getProfessionalBaseUrl = (): string => {
	// See getCustomerBaseUrl — same reasoning.
	if (process.env.NEXT_PUBLIC_PROFESSIONAL_URL) {
		return process.env.NEXT_PUBLIC_PROFESSIONAL_URL;
	}
	if (typeof window !== "undefined") {
		const hostname = window.location.hostname.toLowerCase();
		if (hostname.includes("dev.")) {
			return DEV_PROFESSIONAL_URL;
		}
		if (hostname.includes("timeflowsystem.com")) {
			return PROD_PROFESSIONAL_URL;
		}
	}
	if (process.env.NODE_ENV === "production") {
		return PROD_PROFESSIONAL_URL;
	}
	return LOCAL_PROFESSIONAL_URL;
};

// Helper functions - use these in components for dynamic URLs
export const getCustomerLoginUrl = (): string => `${getCustomerBaseUrl()}/login`;
export const getCustomerRegisterUrl = (): string => `${getCustomerBaseUrl()}/register`;
export const getCustomerCreateOfferUrl = (): string => `${getCustomerBaseUrl()}/create-offer`;

export const getProfessionalLoginUrl = (): string => `${getProfessionalBaseUrl()}/login`;
export const getProfessionalRegisterUrl = (): string => `${getProfessionalBaseUrl()}/register`;

// Dynamic exported constants for backward compatibility
export const CUSTOMER_LOGIN_URL = getCustomerLoginUrl();
export const CUSTOMER_REGISTER_URL = getCustomerRegisterUrl();
export const CUSTOMER_CREATE_OFFER_URL = getCustomerCreateOfferUrl();
export const PROFESSIONAL_LOGIN_URL = getProfessionalLoginUrl();
export const PROFESSIONAL_REGISTER_URL = getProfessionalRegisterUrl();

export const CALENDLY_DEMO_URL =
	"https://calendly.com/timeflowsystem/har-kan-du-boka-30-min-mote-med-timeflowsystem";
