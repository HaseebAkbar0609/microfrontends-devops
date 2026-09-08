"use client";

import {
	attachPaymentMethodAction,
	checkoutSubscriptionAction,
	completeSubscriptionAction,
	createSetupIntentAction,

	getCountriesAction,
	getUserCardsListAction,
	type Country,
	type UserCard,
} from "@/api-actions";
import { Form } from "@/components/form";
import { CheckoutPaymentSectionSkeleton } from "@/components/skeleton/cart/CheckoutPaymentSectionSkeleton";
import { Button } from "@/components/ui/button";
import { cartMessages } from "@/constants/messages";
import { useAuthStatus } from "@/context/AuthContext";
import { checkoutSchema } from "@/features/manage-cart/schemas/checkout";
import { authStorage } from "@/lib/authStorage";
import { showToast } from "@/lib/toast";
import { formatOptions } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Elements } from "@stripe/react-stripe-js";
import {
	loadStripe,
	type Stripe,
	type StripeElements,
} from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	DEFAULT_PAYMENT_DETAILS_FORM_VALUES,
	PAYMENT_MODES,
} from "../constants";
import {
	CheckoutPaymentDetailsProps,
	PaymentDetailsFormValues,
	PaymentMode,
} from "../types";
import { CheckoutBillingSection } from "./CheckoutBillingSection";
import { CheckoutContactSection } from "./CheckoutContactSection";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { CheckoutPaymentSavedSection } from "./CheckoutPaymentSavedSection";
import { CheckoutPaymentStripeSection } from "./CheckoutPaymentStripeSection";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
	? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
	: null;

export function CheckoutPaymentDetails({
	items,
	subtotal,
	total,
	onBack,
	onCancelToCart,
}: CheckoutPaymentDetailsProps) {
	const router = useRouter();
	const { hydrateFromStorage } = useAuthStatus();

	const form = useForm<PaymentDetailsFormValues>({
		defaultValues: DEFAULT_PAYMENT_DETAILS_FORM_VALUES,
		mode: "onBlur",
		resolver: zodResolver(checkoutSchema as never),
	});

	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [isSetupIntentLoading, setIsSetupIntentLoading] = useState(false);
	const [setupIntentError, setSetupIntentError] = useState<string | null>(null);
	const [isStripeReady, setIsStripeReady] = useState(false);
	const [cards, setCards] = useState<UserCard[]>([]);
	const [isCardsLoading, setIsCardsLoading] = useState(false);
	const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
	const [paymentMode, setPaymentMode] = useState<PaymentMode>(
		PAYMENT_MODES.SAVED as PaymentMode,
	);
	const [isPaying, setIsPaying] = useState(false);
	const [isSavingCard, setIsSavingCard] = useState(false);

	const stripeRef = useRef<Stripe | null>(null);
	const elementsRef = useRef<StripeElements | null>(null);
	const setupIntentRequestRef = useRef<Promise<string | null> | null>(null);

	const [countries, setCountries] = useState<Country[]>([]);


	const countryOptions = useMemo(() => formatOptions(countries), [countries]);

	const mainItem = items;

	const refreshCards = useCallback(async (preferSelectCardId?: string) => {
		setIsCardsLoading(true);
		try {
			const result = await getUserCardsListAction();
			if (!result.success || !result.data) {
				setCards([]);
				setSelectedCardId(null);
				setPaymentMode(PAYMENT_MODES.NEW);
				return;
			}

			setCards(result.data);
			const preferred = preferSelectCardId
				? result.data.find((c) => c.id === preferSelectCardId)?.id
				: undefined;
			const defaultCard = result.data.find((c) => c.is_default);
			const firstCard = result.data[0];
			const initialId =
				preferred ?? defaultCard?.id ?? firstCard?.id ?? null;
			setSelectedCardId(initialId);
			setPaymentMode(initialId ? PAYMENT_MODES.SAVED : PAYMENT_MODES.NEW);
		} finally {
			setIsCardsLoading(false);
		}
	}, []);

	useEffect(() => {
		const load = async () => {
			setIsCardsLoading(true);
			try {
				const result = await getUserCardsListAction();
				if (!result.success || !result.data) {
					setCards([]);
					setSelectedCardId(null);
					setPaymentMode(PAYMENT_MODES.NEW);
					return;
				}

				setCards(result.data);
				const defaultCard = result.data.find((c) => c.is_default);
				const firstCard = result.data[0];
				const initialId = defaultCard?.id ?? firstCard?.id ?? null;
				setSelectedCardId(initialId);
				setPaymentMode(
					initialId ? PAYMENT_MODES.SAVED : PAYMENT_MODES.NEW,
				);
			} finally {
				setIsCardsLoading(false);
			}
		};

		load();
	}, []);

	useEffect(() => {
		const loadCountries = async () => {
			const result = await getCountriesAction();
			if (!result.success || !result.data) return;
			setCountries(result.data);
		};

		loadCountries();
	}, [form]);


	const ensureSetupIntent = useCallback(async () => {
		if (clientSecret) return clientSecret;
		if (setupIntentRequestRef.current) return setupIntentRequestRef.current;

		setIsSetupIntentLoading(true);
		setSetupIntentError(null);
		const request = (async () => {
			const result = await createSetupIntentAction();
			if (!result.success || !result.data?.client_secret) {
				setSetupIntentError(
					result.error ?? cartMessages.checkoutPayment.paymentFormLoadFailed,
				);
				return null;
			}

			setClientSecret(result.data.client_secret);
			return result.data.client_secret;
		})();
		setupIntentRequestRef.current = request;

		try {
			return await request;
		} finally {
			setupIntentRequestRef.current = null;
			setIsSetupIntentLoading(false);
		}
	}, [clientSecret]);

	const handleStripeReady = useCallback(
		(stripe: Stripe | null, elements: StripeElements | null) => {
			stripeRef.current = stripe;
			elementsRef.current = elements;
			setIsStripeReady(Boolean(stripe && elements));
		},
		[],
	);

	useEffect(() => {
		if (paymentMode === PAYMENT_MODES.NEW && !clientSecret) {
			void ensureSetupIntent();
		}
	}, [paymentMode, clientSecret, ensureSetupIntent]);

	useEffect(() => {
		if (paymentMode !== PAYMENT_MODES.NEW) {
			stripeRef.current = null;
			elementsRef.current = null;
			setIsStripeReady(false);
		}
	}, [paymentMode]);

	const buildCheckoutPayload = useCallback(
		(data: PaymentDetailsFormValues, userCardId: string) => ({
			// country and city are stored as ids (from dropdowns)
			user_card_id: userCardId,
			email: data.email,
			first_name: data.firstName,
			last_name: data.lastName,
			phone: data.phone,
			address: {
				line1: data.address,
				...(data.address2 ? { line2: data.address2 } : {}),
				city: data.city,
				postal_code: data.postalCode,
				country: data.country,
			},
		}),
		[],
	);

	const saveCardOnly = useCallback(async () => {
		const stripe = stripeRef.current;
		const elements = elementsRef.current;
		if (!stripe || !elements || isSavingCard || isPaying) return;

		setIsSavingCard(true);
		try {
			const confirm = await stripe.confirmSetup({
				elements,
				redirect: "if_required",
			});
			if (confirm.error) {
				showToast(
					"error",
					confirm.error.message ??
					cartMessages.checkoutPayment.cardSetupFailed,
				);
				return;
			}

			const setupIntent = confirm.setupIntent;
			const paymentMethodId =
				typeof setupIntent.payment_method === "string"
					? setupIntent.payment_method
					: setupIntent.payment_method?.id;

			if (!paymentMethodId) {
				showToast(
					"error",
					cartMessages.checkoutPayment.missingPaymentMethodId,
				);
				return;
			}

			const attach = await attachPaymentMethodAction({
				payment_method_id: paymentMethodId,
				is_default: true,
			});
			if (!attach.success || !attach.data?.id) return;
			await refreshCards(attach.data.id);
			setClientSecret(null);
		} finally {
			setIsSavingCard(false);
		}
	}, [isPaying, isSavingCard, refreshCards]);

	const finalizeSubscriptionAfterCheckout = useCallback(async () => {
		// API expects body key `payment_token`; value is the access JWT from verify-email.
		const accessToken = authStorage.getAccessToken()?.trim() ?? "";
		if (!accessToken) {
			showToast(
				"error",
				cartMessages.checkoutPayment.missingPaymentToken,
			);
			return;
		}

		const complete = await completeSubscriptionAction({
			payment_token: accessToken,
		});
		if (!complete.success) return;

		hydrateFromStorage();

		showToast(
			"success",
			cartMessages.checkoutPayment.licensePurchasedSuccess,
		);
		router.replace("/home");
		router.refresh();
	}, [router, hydrateFromStorage]);

	const onSubmit = useCallback(
		async (data: PaymentDetailsFormValues) => {
			if (isPaying) return;

			if (paymentMode === PAYMENT_MODES.SAVED) {
				if (!selectedCardId) return;
				setIsPaying(true);
				try {
					const checkout = await checkoutSubscriptionAction(
						buildCheckoutPayload(data, selectedCardId),
						{ suppressSuccessToast: true },
					);

					if (!checkout.success || !checkout.data) return;

					const returnUrl = `${window.location.origin}/manage-cart`;
					const needsStripeConfirm =
						checkout.data.status === "incomplete" &&
						Boolean(checkout.data.client_secret);

					if (needsStripeConfirm) {
						const stripe = await stripePromise;
						if (!stripe) return;

						const payload = await stripe.confirmPayment({
							clientSecret: checkout.data.client_secret!,
							redirect: "if_required",
							confirmParams: {
								return_url: returnUrl,
							},
						});

						if (payload.error) {
							showToast(
								"error",
								payload.error.message ??
								cartMessages.checkoutPayment.checkoutFailed,
							);
							return;
						}
					}

					await finalizeSubscriptionAfterCheckout();
				} finally {
					setIsPaying(false);
				}
				return;
			}

			const stripe = stripeRef.current;
			const elements = elementsRef.current;
			if (!stripe || !elements) return;

			setIsPaying(true);
			try {
				const confirm = await stripe.confirmSetup({
					elements,
					redirect: "if_required",
				});
				if (confirm.error) {
					showToast(
						"error",
						confirm.error.message ??
						cartMessages.checkoutPayment.cardSetupFailed,
					);

					return;
				}

				const setupIntent = confirm.setupIntent;
				const paymentMethodId =
					typeof setupIntent.payment_method === "string"
						? setupIntent.payment_method
						: setupIntent.payment_method?.id;

				if (!paymentMethodId) {
					showToast(
						"error",
						cartMessages.checkoutPayment.missingPaymentMethodId,
					);
					return;
				}

				const attach = await attachPaymentMethodAction({
					payment_method_id: paymentMethodId,
					is_default: true,
				});
				if (!attach.success || !attach.data?.id) return;

				const checkout = await checkoutSubscriptionAction(
					buildCheckoutPayload(data, attach.data.id),
					{ suppressSuccessToast: true },
				);
				if (!checkout.success || !checkout.data) return;

				const returnUrl = `${window.location.origin}/manage-cart`;
				const needsStripeConfirm =
					checkout.data.status === "incomplete" &&
					Boolean(checkout.data.client_secret);

				if (needsStripeConfirm) {
					const stripeForPayment = await stripePromise;
					if (!stripeForPayment) return;

					const paymentResult = await stripeForPayment.confirmPayment({
						clientSecret: checkout.data.client_secret!,
						redirect: "if_required",
						confirmParams: {
							return_url: returnUrl,
						},
					});

					if (paymentResult.error) {
						showToast(
							"error",
							paymentResult.error.message ??
							cartMessages.checkoutPayment.checkoutFailed,
						);
						return;
					}
				}

				await finalizeSubscriptionAfterCheckout();
			} finally {
				setIsPaying(false);
			}
		},
		[
			buildCheckoutPayload,
			finalizeSubscriptionAfterCheckout,
			isPaying,
			paymentMode,
			selectedCardId,
		],
	);

	const payDisabled =
		isPaying ||
		(paymentMode === PAYMENT_MODES.SAVED
			? !selectedCardId
			: !isStripeReady);

	if (!stripePromise) {
		return (
			<div className="space-y-4 rounded-xl bg-white p-6">
				<p className="text-sm text-gray-700">Stripe key missing.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold text-secondary">
				<Translate
					text={
						localizationConstants.manageCartCheckoutPaymentDetailsTitle
					}
				/>
			</h1>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
				>
					<div className="space-y-4">
						<CheckoutContactSection control={form.control} />
						<CheckoutBillingSection
							control={form.control}
							countryOptions={countryOptions}
						/>

						{paymentMode === PAYMENT_MODES.SAVED ? (
							<CheckoutPaymentSavedSection
								cards={cards}
								isCardsLoading={isCardsLoading}
								selectedCardId={selectedCardId}
								onSelectCard={(id: string) => {
									setSelectedCardId(id);
									setPaymentMode(PAYMENT_MODES.SAVED);
								}}
								onChooseNewCard={async () => {
									setPaymentMode(PAYMENT_MODES.NEW);
									await ensureSetupIntent();
								}}
								control={form.control}
							/>
						) : clientSecret ? (
							<Elements
								stripe={stripePromise}
								options={{ clientSecret }}
							>
								<CheckoutPaymentStripeSection
									control={form.control}
									cards={cards}
									isCardsLoading={isCardsLoading}
									selectedCardId={selectedCardId}
									onSelectCard={(id: string) => {
										setSelectedCardId(id);
										setPaymentMode(PAYMENT_MODES.SAVED);
									}}
									onChooseNewCard={() => {
										if (cards.length > 0) {
											const preferred =
												cards.find((c) => c.is_default)?.id ??
												cards[0].id;
											setSelectedCardId(preferred);
											setPaymentMode(PAYMENT_MODES.SAVED);
										}
									}}
									onSaveCardOnly={saveCardOnly}
									isSavingCard={isSavingCard}
									isPaying={isPaying}
									onStripeReady={handleStripeReady}
								/>
							</Elements>
						) : setupIntentError ? (
							<div
								className="space-y-4 rounded-xl bg-white p-6"
								role="alert"
							>
								<p className="text-sm text-red-700">
									{setupIntentError}
								</p>
								<Button
									type="button"
									variant="outline"
									onClick={() => void ensureSetupIntent()}
									disabled={isSetupIntentLoading}
								>
									<Translate text={localizationConstants.retry} />
								</Button>
							</div>
						) : (
							<CheckoutPaymentSectionSkeleton />
						)}

						<div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
							<Button
								variant="outline"
								type="button"
								onClick={onBack}
							>
								<Translate
									text={
										localizationConstants.manageCartBackToCart
									}
								/>
							</Button>
							<div className="flex items-center gap-3">
								<Button
									variant="outline"
									type="button"
									onClick={onCancelToCart}
									className="hidden sm:inline-flex"
								>
									<Translate
										text={
											localizationConstants.manageCartCheckoutAddOrderButton
										}
									/>
								</Button>
								<Button
									variant="primary"
									type="submit"
									className="min-w-[160px]"
									disabled={payDisabled}
								>
									<Translate
										text={
											localizationConstants.manageCartCheckoutPayButton
										}
									/>
								</Button>
							</div>
						</div>
					</div>

					<CheckoutOrderSummary
						mainItem={mainItem}
						subtotal={subtotal}
						total={total}
						showDiscountCode
						control={form.control}
					/>
				</form>
			</Form>
		</div>
	);
}
