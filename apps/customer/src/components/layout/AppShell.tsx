"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthStatus } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import MyPagesSubSidebar from "./sidebar/MyPagesSubSidebar";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";

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

const PUBLIC_PAGES = ["/create-offer"];

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, isReady } = useAuthStatus();
	const isMyPages = pathname.startsWith("/tools/my-pages");
	const isAuthPage = AUTH_PAGES.includes(pathname);
	const isPublicPage = PUBLIC_PAGES.includes(pathname);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	useEffect(() => {
		setMobileNavOpen(false);
	}, [pathname]);

	useEffect(() => {
		if (!isReady) return;

		if (isPublicPage) {
			setIsCheckingAuth(false);
			return;
		}
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
	}, [isReady, isAuthenticated, isAuthPage, isPublicPage, pathname, router]);

	if (!isReady) {
		return <Loader />;
	}

	if (isAuthPage) {
		if (isAuthenticated) {
			return <Loader />;
		}
		return <>{children}</>;
	}
	if (isPublicPage) return <>{children}</>;

	if (isCheckingAuth) {
		return <Loader />;
	}

	return (
		<div className="flex h-screen overflow-hidden">
			<div className="hidden h-full md:block">
				{isMyPages ? <MyPagesSubSidebar /> : <Sidebar />}
			</div>
			<Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
				<SheetContent side="left" showCloseButton={false} className="w-[min(20rem,85vw)] gap-0 border-0 p-0 md:hidden">
					<SheetTitle className="sr-only">Navigation</SheetTitle>
					<SheetClose className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-md text-white hover:bg-white/15" aria-label="Close navigation">
						<X className="size-5" />
					</SheetClose>
					{isMyPages ? (
						<MyPagesSubSidebar mobile onNavigate={() => setMobileNavOpen(false)} />
					) : (
						<Sidebar mobile onNavigate={() => setMobileNavOpen(false)} />
					)}
				</SheetContent>
			</Sheet>
			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				<Header onOpenNavigation={() => setMobileNavOpen(true)} />
				<main
					className={`flex flex-1 flex-col bg-white ${isMyPages ? "overflow-hidden" : "overflow-auto"}`}
				>
					{children}
				</main>
			</div>
		</div>
	);
}
