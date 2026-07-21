"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import MyPagesSubSidebar from "./sidebar/MyPagesSubSidebar";
import { useAuthStatus } from "@/context/AuthContext";
import { getFlyoutSubSidebarConfigByPath } from "./sidebar/navConfig";
interface AppShellProps {
	children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, isReady } = useAuthStatus();
	const didRedirect = useRef(false);

	// This is for temporary purposes to hide the sidebar and header on auth routes to match the requirements of the project
	const authRoutes = ["/login", "/register", "/forgot-password", "/my-companies", "/manage-plans"];
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
	const flyoutSubSidebarConfig = getFlyoutSubSidebarConfigByPath(pathname);
	const hasFlyoutSubSidebar = !!flyoutSubSidebarConfig;
	const hasSubSidebar = hasFlyoutSubSidebar;

	useEffect(() => {
		if (!isReady || didRedirect.current) return;
		if (!isAuthenticated && !isAuthRoute) {
			didRedirect.current = true;
			router.replace("/login");
		}
	}, [isReady, isAuthenticated, isAuthRoute, router]);

	if (!isReady) return null;
	if (!isAuthenticated && !isAuthRoute) return null;

	if (isAuthRoute) {
		return <>{children}</>;
	}

	return (
		<div className="flex h-screen flex-1 flex-col overflow-hidden">
			<div className="flex flex-1 overflow-hidden">
				<Sidebar autoCollapse={hasSubSidebar} />
				{flyoutSubSidebarConfig && (
					<MyPagesSubSidebar
						titleKey={flyoutSubSidebarConfig.titleKey}
						items={flyoutSubSidebarConfig.items}
					/>
				)}

				<div className="flex flex-1 flex-col overflow-hidden">
					<Header />
					<main
						className={`flex flex-1 flex-col bg-white hide-scrollbar ${hasFlyoutSubSidebar ? "overflow-hidden" : "overflow-auto"}`}
					>
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}
