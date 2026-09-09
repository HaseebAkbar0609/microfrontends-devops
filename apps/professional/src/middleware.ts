import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { appConstants } from "@/constants/api";

const REQUIRES_SUBSCRIPTION_COOKIE =
	appConstants.LOCAL_REQUIRES_SUBSCRIPTION_COOKIE_NAME;
const SESSION_HINT_COOKIE = appConstants.LOCAL_SESSION_HINT_COOKIE_NAME;

function pathnameLooksLikeStaticAsset(pathname: string): boolean {
	return /\.[a-zA-Z0-9]{1,8}$/.test(pathname);
}

/**
 * Paths allowed when the user must complete subscription (checkout flow).
 * Everything else redirects to /manage-plans.
 */
function isAllowedWhenSubscriptionRequired(pathname: string): boolean {
	if (pathnameLooksLikeStaticAsset(pathname)) return true;

	const exact = new Set([
		"/",
		"/login",
		"/register",
		"/forgot-password",
		"/invitation",
		"/my-companies",
		"/manage-plans",
		"/manage-cart",
		// Landing page's login redirects here with a handoff code; it must
		// stay reachable mid-funnel or this never gets to redeem it.
		"/auth/callback",
		"/subscription/success",
	]);

	if (exact.has(pathname)) return true;

	const prefixes = [
		"/login/",
		"/register/",
		"/forgot-password/",
		"/invitation/",
		"/my-companies/",
		"/manage-plans/",
		"/manage-cart/",
		"/auth/callback/",
		"/subscription/success/",
	];

	return prefixes.some((p) => pathname.startsWith(p));
}

function isSubscriptionFunnelPath(pathname: string): boolean {
	return (
		pathname === "/manage-plans" ||
		pathname === "/manage-cart" ||
		pathname.startsWith("/manage-plans/") ||
		pathname.startsWith("/manage-cart/") ||
		pathname === "/subscription/success" ||
		pathname.startsWith("/subscription/success/")
	);
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isPlanChange =
		request.nextUrl.searchParams.get("change") === "1" ||
		request.nextUrl.searchParams.get("mode") === "change";

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname === "/favicon.ico"
	) {
		return NextResponse.next();
	}

	const flag = request.cookies.get(REQUIRES_SUBSCRIPTION_COOKIE)?.value;

	if (flag === "1") {
		if (isAllowedWhenSubscriptionRequired(pathname)) {
			return NextResponse.next();
		}
		const url = request.nextUrl.clone();
		url.pathname = "/manage-plans";
		url.search = "";
		return NextResponse.redirect(url);
	}

	// Full access (cookie "0", cleared, or never set as "1"): no subscription funnel.
	// Logged-in users → dashboard; others → login (avoid dashboard → login bounce for guests).
	if (isSubscriptionFunnelPath(pathname) && !isPlanChange) {
		const hasSession = request.cookies.get(SESSION_HINT_COOKIE)?.value === "1";
		const url = request.nextUrl.clone();
		url.pathname = hasSession ? "/home" : "/login";
		url.search = "";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
