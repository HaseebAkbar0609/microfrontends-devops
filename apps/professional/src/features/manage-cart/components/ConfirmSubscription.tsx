"use client";

import {
	checkoutSubscriptionAction,
	completeSubscriptionAction,
} from "@/api-actions";
import { createHostedCheckoutAction } from "@/api-actions/payment/hostedCheckout";
import { LabeledCheckbox } from "@/components/common/LabeledCheckbox";
import { Button } from "@/components/ui/button";
import { useAuthStatus, type User } from "@/context/AuthContext";
import { MANAGE_PLANS_PLAN_IDS } from "@/features/manage-plans";
import { authStorage } from "@/lib/authStorage";
import { showToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";
import { cartMessages } from "@/constants/messages";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
}: ConfirmSubscriptionProps) {
	const router = useRouter();
	const { company, user, hydrateFromStorage } = useAuthStatus();
	const profile = user as User | null;
	const mainItem = items[0];
	const startItem = items.find(
		(item) => item.planKey === MANAGE_PLANS_PLAN_IDS.START,
	);
	const standardItem = items.find(
		(item) => item.planKey === MANAGE_PLANS_PLAN_IDS.STANDARD,
	);
	const [view, setView] = useState<"confirm" | "checkout">("confirm");
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isFreeOnlyCart =
		items.length === 1 && items[0]?.planKey === MANAGE_PLANS_PLAN_IDS.FREE;
	const useHostedCheckoutMvp =
		process.env.NEXT_PUBLIC_TFS825_PAYMENT_MVP === "true" &&
		items.length === 2 &&
		startItem?.interval === "monthly" &&
		startItem.quantity === 1 &&
		standardItem?.interval === "monthly";

	if (view === "checkout") {
		return (
			<CheckoutPaymentDetails
				items={items}
				subtotal={subtotal}
				total={total}
				onBack={() => setView("confirm")}
				onCancelToCart={onBackToCart}
			/>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
				<div className="space-y-4">
					<div className="rounded-xl bg-white p-6  space-y-4">
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
									{formatCurrency((mainItem?.unitPrice ?? 0) / 100)}
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
									Billed {formatCurrency(subtotal)}{" "}
									{mainItem?.interval ?? "—"}
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-xl bg-white p-6 space-y-4">
						<h2 className="text-lg font-semibold text-secondary">
							<Translate
								text={
									localizationConstants.manageCartContactInformationTitle
								}
							/>
						</h2>
						<div className="grid gap-4 text-sm text-secondary md:grid-cols-2">
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

				<div className="space-y-4 rounded-[10px] bg-white p-6">
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
								{formatCurrency(subtotal)}
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
								{formatCurrency(total)}
							</span>
						</div>
					</div>
					<LabeledCheckbox
						label={localizationConstants.manageCartTermsText}
						checked={acceptedTerms}
						onChange={setAcceptedTerms}
					/>
					<div className="flex justify-end gap-3 pt-2">
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

								if (useHostedCheckoutMvp && standardItem) {
									setIsSubmitting(true);
									try {
										const checkout =
										await createHostedCheckoutAction({
											planCode: standardItem.planKey,
											billingInterval: "monthly",
											quantity: standardItem.quantity,
											email: profile?.email ?? "",
										});
										if (!checkout.success || !checkout.data) {
											showToast(
												"error",
												cartMessages.checkoutPayment
													.checkoutFailed,
											);
											return;
										}
										window.location.assign(checkout.data.url);
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
									localizationConstants.manageCartCheckoutButton
								}
							/>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
