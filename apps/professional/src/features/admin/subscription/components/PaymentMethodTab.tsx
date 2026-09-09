"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { completeBillingSetupIntentAction } from "@/api-actions";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { useAuthStatus } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useRouter, useSearchParams } from "next/navigation";
import { usePaymentCards } from "../hooks/usePaymentCards";
import { PaymentMethodRow } from "./PaymentMethodRow";
import StripePaymentMethodDialog from "./StripePaymentMethodDialog";

const PaymentMethodTab = () => {
	const {
		cards,
		isLoading,
		error,
		refreshCards,
		setDefaultCard,
		deleteCard,
		isUpdating,
	} = usePaymentCards();
	const { user } = useAuthStatus();
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [dialogOpen, setDialogOpen] = useState(false);
	const processedSetupIntent = useRef<string | null>(null);
	const email =
		user && typeof user === "object" && "email" in user && typeof user.email === "string"
			? user.email.trim()
			: "";

	useEffect(() => {
		const setupIntentId = searchParams.get("setup_intent");
		if (!setupIntentId || processedSetupIntent.current === setupIntentId) return;
		processedSetupIntent.current = setupIntentId;
		const redirectStatus = searchParams.get("redirect_status");
		void (async () => {
			if (redirectStatus !== "succeeded") {
				showToast("error", t(localizationConstants.subscriptionPaymentSaveFailed));
			} else {
				const result = await completeBillingSetupIntentAction(setupIntentId);
				if (result.success) {
					await refreshCards();
					showToast("success", t(localizationConstants.subscriptionPaymentSaved));
				} else {
					showToast("error", t(localizationConstants.subscriptionPaymentSaveFailed));
				}
			}
			router.replace("/admin/subscription?tab=payment");
		})();
	}, [refreshCards, router, searchParams, t]);

	const updateDefault = async (paymentMethodId: string) => {
		if (cards.find((card) => card.id === paymentMethodId)?.is_default) return;
		try {
			await setDefaultCard(paymentMethodId);
			showToast("success", t(localizationConstants.subscriptionPaymentDefaultUpdated));
		} catch {
			showToast("error", t(localizationConstants.subscriptionPaymentUpdateFailed));
		}
	};

	const remove = async (paymentMethodId: string) => {
		try {
			await deleteCard(paymentMethodId);
			showToast("success", t(localizationConstants.subscriptionPaymentDeleted));
		} catch (mutationError) {
			const message =
				mutationError instanceof Error && mutationError.message === "LAST_PAYMENT_METHOD"
					? localizationConstants.subscriptionPaymentLastCardRequired
					: localizationConstants.subscriptionPaymentDeleteFailed;
			showToast("error", t(message));
		}
	};

	const defaultCardId = cards.find((card) => card.is_default)?.id ?? "";

	return (
		<div className="flex min-w-0 flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
			<h2 className="text-lg font-semibold text-slate-600">
				<Translate
					text={localizationConstants.subscriptionPaymentHeading}
				/>
			</h2>

			<div className="flex flex-wrap items-end justify-between gap-4">
				<p className="max-w-xl text-sm text-slate-500">
					<Translate text={localizationConstants.subscriptionPaymentSecureHint} />
				</p>
				<Button
					type="button"
					onClick={() => setDialogOpen(true)}
					disabled={!email || isUpdating}
					variant="primary"
					className="h-11 gap-2 rounded-lg px-5 text-sm font-medium"
				>
					<Plus className="h-4 w-4" />
					<Translate
						text={localizationConstants.subscriptionPaymentAddCard}
					/>
				</Button>
			</div>

			<div className="space-y-2">
				<p className="text-sm font-medium text-slate-900">
					<Translate
						text={
							localizationConstants.subscriptionPaymentChooseCard
						}
					/>
				</p>
				{isLoading ? (
					<div className="flex min-h-28 items-center justify-center">
						<Loader2 className="h-5 w-5 animate-spin text-slate-500" />
					</div>
				) : error ? (
					<div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
						<Translate text={localizationConstants.subscriptionPaymentLoadFailed} />
						<Button type="button" variant="outline" className="ml-3" onClick={() => void refreshCards()}>
							<Translate text={localizationConstants.retry} />
						</Button>
					</div>
				) : cards.length === 0 ? (
					<p className="text-sm text-slate-500">
						<Translate
							text={
								localizationConstants.subscriptionPaymentNoCards
							}
						/>
					</p>
				) : (
					<RadioGroup
						value={defaultCardId}
						onValueChange={(id) => void updateDefault(id)}
						className="gap-4"
					>
						{cards.map((card) => (
							<PaymentMethodRow
								key={card.id}
								card={card}
								canDelete={cards.length > 1}
								disabled={isUpdating}
								onDelete={() => void remove(card.id)}
							/>
						))}
					</RadioGroup>
				)}
			</div>

			<StripePaymentMethodDialog
				open={dialogOpen}
				email={email}
				onClose={() => setDialogOpen(false)}
				onSaved={async () => {
					await refreshCards();
				}}
			/>
		</div>
	);
};

export default PaymentMethodTab;
