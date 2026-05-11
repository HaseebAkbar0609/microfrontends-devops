"use client";

import { Minus, Plus } from "lucide-react";

import type { SubscriptionPlan } from "../types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
		<Card className="min-h-[600px] flex flex-col bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
			<CardHeader className="pb-2">
				<CardTitle className="text-xl text-gray-500 text-center font-bold">
					{planName}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 space-y-4">
				<ul className="space-y-2 list-disc list-outside pl-5">
					{PLAN_FEATURES[
						plan.plan_key as keyof typeof PLAN_FEATURES
					].map((feature, i) => (
						<li key={i} className="text-sm text-gray-700">
							{feature}
						</li>
					))}
				</ul>
				{showQuantitySelector && (
					<div className="flex items-center gap-2 pt-2 justify-center">
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="h-10 w-10 shrink-0"
							onClick={() => onQuantityChange?.(-1)}
							disabled={quantity <= 1}
							aria-label="Decrease quantity"
						>
							<Minus className="h-4 w-4" />
						</Button>
						<Input
							type="number"
							min={1}
							value={quantity}
							readOnly
							className="w-14 h-10 !text-center !justify-center"
						/>
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="h-10 w-10 shrink-0"
							onClick={() => onQuantityChange?.(1)}
							aria-label="Increase quantity"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				)}
			</CardContent>
			<CardFooter className="pt-4 flex-col items-start gap-6">
				<div className="pt-2 space-y-1 text-sm">
					<p>
						<Translate
							text={localizationConstants.managePlansPrice}
						/>
						: {formatPrice(currentPrice)}
					</p>
					{showQuantitySelector && (
						<p className="font-medium text-foreground">
							<Translate
								text={localizationConstants.managePlansTotal}
							/>
							: {formatPrice(displayTotal)}
						</p>
					)}
				</div>
				<Button
					variant="primary"
					className="w-full"
					onClick={onChoosePlan}
					disabled={isLoading}
				>
					<Translate
						text={localizationConstants.managePlansChoosePlanButton}
					/>
				</Button>
			</CardFooter>
		</Card>
	);
}
