import { Metadata } from "next";
import { Suspense } from "react";
import { HandoffCallback } from "@/features/auth/handoff/HandoffCallback";

export const metadata: Metadata = {
	title: "Timeflow",
	description: "Signing you in…",
};

export default function AuthCallbackPage() {
	return (
		<Suspense>
			<HandoffCallback />
		</Suspense>
	);
}
