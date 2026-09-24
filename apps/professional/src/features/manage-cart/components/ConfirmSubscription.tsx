"use client";

import {
	changeSubscriptionFromCartAction,
	checkoutSubscriptionAction,
	clearCartAction,
	completeSubscriptionAction,
} from "@/api-actions";
import { LabeledCheckbox } from "@/components/common/LabeledCheckbox";
import { Button } from "@/components/ui/button";
import { useAuthStatus, type User } from "@/context/AuthContext";
import { MANAGE_PLANS_PLAN_IDS } from "@/features/manage-plans";
import { authStorage } from "@/lib/authStorage";
import { showToast } from "@/lib/toast";
import { formatCartCurrencyFromOre } from "../utils/currency";
import { cartMessages } from "@/constants/messages";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { type ConfirmSubscriptionProps } from "../types";
import { CheckoutPaymentDetails } from "./CheckoutPaymentDetails";

/** Free checkout API may return `complete`, `active`, etc. (case-insensitive). */
function isSubscriptionCheckoutTerminalStatus(
	status: string | undefined,
): boolean {
	if (!status || typeof status !== "string") return false;
	const normalized = status.trim().toLowerCase();
	return (
		normalized === "complete" ||
		normalized === "completed" ||
		normalized === "active" ||
		normalized === "succeeded"
	);
}

export function ConfirmSubscription({
	items,
	subtotal,
	total,
	onBackToCart,
	isPlanChange = false,
}: ConfirmSubscriptionProps) {
	const router = useRouter();
	const t = useTranslate();
	const { company, user, hydrateFromStorage } = useAuthStatus();
	const profile = user as User | null;
	const mainItem = items[0];
	const [view, setView] = useState<"confirm" | "checkout">("confirm");
	const viewRef = useRef<HTMLDivElement>(null);
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		viewRef.current?.closest("main")?.scrollTo({ top: 0 });
	}, [view]);

	const isFreeOnlyCart =
		items.length === 1 && items[0]?.planKey === MANAGE_PLANS_PLAN_IDS.FREE;

	if (view === "checkout") {
		return (
			<div ref={viewRef}>
			<CheckoutPaymentDetails
				items={items}
				subtotal={subtotal}
				total={total}
				onBack={() => setView("confirm")}
				onCancelToCart={onBackToCart}
			/>
			</div>
		);
	}

	return (
		<div ref={viewRef} className="space-y-6">
			<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
				<div className="min-w-0 space-y-6 [&_p]:break-words">
					<div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
						<h2 className="text-lg font-semibold text-secondary">
							<Translate
								text={
									localizationConstants.manageCartSubscriptionPlanTitle
								}
							/>
						</h2>
						<div className="grid gap-4 text-sm  text-foreground md:grid-cols-2">
							<div className="space-y-1">
								<p className="font-semibold text-gray-700">
									<Translate
										text={
											localizationConstants.manageCartSubscriptionMembershipLabel
										}
									/>
								</p>
								<p>{mainItem?.name ?? "—"}</p>
							</div>
							<div className="space-y-1">
								<p className="font-semibold text-gray-700">
									<Translate
										text={
											localizationConstants.manageCartSubscriptionBillingOptionLabel
										}
									/>
								</p>
								<p className="text-gray-500 capitalize">
									{mainItem?.interval ?? "—"}
								</p>
							</div>
							<div className="space-y-1">
								<p className="font-semibold text-gray-700">
									<Translate
										text={
											localizationConstants.manageCartSubscriptionPriceLabel
										}
									/>
								</p>
								<p className="text-gray-500">
									{formatCartCurrencyFromOre(mainItem?.unitPrice ?? 0)}
								</p>
							</div>
							<div className="space-y-1">
								<p className="font-semibold text-gray-700">
									<Translate
										text={
											localizationConstants.manageCartSubscriptionFrequencyLabel
										}
									/>
								</p>
								<p className="text-gray-700">
									Billed {formatCartCurrencyFromOre(subtotal)}{" "}
									{mainItem?.interval ?? "—"}
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
						<h2 className="text-lg font-semibold text-secondary">
							<Translate
								text={
									localizationConstants.manageCartContactInformationTitle
								}
							/>
						</h2>
						<div className="grid gap-5 text-sm text-secondary sm:grid-cols-2 [&>div]:min-w-0 [&_p]:break-words">
							<div className="space-y-1">
								<p className="font-semibold text-gray-700">
									<Translate
										text={
											localizationConstants.manageCartCompanyNameLabel
										}
									/>
								</p>
								<p className="text-gray-500">
									{company?.company_name ?? "—"}
								</p>
							</div>
							<div className="space-y-1">
								<p className="font-semibold text-gray-700">
									<Translate
										text={
											localizationConstants.manageCartContactPersonLabel
										}
									/>
								</p>
								<p className="text-gray-500">
									{profile?.first_name || profile?.last_name
										? `${profile?.first_name} ${profile?.last_name}`
										: "—"}
								</p>
							</div>
							<div className="space-y-1">
								<p className="font-semibold text-gray-700">
									<Translate
										text={
											localizationConstants.manageCartEmailLabel
										}
									/>
								</p>
								<p className="text-gray-500">
									{profile?.email ?? "—"}
								</p>
							</div>
							<div className="space-y-1">
								<p className="font-semibold text-gray-700">
									<Translate
										text={
											localizationConstants.manageCartOrganisationNumberLabel
										}
									/>
								</p>
								<p className="text-gray-500">
									{company?.organization_number ?? "—"}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="min-w-0 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
					<h2 className="text-lg font-semibold text-secondary">
						<Translate
							text={
								localizationConstants.manageCartOrderOverviewTitle
							}
						/>
					</h2>

					<div className="pt-2 text-sm text-secondary">
						<div className="flex items-center justify-between border-b border-t border-border py-2">
							<span className="text-gray-700">
								<Translate
									text={
										localizationConstants.manageCartSubtotalLabel
									}
								/>
							</span>
							<span className="text-secondary">
								{formatCartCurrencyFromOre(subtotal)}
							</span>
						</div>
						{/* <div className="flex items-center justify-between border-b border-border py-2">
              <span className="text-gray-700">
                <Translate text={localizationConstants.manageCartTaxLabel} />
              </span>
              <span className="text-secondary">
                {formatCurrency(subtotal * 0.25)}
              </span>
            </div> */}
						<div className="flex items-center justify-between font-semibold border-b border-border py-2">
							<span className="text-base text-gray-700">
								<Translate
									text={
										localizationConstants.manageCartTotalLabel
									}
								/>
							</span>
							<span className="text-base text-secondary">
								{formatCartCurrencyFromOre(total)}
							</span>
						</div>
					</div>
					<LabeledCheckbox
						label={localizationConstants.manageCartTermsText}
						checked={acceptedTerms}
						onChange={setAcceptedTerms}
					/>
					<div className="flex flex-col-reverse gap-3 pt-2 [&_button]:h-auto [&_button]:min-h-11 [&_button]:w-full [&_button]:whitespace-normal [&_button]:py-2">
						<Button variant="outline" onClick={onBackToCart}>
							<Translate
								text={
									localizationConstants.manageCartBackToCart
								}
							/>
						</Button>
						<Button
							variant="primary"
							onClick={async () => {
								if (
									!acceptedTerms ||
									items.length === 0 ||
									isSubmitting
								)
									return;

								if (isFreeOnlyCart) {
									setIsSubmitting(true);
									try {
										const checkout =
											await checkoutSubscriptionAction(
												{},
												{
													suppressSuccessToast: true,
												},
											);
										if (!checkout.success || !checkout.data)
											return;

										if (
											!isSubscriptionCheckoutTerminalStatus(
												checkout.data.status,
											)
										) {
											showToast(
												"error",
												cartMessages.checkoutPayment
													.checkoutFailed,
											);
											return;
										}

										const accessToken =
											authStorage
												.getAccessToken()
												?.trim() ?? "";
										if (!accessToken) {
											showToast(
												"error",
												cartMessages.checkoutPayment
													.missingPaymentToken,
											);
											return;
										}

										const complete =
											await completeSubscriptionAction({
												payment_token: accessToken,
											});
										if (!complete.success) return;

										hydrateFromStorage();
										showToast(
											"success",
											cartMessages.checkoutPayment
												.licensePurchasedSuccess,
										);
										router.replace("/home");
										router.refresh();
									} finally {
										setIsSubmitting(false);
									}
									return;
								}

								if (isPlanChange) {
									setIsSubmitting(true);
									try {
										const change =
											await changeSubscriptionFromCartAction();
										if (!change.success || !change.data) return;

										if (change.data.client_secret) {
											const publishableKey =
												process.env
													.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
											if (!publishableKey) {
												showToast("error", "Stripe key is missing.");
												return;
											}
											const stripe = await loadStripe(publishableKey);
											const confirmation = await stripe?.confirmCardPayment(
												change.data.client_secret,
											);
											if (confirmation?.error) {
												showToast(
													"error",
													confirmation.error.message ??
														"Authentication failed.",
												);
												return;
											}
											await clearCartAction();
										}

										showToast(
											"success",
											change.data.change_type ===
											"downgrade_scheduled"
												? t(localizationConstants.manageCartChangeScheduled)
												: t(localizationConstants.manageCartChangeSucceeded),
										);
										router.replace("/admin/subscription");
										router.refresh();
									} finally {
										setIsSubmitting(false);
									}
									return;
								}

								setView("checkout");
							}}
							disabled={
								!acceptedTerms ||
								items.length === 0 ||
								isSubmitting
							}
						>
							<Translate
								text={
									isPlanChange
										? localizationConstants.manageCartApplyChangesButton
										: localizationConstants.manageCartCheckoutButton
								}
							/>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
