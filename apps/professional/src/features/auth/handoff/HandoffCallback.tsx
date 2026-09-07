"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";

import { exchangeHandoffCodeAction } from "@/api-actions";
import { authStorage } from "@/lib/authStorage";
import { getRequiresSubscriptionFromBrowserCookie } from "@/lib/requiresSubscriptionCookie";
import { showToast } from "@/lib/toast";
import { Company, useAuthStatus, User } from "@/context/AuthContext";

/**
 * Landing page's /login redirects here with a single-use code after a
 * successful login, instead of straight to /login (which would just ask
 * the user to sign in a second time). Redeem the code, apply the session,
 * and continue on — no credentials handled here.
 */
export function HandoffCallback() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { setAccessToken, setUser, setCompany } = useAuthStatus();
	const hasRun = useRef(false);

	useEffect(() => {
		if (hasRun.current) return;
		hasRun.current = true;

		const code = searchParams.get("code");
		const rawNext = searchParams.get("next");

		if (!code) {
			router.replace("/login");
			return;
		}

		exchangeHandoffCodeAction(code).then((result) => {
			if (result.success) {
				flushSync(() => {
					setUser(authStorage.getUserData() as User);
					setAccessToken(authStorage.getAccessToken());
					setCompany(authStorage.getCompanyData() as Company);
				});
				const destination = getRequiresSubscriptionFromBrowserCookie()
					? "/manage-plans"
					: rawNext?.startsWith("/")
						? rawNext
						: "/home";
				router.replace(destination);
			} else {
				showToast("error", result.error || "Inloggningen misslyckades.");
				router.replace("/login");
			}
		});
	}, [router, searchParams, setAccessToken, setUser, setCompany]);

	return (
		<div className="flex flex-1 items-center justify-center py-24">
			<p className="text-sm text-muted-foreground">Loggar in …</p>
		</div>
	);
}
