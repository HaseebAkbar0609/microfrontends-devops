"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStatus } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import MyPagesSubSidebar from "./sidebar/MyPagesSubSidebar";

interface AppShellProps {
	children: React.ReactNode;
}

const AUTH_PAGES = ["/login", "/forgot-password", "/register"];

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, isReady } = useAuthStatus();
	const isMyPages = pathname.startsWith("/tools/my-pages");
	const isAuthPage = AUTH_PAGES.includes(pathname);

	useEffect(() => {
		if (!isReady) return;

		if (isAuthPage) {
			if (isAuthenticated) {
				router.replace("/home");
			}
			return;
		}

		if (!isAuthenticated) {
			router.replace("/login");
		}
	}, [isReady, isAuthenticated, isAuthPage, router]);

	if (!isReady) {
		return <Loader />;
	}

	if (isAuthPage) {
		if (isAuthenticated) {
			return <Loader />;
		}
		return <>{children}</>;
	}

	if (!isAuthenticated) {
		return <Loader />;
	}

	return (
		<div className="flex h-screen overflow-hidden">
			{!isMyPages && <Sidebar />}
			{isMyPages && <MyPagesSubSidebar />}
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				<main
					className={`flex flex-1 flex-col bg-slate-50 ${isMyPages ? "overflow-hidden" : "overflow-auto"}`}
				>
					{children}
				</main>
			</div>
		</div>
	);
}
