"use client";
import { billingReturnPath } from "@/lib/billingReturnPath";
import { completeSubscriptionAction } from "@/api-actions";
import { authStorage } from "@/lib/authStorage";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStatus } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { getRequiresSubscriptionFromBrowserCookie } from "@/lib/requiresSubscriptionCookie";
import {
	AccountLifecycleBanner,
	AccountLifecyclePopup,
} from "@/features/account-lifecycle";
import { setRequiresSubscriptionCookie } from "@/lib/requiresSubscriptionCookie";
import { getSubscriptionOverview } from "@/features/admin/subscription/services/subscriptionService";
import StaffLicenseGate from "@/features/admin/users/live/StaffLicenseGate";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

interface AppShellProps {
	children: React.ReactNode;
}

const AUTH_ROUTE_PREFIXES = [
	"/login",
	"/register",
	"/forgot-password",
	"/my-companies",
	"/invitation",
	// Landing page's login redirects here with a handoff code; it isn't
	// authenticated yet by definition, so it must be treated as an auth
	// route here too or this redirects to /login before it can run. Keep
	// in sync with middleware.ts's isAllowedWhenSubscriptionRequired().
	"/auth/callback",
];

const PUBLIC_ROUTE_PREFIXES = [
	"/manage-plans",
	"/manage-cart",
	"/subscription/success",
];

function pathMatchesPrefixes(pathname: string, prefixes: string[]) {
	return prefixes.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);
}

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, isReady, hydrateFromStorage } = useAuthStatus();
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	const isAuthRoute = pathMatchesPrefixes(pathname, AUTH_ROUTE_PREFIXES);
	const isPublicPage = pathMatchesPrefixes(pathname, PUBLIC_ROUTE_PREFIXES);
	const isBillingPage = isPublicPage || pathMatchesPrefixes(pathname, ["/admin/subscription", "/admin/licenses"]);

	useEffect(() => {
		if (!isReady) return;
		const searchParams = new URLSearchParams(window.location.search);
		const isExplicitFunnel =
			searchParams.get("change") === "1" ||
			["change", "new"].includes(searchParams.get("mode") ?? "");

		if (
			isAuthenticated &&
			isPublicPage &&
			!isExplicitFunnel &&
			!getRequiresSubscriptionFromBrowserCookie()
		) {
			router.replace("/home");
			return;
		}

		if (isAuthRoute && isAuthenticated) {
			// Let users stay on /invitation, /my-companies, or /register even with an existing session.
			if (
				pathname === "/invitation" ||
				pathname.startsWith("/invitation/") ||
				pathname === "/my-companies" ||
				pathname === "/register" ||
				pathname.startsWith("/register/")
			) {
				setIsCheckingAuth(false);
				return;
			}

			const subscriptionRequired =
				getRequiresSubscriptionFromBrowserCookie();
			const destination = billingReturnPath(searchParams.get("returnTo")) ?? (subscriptionRequired
				? "/manage-plans"
				: "/home");
			router.replace(destination);
			return;
		}

		if (!isAuthenticated && !isAuthRoute && !isPublicPage) {
			const returnTo = billingReturnPath(pathname + window.location.search);
			router.replace(returnTo ? "/login?returnTo=" + encodeURIComponent(returnTo) : "/login");
			return;
		}

		if (!isAuthenticated && pathname === "/my-companies") {
			router.replace("/login");
			return;
		}

		setIsCheckingAuth(false);
	}, [
		isReady,
		isAuthenticated,
		isAuthRoute,
		isPublicPage,
		pathname,
		router,
	]);

	useEffect(() => {
		if (!isReady || !isAuthenticated || isAuthRoute || isPublicPage) return;
		let active = true;

		const checkBillingStatus = async () => {
			try {
				const overview = await getSubscriptionOverview();
				if (!active) return;
				const requiresSubscription =
					overview.status?.access_state === "INACTIVE";
				if (getRequiresSubscriptionFromBrowserCookie() && !requiresSubscription) {
					const paymentToken = authStorage.getAccessToken();
					if (!paymentToken) return;
					const completed = await completeSubscriptionAction({ payment_token: paymentToken }, { suppressErrorToast: true });
					if (!completed.success) return;
					hydrateFromStorage();
				}
				setRequiresSubscriptionCookie(requiresSubscription);
				if (requiresSubscription && !isBillingPage) router.replace("/manage-plans");
			} catch {
				// A transient billing-status failure must not eject an authenticated user.
			}
		};

		void checkBillingStatus();
		const intervalId = window.setInterval(() => void checkBillingStatus(), 15_000);
		window.addEventListener("focus", checkBillingStatus);
		return () => {
			active = false;
			window.clearInterval(intervalId);
			window.removeEventListener("focus", checkBillingStatus);
		};
	}, [isReady, isAuthenticated, isAuthRoute, isPublicPage, isBillingPage, router, hydrateFromStorage]);

	if (!isReady) {
		return <Loader />;
	}

	if (isAuthRoute && isAuthenticated) {
		if (
			pathname === "/invitation" ||
			pathname.startsWith("/invitation/") ||
			pathname === "/my-companies" ||
			pathname === "/register" ||
			pathname.startsWith("/register/")
		) {
			return <>{children}</>;
		}
		return <Loader />;
	}

	if (isAuthRoute) {
		if (pathname === "/my-companies" && !isAuthenticated) {
			return <Loader />;
		}
		return <>{children}</>;
	}

	if (isCheckingAuth && !isPublicPage) {
		return <Loader />;
	}

	if (!isAuthenticated && !isPublicPage) {
		return null;
	}

	return (
		<div className="flex h-screen flex-1 overflow-hidden">
			{!isPublicPage && <Sidebar autoCollapse />}
			<div className="flex flex-1 flex-col overflow-hidden">
				{!isPublicPage && !getRequiresSubscriptionFromBrowserCookie() && <AccountLifecycleBanner />}
				<Header />
				<main className="flex flex-1 flex-col bg-white overflow-y-auto min-h-0">
					{isAuthenticated && isBillingPage ? <StaffLicenseGate>{children}</StaffLicenseGate> : children}
				</main>
			</div>
			{!isPublicPage && !getRequiresSubscriptionFromBrowserCookie() && <AccountLifecyclePopup />}
		</div>
	);
}
