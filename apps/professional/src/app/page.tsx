"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuthStatus } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { getRequiresSubscriptionFromBrowserCookie } from "@/lib/requiresSubscriptionCookie";

export default function Home() {
	const router = useRouter();
	const { isAuthenticated, isReady } = useAuthStatus();
	const didRedirect = useRef(false);

	useEffect(() => {
		if (!isReady || didRedirect.current) return;
		didRedirect.current = true;

		if (isAuthenticated) {
			router.replace(
				getRequiresSubscriptionFromBrowserCookie()
					? "/manage-plans"
					: "/dashboard",
			);
		} else {
			router.replace("/login");
		}
	}, [isReady, isAuthenticated, router]);

	return <Loader />;
}
