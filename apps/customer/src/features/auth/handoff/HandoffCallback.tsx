"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { exchangeHandoffCodeAction } from "@/api-actions";
import { useAuthStatus } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";

/**
 * Landing page's /login redirects here with a single-use code after a
 * successful login, instead of straight to /login (which would just ask
 * the user to sign in a second time). Redeem the code, apply the session,
 * and continue on to `next` — no credentials handled here.
 */
export function HandoffCallback() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { setAccessToken, setUser } = useAuthStatus();
	const hasRun = useRef(false);

	useEffect(() => {
		if (hasRun.current) return;
		hasRun.current = true;

		const code = searchParams.get("code");
		const rawNext = searchParams.get("next");
		const redirectTo = rawNext?.startsWith("/") ? rawNext : "/home";

		if (!code) {
			router.replace("/login");
			return;
		}

		exchangeHandoffCodeAction(code, { setAccessToken, setUser }).then(
			(result) => {
				if (result.success) {
					router.replace(redirectTo);
				} else {
					showToast("error", result.error || "Inloggningen misslyckades.");
					router.replace("/login");
				}
			},
		);
	}, [router, searchParams, setAccessToken, setUser]);

	return (
		<div className="flex flex-1 items-center justify-center py-24">
			<p className="text-sm text-gray-500">Loggar in …</p>
		</div>
	);
}
