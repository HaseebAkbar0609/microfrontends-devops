"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PurchaseStatus } from "../types/purchase.types";
import { cn } from "@/lib/utils";

interface PurchaseStatusBadgeProps {
	status: PurchaseStatus;
	className?: string;
}

export function PurchaseStatusBadge({ status, className }: PurchaseStatusBadgeProps) {
	if (status === "ready") {
		return (
			<span
				className={cn(
					"inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20",
					className
				)}
			>
				<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
				<Translate text={localizationConstants.machinePurchaseStatusReady} />
			</span>
		);
	}

	if (status === "in_progress") {
		return (
			<span
				className={cn(
					"inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/20",
					className
				)}
			>
				<span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
				<Translate text={localizationConstants.machinePurchaseStatusInProgress} />
			</span>
		);
	}

	// not_ready
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20",
				className
			)}
		>
			<span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
			<Translate text={localizationConstants.machinePurchaseStatusNotReady} />
		</span>
	);
}
