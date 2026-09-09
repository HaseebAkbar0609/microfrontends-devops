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
import { cn } from "@/lib/utils";
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
		<Card
			className={cn(
				"group h-full w-full gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white pb-0 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg",
				showQuantitySelector ? "min-h-[430px]" : "min-h-[330px]",
			)}
		>
			<CardHeader className="border-b border-slate-100 bg-slate-50/70 px-6 py-6 text-center">
				<CardTitle className="text-xl font-bold tracking-tight text-slate-800">
					{planName}
				</CardTitle>
				{showQuantitySelector && (
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
						<Translate text={localizationConstants.managePlansLicense} />
					</p>
				)}
			</CardHeader>
			<CardContent className="flex flex-1 flex-col px-6 py-6">
				<ul className="space-y-3">
					{PLAN_FEATURES[
						plan.plan_key as keyof typeof PLAN_FEATURES
					].map((feature, i) => (
						<li
							key={i}
							className="flex items-start gap-3 text-sm leading-5 text-slate-600"
						>
							<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
								<Check className="h-3.5 w-3.5" aria-hidden />
							</span>
							<span>{feature}</span>
						</li>
					))}
				</ul>
				{showQuantitySelector && (
					<div className="mt-6 flex justify-center">
						<div className="grid grid-cols-[2.5rem_4rem_2.5rem] items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
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
			</CardContent>
			<CardFooter className="mt-auto flex-col items-stretch gap-4 border-t border-slate-100 bg-slate-50/40 px-6 py-5">
				<div className="space-y-1.5 text-sm text-slate-600">
					<p>
						<Translate
							text={localizationConstants.managePlansPrice}
						/>
						: {formatPrice(currentPrice)}
					</p>
					{showQuantitySelector && (
						<p className="font-semibold text-slate-900">
							<Translate
								text={localizationConstants.managePlansTotal}
							/>
							: {formatPrice(displayTotal)}
						</p>
					)}
				</div>
				<Button
					variant="primary"
					className="h-11 w-full rounded-lg font-semibold shadow-sm"
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
