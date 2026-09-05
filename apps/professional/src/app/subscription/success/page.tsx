"use client";

import { getHostedCheckoutStatusAction } from "@/api-actions/payment/hostedCheckout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

type ViewState = "checking" | "confirmed" | "delayed" | "failed";

function SubscriptionSuccessContent() {
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id")?.trim() ?? "";
	const [state, setState] = useState<ViewState>("checking");
	const [attempt, setAttempt] = useState(0);

	const verify = useCallback(async () => {
		if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
			setState("failed");
			return;
		}
		setState("checking");
		for (let index = 0; index < 20; index += 1) {
			const result = await getHostedCheckoutStatusAction(sessionId);
			if (result.success && result.data) {
				if (
					result.data.checkout_status === "completed" &&
					result.data.payment_status === "active" &&
					["active", "trialing"].includes(
						result.data.subscription_status ?? "",
					)
				) {
					setState("confirmed");
					return;
				}
				if (
					result.data.checkout_status === "expired" ||
					["restricted", "canceled"].includes(result.data.payment_status)
				) {
					setState("failed");
					return;
				}
			}
			await new Promise((resolve) => window.setTimeout(resolve, 1000));
		}
		setState("delayed");
	}, [sessionId]);

	useEffect(() => {
		void verify();
	}, [attempt, verify]);

	const retry = () => setAttempt((value) => value + 1);

	return (
		<div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-background px-4 py-12">
			<section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
				{state === "checking" && (
					<>
						<LoaderCircle className="mx-auto size-14 animate-spin text-primary" />
						<h1 className="mt-5 text-2xl font-semibold text-secondary">
							Confirming your payment
						</h1>
						<p className="mt-2 text-gray-600">
							Stripe has returned you safely. We are waiting for the signed
							payment confirmation.
						</p>
					</>
				)}

				{state === "confirmed" && (
					<>
						<CheckCircle2 className="mx-auto size-14 text-emerald-600" />
						<h1 className="mt-5 text-2xl font-semibold text-secondary">
							Payment confirmed
						</h1>
						<p className="mt-2 text-gray-600">
							Your Standard monthly subscription payment was verified
							successfully.
						</p>
					</>
				)}

				{(state === "delayed" || state === "failed") && (
					<>
						<CircleAlert className="mx-auto size-14 text-amber-600" />
						<h1 className="mt-5 text-2xl font-semibold text-secondary">
							{state === "delayed"
								? "Confirmation is taking longer than expected"
								: "We could not confirm this checkout"}
						</h1>
						<p className="mt-2 text-gray-600">
							Do not submit another payment. Retry the confirmation first.
						</p>
						<Button className="mt-6" variant="primary" onClick={retry}>
							Retry confirmation
						</Button>
					</>
				)}

				<div className="mt-8 border-t border-border pt-5">
					<Button asChild variant="outline">
						<Link href="/manage-plans">Return to plans</Link>
					</Button>
				</div>
			</section>
		</div>
	);
}

export default function SubscriptionSuccessPage() {
	return (
		<Suspense
			fallback={<div className="min-h-[calc(100vh-72px)] bg-background" />}
		>
			<SubscriptionSuccessContent />
		</Suspense>
	);
}
