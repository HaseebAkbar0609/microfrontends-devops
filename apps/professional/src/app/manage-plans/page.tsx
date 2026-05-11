"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

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
		fetchPlans();
		syncStepFromCart();
	}, [syncStepFromCart]);

	const stepPlans = useMemo(() => {
		const planKeys = STEP_PLAN_KEYS[currentStep] as readonly string[];
		return plans.filter((plan) => planKeys.includes(plan.plan_key));
	}, [currentStep, plans]);

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
				router.push("/manage-cart");
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
		[currentStep, paymentOption, quantities, router],
	);

	return (
		<>
			<main className="p-6 md:p-8 md:px-12 h-[calc(100vh-72px)]  overflow-y-auto">
				<div className="mx-auto space-y-8">
					<div className="flex flex-col md:flex-row gap-8">
						<div className="relative w-full md:w-1/3 max-w-md mx-auto md:mx-0">
							<h2 className="text-2xl font-bold text-gray-700 mb-8">
								Welcome to TimeFlow
							</h2>
							<Image
								src="/manage-plans.png"
								alt="TimeFlow plans overview"
								width={600}
								height={400}
								className="w-full h-auto rounded-lg object-cover"
								priority
								sizes="(max-width: 768px) 100vw, 28rem"
							/>
						</div>

						<div className="flex-1">
							<div className="flex justify-between gap-4 items-center justify-between">
								{currentStep === MANAGE_PLANS_STEPS.BASE && (
									<PaymentOptionSelector
										value={paymentOption}
										onValueChange={setPaymentOption}
									/>
								)}

								<div className="flex items-center justify-end flex-1">
									<Button
										variant="primary"
										size="default"
										asChild
										className="w-fit"
									>
										<Link
											href="/manage-cart"
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
							</div>
							<div className="flex flex-wrap justify-start gap-6 mt-4">
								{stepPlans.map((plan) => {
									const selectedPrice =
										getPriceForPaymentOption(
											plan,
											paymentOption,
										);
									if (!selectedPrice) return null;

									return (
										<div
											key={plan.id}
											className="w-full max-w-sm"
										>
											<PlanCard
												plan={plan}
												currentPrice={
													selectedPrice.price / 100
												}
												quantity={
													quantities[plan.id] ?? 1
												}
												onQuantityChange={(delta) =>
													handleQuantityChange(
														plan.id,
														delta,
													)
												}
												showQuantitySelector={
													currentStep !==
													MANAGE_PLANS_STEPS.BASE
												}
												onChoosePlan={() =>
													handleChoosePlan(plan)
												}
												isLoading={isAddingToCart}
											/>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
