"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStatus } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { getRequiresSubscriptionFromBrowserCookie } from "@/lib/requiresSubscriptionCookie";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import MyPagesSubSidebar from "./sidebar/MyPagesSubSidebar";
import { getFlyoutSubSidebarConfigByPath } from "./sidebar/navConfig";

interface AppShellProps {
	children: React.ReactNode;
}

const AUTH_ROUTE_PREFIXES = [
	"/login",
	"/register",
	"/forgot-password",
	"/my-companies",
	"/invitation",
];

const PUBLIC_ROUTE_PREFIXES = ["/manage-plans", "/manage-cart"];

function pathMatchesPrefixes(pathname: string, prefixes: string[]) {
	return prefixes.some((prefix) => pathname.startsWith(prefix));
}

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, isReady } = useAuthStatus();
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	const isAuthRoute = pathMatchesPrefixes(pathname, AUTH_ROUTE_PREFIXES);
	const isPublicPage = pathMatchesPrefixes(pathname, PUBLIC_ROUTE_PREFIXES);
	const flyoutSubSidebarConfig = getFlyoutSubSidebarConfigByPath(pathname);

	useEffect(() => {
		if (!isReady) return;

		if (
			isAuthenticated &&
			isPublicPage &&
			!getRequiresSubscriptionFromBrowserCookie()
		) {
			setIsCheckingAuth(false);
			router.replace("/dashboard");
			return;
		}

		if (isAuthRoute && isAuthenticated) {
			// Let users stay on /invitation?token=… to accept (even with an existing session).
			if (pathname === "/invitation" || pathname.startsWith("/invitation/")) {
				setIsCheckingAuth(false);
				return;
			}

			setIsCheckingAuth(false);
			const subscriptionRequired = getRequiresSubscriptionFromBrowserCookie();
			const destination =
				pathname === "/register" || subscriptionRequired
					? "/manage-plans"
					: "/dashboard";
			router.replace(destination);
			return;
		}

		if (!isAuthenticated && !isAuthRoute && !isPublicPage) {
			router.replace("/login");
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

	if (!isReady) {
		return <Loader />;
	}

	if (isAuthRoute && isAuthenticated) {
		if (pathname === "/invitation" || pathname.startsWith("/invitation/")) {
			return <>{children}</>;
		}
		return <Loader />;
	}

	if (isAuthRoute) {
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
			{flyoutSubSidebarConfig && !isPublicPage && (
				<MyPagesSubSidebar
					titleKey={flyoutSubSidebarConfig.titleKey}
					items={flyoutSubSidebarConfig.items}
				/>
			)}
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				<main
					className={`flex flex-1 flex-col bg-white pb-6 ${
						flyoutSubSidebarConfig ? "overflow-hidden" : "overflow-auto"
					}`}
				>
					{children}
				</main>
			</div>
		</div>
	);
}
