/**
 * Centralized portal and navigation URLs.
 * NOTE: In Next.js client builds, process.env.NEXT_PUBLIC_* properties MUST be accessed
 * explicitly as static member expressions (e.g. process.env.NEXT_PUBLIC_VAR) so the bundler
 * can statically inline them into client-side JavaScript.
 */

export const CUSTOMER_LOGIN_URL =
	process.env.NEXT_PUBLIC_CUSTOMER_LOGIN_URL || "http://localhost:3001/login";

export const CUSTOMER_REGISTER_URL =
	process.env.NEXT_PUBLIC_CUSTOMER_REGISTER_URL ||
	"http://localhost:3001/register";

export const CUSTOMER_CREATE_OFFER_URL =
	process.env.NEXT_PUBLIC_CUSTOMER_CREATE_OFFER_URL ||
	"http://localhost:3001/create-offer";

export const PROFESSIONAL_LOGIN_URL =
	process.env.NEXT_PUBLIC_PROFESSIONAL_LOGIN_URL ||
	"http://localhost:3002/login";

export const PROFESSIONAL_REGISTER_URL =
	process.env.NEXT_PUBLIC_PROFESSIONAL_REGISTER_URL ||
	"http://localhost:3002/register";

export const CALENDLY_DEMO_URL =
	process.env.NEXT_PUBLIC_CALENDLY_DEMO_URL ||
	"https://calendly.com/timeflowsystem/har-kan-du-boka-30-min-mote-med-timeflowsystem";

