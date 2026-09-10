"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
	addSubscriptionToCartAction,
	clearCartAction,
	getCartAction,
	getSubscriptionPlansAction,
} from "@/api-actions";
import { Button } from "@/components/ui/button";
import {
	MANAGE_PLANS_PLAN_IDS,
	MANAGE_PLANS_STEPS,
	PaymentOptionSelector,
	PlanCard,
	type PaymentOption,
	type SubscriptionInterval,
	type SubscriptionPlan,
} from "@/features/manage-plans";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SUBSCRIPTION_EDITOR_PATHS } from "@/features/admin/subscription/services/subscriptionSelection";

const STEP_PLAN_KEYS = {
	[MANAGE_PLANS_STEPS.BASE]: [
		MANAGE_PLANS_PLAN_IDS.FREE,
		MANAGE_PLANS_PLAN_IDS.START,
	],
	[MANAGE_PLANS_STEPS.LICENSES]: [
		MANAGE_PLANS_PLAN_IDS.STANDARD,
		MANAGE_PLANS_PLAN_IDS.PRO,
		MANAGE_PLANS_PLAN_IDS.APP_WORK,
	],
	[MANAGE_PLANS_STEPS.ADDONS]: [],
} as const;

function getIntervalFromPaymentOption(
	paymentOption: PaymentOption,
): SubscriptionInterval {
	switch (paymentOption) {
		case "quarter":
			return "quarterly";
		case "year":
			return "yearly";
		case "month":
		default:
			return "monthly";
	}
}

function getPriceForPaymentOption(
	plan: SubscriptionPlan,
	paymentOption: PaymentOption,
) {
	const selectedInterval = getIntervalFromPaymentOption(paymentOption);
	return plan.prices.find(
		(price) => price.interval === selectedInterval && price.is_active,
	);
}

export default function ManagePlansPage() {
	const router = useRouter();
	const mainRef = useRef<HTMLElement>(null);
	const [isPlanChange, setIsPlanChange] = useState(false);
	const cartHref = isPlanChange ? "/manage-cart?mode=change" : "/manage-cart";
	const [paymentOption, setPaymentOption] = useState<PaymentOption>("month");
	const [currentStep, setCurrentStep] = useState<
		(typeof MANAGE_PLANS_STEPS)[keyof typeof MANAGE_PLANS_STEPS]
	>(MANAGE_PLANS_STEPS.BASE);
	const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [quantities, setQuantities] = useState<Record<string, number>>({});

	const handleQuantityChange = useCallback(
		(planId: string, delta: number) => {
			setQuantities((prev) => {
				const current = prev[planId] ?? 1;
				const next = Math.max(1, current + delta);
				return { ...prev, [planId]: next };
			});
		},
		[],
	);

	const fetchPlans = async () => {
		const result = await getSubscriptionPlansAction();

		if (result.success && result.data) {
			const sortedPlans = [...result.data].sort(
				(left, right) => left.order_key - right.order_key,
			);
			setPlans(sortedPlans);
		}
	};

	const syncStepFromCart = useCallback(async () => {
		const result = await getCartAction();
		if (!result.success || !result.data) return;

		const planKeys = result.data.items.map(
			(item) => item.subscription_plan.plan_key,
		);

		if (planKeys.includes(MANAGE_PLANS_PLAN_IDS.START)) {
			setCurrentStep(MANAGE_PLANS_STEPS.LICENSES);
		}
	}, []);

	useEffect(() => {
		if (new URLSearchParams(window.location.search).get("change") === "1") {
			router.replace(SUBSCRIPTION_EDITOR_PATHS.subscription);
			return;
		}
		setIsPlanChange(
			new URLSearchParams(window.location.search).get("change") === "1",
		);
		fetchPlans();
		syncStepFromCart();
	}, [router, syncStepFromCart]);

	useEffect(() => {
		mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentStep]);

	const stepPlans = useMemo(() => {
		const planKeys = STEP_PLAN_KEYS[currentStep] as readonly string[];
		return plans.filter(
			(plan) =>
				planKeys.includes(plan.plan_key) &&
				(!isPlanChange || plan.plan_key !== MANAGE_PLANS_PLAN_IDS.FREE),
		);
	}, [currentStep, isPlanChange, plans]);

	const handleChoosePlan = useCallback(
		async (plan: SubscriptionPlan) => {
			const selectedPrice = getPriceForPaymentOption(plan, paymentOption);
			if (!selectedPrice) return;

			const quantity =
				currentStep === MANAGE_PLANS_STEPS.BASE
					? 1
					: (quantities[plan.id] ?? 1);

			const shouldClearCartFirst =
				currentStep === MANAGE_PLANS_STEPS.BASE &&
				(plan.plan_key === MANAGE_PLANS_PLAN_IDS.FREE ||
					plan.plan_key === MANAGE_PLANS_PLAN_IDS.START);

			setIsAddingToCart(true);
			if (shouldClearCartFirst) {
				const clearResult = await clearCartAction();
				if (!clearResult.success) {
					setIsAddingToCart(false);
					return;
				}
			}

			const result = await addSubscriptionToCartAction({
				subscription_plan_id: plan.id,
				subscription_plan_price_id: selectedPrice.id,
				quantity,
			});
			setIsAddingToCart(false);

			if (!result.success) return;

			if (
				currentStep === MANAGE_PLANS_STEPS.BASE &&
				plan.plan_key === MANAGE_PLANS_PLAN_IDS.FREE
			) {
				router.push(cartHref);
				return;
			}

			if (
				currentStep === MANAGE_PLANS_STEPS.BASE &&
				plan.plan_key === MANAGE_PLANS_PLAN_IDS.START
			) {
				setCurrentStep(MANAGE_PLANS_STEPS.LICENSES);
				return;
			}
		},
		[cartHref, currentStep, paymentOption, quantities, router],
	);

	return (
		<>
			<main
				ref={mainRef}
				className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:py-8 lg:px-10"
			>
				<div className="mx-auto w-full max-w-6xl">
					<header className="grid items-start justify-items-center gap-5 text-center lg:grid-cols-[1fr_minmax(0,40rem)_1fr]">
						<div className="min-w-0 lg:col-start-2">
							{currentStep === MANAGE_PLANS_STEPS.BASE ? (
								<PaymentOptionSelector
									value={paymentOption}
									onValueChange={setPaymentOption}
								/>
							) : (
								<div className="mx-auto max-w-2xl text-center">
									<h1 className="text-2xl font-bold text-slate-800">
										<Translate
											text={
												localizationConstants.managePlansLicensesTitle
											}
										/>
									</h1>
									<p className="mt-2 text-sm leading-6 text-slate-500">
										<Translate
											text={
												localizationConstants.managePlansLicensesSubtitle
											}
										/>
									</p>
								</div>
							)}
						</div>

						<div className="flex items-center lg:justify-self-end">
							<Button
								variant="primary"
								size="default"
								asChild
								className="h-11 w-fit rounded-lg"
							>
								<Link
									href={cartHref}
									className="inline-flex items-center gap-2"
								>
									<ShoppingCart
										className="h-4 w-4"
										aria-hidden
									/>
									<Translate
										text={
											localizationConstants.managePlansViewCartButton
										}
									/>
								</Link>
							</Button>
						</div>
					</header>

					<div className="mx-auto mt-8 flex w-full flex-wrap items-stretch justify-center gap-5 lg:gap-6">
						{stepPlans.map((plan) => {
							const selectedPrice = getPriceForPaymentOption(
								plan,
								paymentOption,
							);
							if (!selectedPrice) return null;

							return (
								<div
									key={plan.id}
									className="flex w-full min-w-0 max-w-[22rem] sm:w-[20rem]"
								>
									<PlanCard
										plan={plan}
										currentPrice={selectedPrice.price / 100}
										quantity={quantities[plan.id] ?? 1}
										onQuantityChange={(delta) =>
											handleQuantityChange(plan.id, delta)
										}
										showQuantitySelector={
											currentStep !== MANAGE_PLANS_STEPS.BASE
										}
										onChoosePlan={() => handleChoosePlan(plan)}
										isLoading={isAddingToCart}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</main>
		</>
	);
}
