"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthStatus } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import MyPagesSubSidebar from "./sidebar/MyPagesSubSidebar";

interface AppShellProps {
	children: React.ReactNode;
}

const AUTH_PAGES = [
	"/login",
	"/forgot-password",
	"/register",
	// Landing page's login redirects here with a handoff code; it isn't
	// authenticated yet by definition, so it must be treated as an auth
	// page here too or this redirects to /login before it can run. Keep
	// in sync with the AUTH_ROUTES allowlist in middleware.ts.
	"/auth/callback",
];

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, isReady } = useAuthStatus();
	const isMyPages = pathname.startsWith("/tools/my-pages");
	const isAuthPage = AUTH_PAGES.includes(pathname);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	useEffect(() => {
		if (!isReady) return;

		if (isAuthPage) {
			if (isAuthenticated) {
				// Navigation handled by LoginForm (router.push) + middleware server-side.
				// Calling router.replace here competed with LoginForm's navigation and caused a hang.
			} else {
				setIsCheckingAuth(false);
			}
			return;
		}

		if (!isAuthenticated) {
			router.replace("/login");
		} else {
			setIsCheckingAuth(false);
		}
	}, [isReady, isAuthenticated, isAuthPage, pathname, router]);

	if (!isReady) {
		return <Loader />;
	}

	if (isAuthPage) {
		if (isAuthenticated) {
			return <Loader />;
		}
		return <>{children}</>;
	}

	if (isCheckingAuth) {
		return <Loader />;
	}

	return (
		<div className="flex h-screen overflow-hidden">
			{!isMyPages && <Sidebar />}
			{isMyPages && <MyPagesSubSidebar />}
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				<main
					className={`flex flex-1 flex-col bg-white ${isMyPages ? "overflow-hidden" : "overflow-auto"}`}
				>
					{children}
				</main>
			</div>
		</div>
	);
}
