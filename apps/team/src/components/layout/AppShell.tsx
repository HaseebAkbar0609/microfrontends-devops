"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import MyPagesSubSidebar from "./sidebar/MyPagesSubSidebar";
import { useAuthStatus } from "@/context/AuthContext";
import { getFlyoutSubSidebarConfigByPath } from "./sidebar/navConfig";
import { SalesMobileNav, SalesSubSidebar } from "@/features/sales/components/layout/SalesSubSidebar";
import { isSalesModulePath } from "@/features/sales/constants/salesNav";
import { MarketingMobileNav, MarketingSubSidebar } from "@/features/marketing/components/layout/MarketingSubSidebar";
import { isMarketingModulePath } from "@/features/marketing/constants/marketingNav";
import { ContentSubSidebar } from "@/features/content/components/layout/ContentSubSidebar";
import { isContentConsolePath } from "@/features/content/constants/contentNav";
interface AppShellProps {
	children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, isReady } = useAuthStatus();
	const didRedirect = useRef(false);
	const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

	// This is for temporary purposes to hide the sidebar and header on auth routes to match the requirements of the project
	const authRoutes = ["/login", "/register", "/forgot-password", "/my-companies", "/manage-plans"];
	const isAuthRoute = pathname === "/teams/invitation" || authRoutes.some((route) => pathname.startsWith(route));
	const flyoutSubSidebarConfig = getFlyoutSubSidebarConfigByPath(pathname);
	const hasFlyoutSubSidebar = !!flyoutSubSidebarConfig;
	const isSalesModule = isSalesModulePath(pathname);
	const isMarketingModule = isMarketingModulePath(pathname);
	const isContentConsole = isContentConsolePath(pathname);
	const hasSubSidebar =
		hasFlyoutSubSidebar || isSalesModule || isMarketingModule || isContentConsole;

	useEffect(() => {
		if (!isReady || didRedirect.current) return;
		if (!isAuthenticated && !isAuthRoute) {
			didRedirect.current = true;
			router.replace("/login");
		}
	}, [isReady, isAuthenticated, isAuthRoute, router]);

	useEffect(() => {
		setMobileNavigationOpen(false);
	}, [pathname]);

	if (!isReady) return null;
	if (!isAuthenticated && !isAuthRoute) return null;

	if (isAuthRoute) {
		return <>{children}</>;
	}

		return (
			<div className="flex h-screen flex-1 flex-col overflow-hidden">
				<div className="flex flex-1 overflow-hidden">
					<div className="hidden h-full md:block">
						<Sidebar autoCollapse={hasSubSidebar} />
					</div>
					{mobileNavigationOpen && (
						<div className="fixed inset-0 z-40 md:hidden">
							<button
								type="button"
								aria-label="Close navigation"
								className="absolute inset-y-0 left-60 right-0 bg-black/40"
								onClick={() => setMobileNavigationOpen(false)}
							/>
							<div className="absolute inset-y-0 left-0 w-60 shadow-xl">
								<Sidebar />
							</div>
						</div>
					)}
					{isSalesModule && <SalesSubSidebar />}
					{isMarketingModule && <MarketingSubSidebar />}
					{isContentConsole && <ContentSubSidebar />}
					{flyoutSubSidebarConfig && (
						<MyPagesSubSidebar
							titleKey={flyoutSubSidebarConfig.titleKey}
							items={flyoutSubSidebarConfig.items}
						/>
					)}

					<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
						<Header onOpenNavigation={() => setMobileNavigationOpen(true)} />
						{isSalesModule && <SalesMobileNav />}
						{isMarketingModule && <MarketingMobileNav />}
						<main
							className={`flex min-w-0 flex-1 flex-col bg-white hide-scrollbar ${hasSubSidebar ? "overflow-hidden" : "overflow-auto"}`}
						>
							{children}
						</main>
					</div>
				</div>
			</div>
		);
}
