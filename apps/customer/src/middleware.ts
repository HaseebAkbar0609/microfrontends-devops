import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { appConstants } from "@/constants/api";

const SESSION_HINT_COOKIE = appConstants.LOCAL_SESSION_HINT_COOKIE_NAME;

const AUTH_ROUTES = new Set([
	"/login",
	"/register",
	"/forgot-password",
	// Landing page's login redirects here with a handoff code; it must be
	// reachable before a session exists, or this never gets to redeem it.
	"/auth/callback",
]);

const PUBLIC_ROUTES = new Set(["/create-offer"]);

function isAuthRoute(pathname: string): boolean {
	return AUTH_ROUTES.has(pathname);
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname === "/favicon.ico"
	) {
		return NextResponse.next();
	}

	const hasSession =
		request.cookies.get(SESSION_HINT_COOKIE)?.value === "1";

	// Authenticated user visiting an auth page → send to home
	if (hasSession && isAuthRoute(pathname)) {
		const url = request.nextUrl.clone();
		url.pathname = "/home";
		url.search = "";
		return NextResponse.redirect(url);
	}

	// Unauthenticated user visiting a protected page → send to login
	if (!hasSession && !isAuthRoute(pathname) && !PUBLIC_ROUTES.has(pathname)) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.search = "";
		url.searchParams.set("next", pathname);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
