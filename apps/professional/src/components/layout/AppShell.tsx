"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStatus } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { getRequiresSubscriptionFromBrowserCookie } from "@/lib/requiresSubscriptionCookie";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import { AgreementSubSidebar } from "./sidebar/AgreementSubSidebar";
import DynamicSubSidebar from "./sidebar/DynamicSubSidebar";
import { CalculationDetailSubSidebar } from "./sidebar/CalculationDetailSubSidebar";
import { financialSidebarItems } from "@/features/financial-management/constants";
import { businessSupportSidebarItems } from "@/features/business-support/constants";
import localizationConstants from "@/utils/translation/constants";

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
	return prefixes.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);
}

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, isReady } = useAuthStatus();
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	const isAuthRoute = pathMatchesPrefixes(pathname, AUTH_ROUTE_PREFIXES);
	const isPublicPage = pathMatchesPrefixes(pathname, PUBLIC_ROUTE_PREFIXES);
	const calcDetailMatch = pathname.match(
		/^\/module\/business\/calculation\/overview\/([^/]+)/,
	);
	const isCalculationDetailRoute = !!calcDetailMatch;
	const calculationDetailId = calcDetailMatch?.[1] ?? "";
	const isFinancialNavRoute = pathname.startsWith(
		"/module/financial-management",
	);
	const isBusinessSupportNavRoute = pathname.startsWith(
		"/module/business-support",
	);

	useEffect(() => {
		if (!isReady) return;

		if (
			isAuthenticated &&
			isPublicPage &&
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
			const destination = subscriptionRequired
				? "/manage-plans"
				: "/home";
			router.replace(destination);
			return;
		}

		if (!isAuthenticated && !isAuthRoute && !isPublicPage) {
			router.replace("/login");
			return;
		}

		if (!isAuthenticated && pathname === "/my-companies") {
			router.replace("/login");
			return;
		}

		setIsCheckingAuth(false);
	}, [isReady, isAuthenticated, isAuthRoute, isPublicPage, pathname, router]);

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

	const isAgreementPath = pathname.startsWith(
		"/module/business-support/agreement",
	);

	return (
		<div className="flex h-screen flex-1 overflow-hidden">
			{!isPublicPage && <Sidebar autoCollapse />}
			{isAgreementPath ? (
				<AgreementSubSidebar />
			) : isCalculationDetailRoute ? (
				<CalculationDetailSubSidebar calcId={calculationDetailId} />
			) : isFinancialNavRoute ? (
				<DynamicSubSidebar
					titleKey={localizationConstants.financialManagement}
					items={financialSidebarItems}
					hideBack={true}
				/>
			) : isBusinessSupportNavRoute ? (
				<DynamicSubSidebar
					titleKey={localizationConstants.businessSupport}
					items={businessSupportSidebarItems}
					hideBack={true}
				/>
			) : null}
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				<main className="flex flex-1 flex-col bg-white overflow-y-auto min-h-0">
					{children}
				</main>
			</div>
		</div>
	);
}
