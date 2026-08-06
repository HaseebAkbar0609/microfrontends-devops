"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStatus } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { getRequiresSubscriptionFromBrowserCookie } from "@/lib/requiresSubscriptionCookie";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import MyPagesSubSidebar from "./sidebar/MyPagesSubSidebar";
import { AgreementSubSidebar } from "./sidebar/AgreementSubSidebar";
import { InvoiceSubSidebar } from "./sidebar/InvoiceSubSidebar";
import DynamicSubSidebar from "./sidebar/DynamicSubSidebar";
import { OfferDetailSubSidebar } from "./sidebar/OfferDetailSubSidebar";
import {
	getFlyoutSubSidebarConfigByPath,
	HIDDEN_SUBSIDEBAR_PATH_PREFIXES,
} from "./sidebar/navConfig";
import { offerSidebarItems, goToItems } from "@/features/offer/constants";
import { b2bSidebarItems } from "@/features/b2b/constants";
import localizationConstants from "@/utils/translation/constants";
import { CircleDollarSign } from "lucide-react";

const OFFER_NAMED_ROUTES = ["dashboard", "list", "archive", "send"];

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
	const isB2BNavRoute = pathname.startsWith("/module/business/b2b");
	const isOfferModuleRoute = pathname.startsWith("/module/business/offer/");
	const offerSegment = isOfferModuleRoute
		? (pathname.match(/^\/module\/business\/offer\/([^/]+)/)?.[1])
		: undefined;
	// /offer/send/[offerId] â€” extract the real offerId from the second segment
	const sendOfferMatch = isOfferModuleRoute
		? pathname.match(/^\/module\/business\/offer\/send\/([^/?]+)/)
		: null;
	const sendOfferId = sendOfferMatch?.[1];
	const isOfferDetailRoute =
		!!offerSegment && !OFFER_NAMED_ROUTES.includes(offerSegment);
	const isOfferNavRoute = isOfferModuleRoute && !isOfferDetailRoute && !sendOfferId;
	const flyoutSubSidebarConfig = getFlyoutSubSidebarConfigByPath(pathname);
	const showSubSidebar =
		!!flyoutSubSidebarConfig &&
		!isPublicPage &&
		!pathMatchesPrefixes(pathname, HIDDEN_SUBSIDEBAR_PATH_PREFIXES);

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
			// Let users stay on /invitation or /my-companies even with an existing session.
			if (pathname === "/invitation" || pathname.startsWith("/invitation/") || pathname === "/my-companies") {
				setIsCheckingAuth(false);
				return;
			}

			const subscriptionRequired = getRequiresSubscriptionFromBrowserCookie();
			const destination =
				pathname === "/register" || subscriptionRequired
					? "/manage-plans"
					: "/home";
			router.replace(destination);
			return;
		}

		if (!isAuthenticated && (!isAuthRoute && !isPublicPage)) {
			router.replace("/login");
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

	if (!isReady) {
		return <Loader />;
	}

	if (isAuthRoute && isAuthenticated) {
		if (pathname === "/invitation" || pathname.startsWith("/invitation/") || pathname === "/my-companies") {
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

	const isAgreementPath = pathname.startsWith("/module/business-support/agreement");
	const isRegisterPath = pathname.startsWith("/tools/register") && !isAgreementPath;

	return (
		<div className="flex h-screen flex-1 overflow-hidden">
			{!isPublicPage && <Sidebar autoCollapse />}
			{isAgreementPath ? (
				<AgreementSubSidebar />
			) : isRegisterPath ? (
				<InvoiceSubSidebar />
			) : sendOfferId ? (
				<OfferDetailSubSidebar offerId={sendOfferId} />
			) : isOfferDetailRoute ? (
				<OfferDetailSubSidebar offerId={offerSegment!} />
			) : isOfferNavRoute ? (
				<DynamicSubSidebar
					titleKey={localizationConstants.offer}
					headerIcon={CircleDollarSign}
					items={offerSidebarItems}
					hideBack={true}
					additionalSection={{
						titleKey: localizationConstants.goTo,
						items: goToItems,
					}}
				/>
			) : isB2BNavRoute ? (
				<DynamicSubSidebar
					titleKey={localizationConstants.b2b}
					items={b2bSidebarItems}
					hideBack={true}
				/>
			) : showSubSidebar ? (
				<MyPagesSubSidebar
					titleKey={flyoutSubSidebarConfig.titleKey}
					items={flyoutSubSidebarConfig.items}
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

