"use client";

import { Check, Minus, Plus } from "lucide-react";

import type { SubscriptionPlan } from "../types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatPrice } from "../utils";
import { PLAN_FEATURES } from "../constants/plans";

interface PlanCardProps {
	plan: SubscriptionPlan;
	currentPrice: number;
	isLoading?: boolean;
	quantity?: number;
	onQuantityChange?: (delta: number) => void;
	onChoosePlan: () => void;
	showQuantitySelector?: boolean;
}

export function PlanCard({
	plan,
	currentPrice,
	isLoading = false,
	quantity = 1,
	onQuantityChange,
	onChoosePlan,
	showQuantitySelector = false,
}: PlanCardProps) {
	const userCount = showQuantitySelector ? Math.max(1, quantity) : 1;
	const displayTotal = currentPrice * userCount;
	const planName = plan.plan_key.replace(/-/g, " ").toUpperCase();

	return (
		<Card className="flex h-full w-full flex-col gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white pb-0 shadow-sm transition-colors hover:border-slate-300">
			<CardHeader className="flex flex-col gap-2 px-6 pb-5 pt-6">
				<CardTitle className="text-base font-semibold tracking-wide text-slate-900">
					{planName}
				</CardTitle>
				{showQuantitySelector && (
					<p className="text-xs font-medium uppercase tracking-wider text-slate-500">
						<Translate text={localizationConstants.managePlansLicense} />
					</p>
				)}
				<p className="mt-2 text-3xl font-semibold leading-tight tracking-tight tabular-nums text-slate-900">
					{formatPrice(currentPrice)}
				</p>
			</CardHeader>
			<CardContent className="flex-1 px-6 pb-6">
				<ul className="space-y-3 border-t border-slate-100 pt-5">
					{PLAN_FEATURES[
						plan.plan_key as keyof typeof PLAN_FEATURES
					].map((feature, i) => (
						<li
							key={i}
							className="flex items-start gap-2.5 text-sm leading-5 text-slate-600"
						>
							<span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-primary">
								<Check className="h-4 w-4" aria-hidden />
							</span>
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-4 px-6 pb-6 pt-0">
				{showQuantitySelector && (
					<div className="flex justify-center border-t border-slate-100 pt-5">
						<div className="grid grid-cols-[2.5rem_3.5rem_2.5rem] items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-10 w-10 rounded-none border-r border-slate-200"
							onClick={() => onQuantityChange?.(-1)}
							disabled={quantity <= 1}
							aria-label="Decrease quantity"
						>
							<Minus className="h-4 w-4" />
						</Button>
						<output
							className="flex h-10 min-w-0 items-center justify-center px-2 text-center text-sm font-semibold tabular-nums text-slate-800"
							aria-live="polite"
						>
							{quantity}
						</output>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-10 w-10 rounded-none border-l border-slate-200"
							onClick={() => onQuantityChange?.(1)}
							aria-label="Increase quantity"
						>
							<Plus className="h-4 w-4" />
						</Button>
						</div>
					</div>
				)}
					{showQuantitySelector && (
						<p className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-medium text-slate-600">
							<Translate
								text={localizationConstants.managePlansTotal}
							/>
							<span className="font-semibold tabular-nums text-slate-900">{formatPrice(displayTotal)}</span>
						</p>
					)}
				<Button
					variant={currentPrice === 0 ? "outline" : "primary"}
					className="h-11 w-full rounded-lg font-semibold"
					onClick={onChoosePlan}
					disabled={isLoading}
				>
					<Translate
						text={
							showQuantitySelector
								? localizationConstants.managePlansAddLicensesButton
								: localizationConstants.managePlansChoosePlanButton
						}
					/>
				</Button>
			</CardFooter>
		</Card>
	);
}
