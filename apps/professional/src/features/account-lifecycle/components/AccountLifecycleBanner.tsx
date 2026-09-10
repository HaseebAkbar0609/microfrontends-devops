"use client";

import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useAccountLifecycle } from "../hooks/useAccountLifecycle";
import { LIFECYCLE_UPGRADE_PATH, LIFECYCLE_URGENT_DAYS_THRESHOLD } from "../constants";

/**
 * Permanent banner shown throughout the Demo/Trial period, driven entirely
 * by tfs-backend's computed lifecycle fields — never computes expiry itself.
 * See tfs-backend/docs/account-lifecycle-design.md §3 and §8.
 */
export function AccountLifecycleBanner() {
	const { t } = useTranslation();
	const { lifecycle } = useAccountLifecycle();

	if (!lifecycle || lifecycle.accountType === "standard") return null;

	const { lifecycleStatus, daysRemaining, accountType } = lifecycle;
	const isExpired = lifecycleStatus === "expired" || lifecycleStatus === "cancelled";
	const isUrgent =
		isExpired ||
		(typeof daysRemaining === "number" &&
			daysRemaining <= LIFECYCLE_URGENT_DAYS_THRESHOLD);

	const accountTypeLabel =
		accountType === "demo"
			? t(localizationConstants.lifecycleBadgeDemo)
			: t(localizationConstants.lifecycleBadgeTrial);

	return (
		<div
			role="status"
			className={cn(
				"flex w-full items-center justify-between gap-3 px-4 py-2 text-sm",
				isUrgent
					? "bg-red-50 text-red-800 border-b border-red-200"
					: "bg-amber-50 text-amber-900 border-b border-amber-200",
			)}
		>
			<div className="flex items-center gap-2">
				{isUrgent ? (
					<AlertTriangle className="h-4 w-4 shrink-0" />
				) : (
					<Clock className="h-4 w-4 shrink-0" />
				)}
				<span className="font-medium">{accountTypeLabel}</span>
				<span aria-hidden="true">—</span>
				<LifecycleMessage
					isExpired={isExpired}
					daysRemaining={daysRemaining}
				/>
			</div>
			<Button asChild size="sm" variant={isUrgent ? "destructive" : "primary"}>
				<Link href={LIFECYCLE_UPGRADE_PATH}>
					{t(localizationConstants.lifecycleUpgradeCta)}
				</Link>
			</Button>
		</div>
	);
}

function LifecycleMessage({
	isExpired,
	daysRemaining,
}: {
	isExpired: boolean;
	daysRemaining: number | null;
}) {
	const { t } = useTranslation();

	if (isExpired) {
		return <span>{t(localizationConstants.lifecycleExpiredMessage)}</span>;
	}
	if (daysRemaining === 0) {
		return <span>{t(localizationConstants.lifecycleExpiresToday)}</span>;
	}
	return (
		<span>
			{daysRemaining} {t(localizationConstants.lifecycleDaysRemainingSuffix)}
		</span>
	);
}
