"use client";

import {
	completeBillingSetupIntentAction,
	createBillingSetupIntentAction,
} from "@/api-actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
	? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
	: null;

type SetupFormProps = {
	onClose: () => void;
	onSaved: () => Promise<void>;
};

function SetupForm({ onClose, onSaved }: SetupFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const t = useTranslate();
	const [isReady, setIsReady] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const save = async () => {
		if (!stripe || !elements || !isReady || isSaving) return;
		setIsSaving(true);
		try {
			const confirmation = await stripe.confirmSetup({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/admin/subscription?tab=payment`,
				},
				redirect: "if_required",
			});
			if (confirmation.error) {
				showToast(
					"error",
					confirmation.error.message ??
						t(localizationConstants.subscriptionPaymentSaveFailed),
				);
				return;
			}

			const setupIntentId = confirmation.setupIntent?.id;
			if (!setupIntentId) {
				showToast(
					"error",
					t(localizationConstants.subscriptionPaymentSaveFailed),
				);
				return;
			}
			const result = await completeBillingSetupIntentAction(setupIntentId);
			if (!result.success) {
				showToast(
					"error",
					t(localizationConstants.subscriptionPaymentSaveFailed),
				);
				return;
			}
			await onSaved();
			showToast(
				"success",
				t(localizationConstants.subscriptionPaymentSaved),
			);
			onClose();
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<PaymentElement onReady={() => setIsReady(true)} />
			<DialogFooter className="[&_button]:h-11">
				<Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button type="button" onClick={save} disabled={!isReady || isSaving}>
					{isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
					<Translate text={localizationConstants.subscriptionConfirmAction} />
				</Button>
			</DialogFooter>
		</>
	);
}

type StripePaymentMethodDialogProps = {
	open: boolean;
	email: string;
	onClose: () => void;
	onSaved: () => Promise<void>;
};

export default function StripePaymentMethodDialog({
	open,
	email,
	onClose,
	onSaved,
}: StripePaymentMethodDialogProps) {
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [loadFailed, setLoadFailed] = useState(false);

	useEffect(() => {
		if (!open) {
			setClientSecret(null);
			setLoadFailed(false);
			return;
		}
		let active = true;
		void createBillingSetupIntentAction(email).then((result) => {
			if (!active) return;
			if (result.success && result.data?.client_secret) {
				setClientSecret(result.data.client_secret);
			} else {
				setLoadFailed(true);
			}
		});
		return () => {
			active = false;
		};
	}, [email, open]);

	return (
		<Dialog open={open} onOpenChange={(value) => !value && onClose()}>
			<DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto bg-white sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>
						<Translate text={localizationConstants.subscriptionNewCardTitle} />
					</DialogTitle>
					<DialogDescription>
						<Translate text={localizationConstants.subscriptionPaymentSecureHint} />
					</DialogDescription>
				</DialogHeader>
				{clientSecret && stripePromise ? (
					<Elements stripe={stripePromise} options={{ clientSecret }}>
						<SetupForm onClose={onClose} onSaved={onSaved} />
					</Elements>
				) : (
					<div className="flex min-h-32 items-center justify-center text-sm text-slate-500">
						{loadFailed || !stripePromise ? (
							<Translate text={localizationConstants.subscriptionPaymentLoadFailed} />
						) : (
							<Loader2 className="h-5 w-5 animate-spin" />
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
