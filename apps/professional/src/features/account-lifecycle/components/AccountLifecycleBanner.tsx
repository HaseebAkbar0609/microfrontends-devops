"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useAccountLifecycle } from "../hooks/useAccountLifecycle";
import {
	LIFECYCLE_BANNER_HEIGHT_CSS_VAR,
	LIFECYCLE_UPGRADE_PATH,
	LIFECYCLE_URGENT_DAYS_THRESHOLD,
} from "../constants";

/**
 * Reports this element's rendered height on `document.documentElement` as
 * `LIFECYCLE_BANNER_HEIGHT_CSS_VAR`, cleared whenever there's no element (not
 * just on unmount — this component renders `null` while lifecycle data is
 * loading and then a div once it resolves, so a plain useRef+useEffect with
 * empty deps would never re-measure that transition). A callback ref fires on
 * every attach/detach, which is what makes that transition work correctly.
 * Header.tsx reads the variable so its viewport-`fixed` centered logo stays
 * correctly positioned whether or not the banner is showing.
 */
function useReportBannerHeight() {
	const observerRef = useRef<ResizeObserver | null>(null);

	const setRef = useCallback((el: HTMLElement | null) => {
		observerRef.current?.disconnect();
		const root = document.documentElement;
		if (!el) {
			root.style.setProperty(LIFECYCLE_BANNER_HEIGHT_CSS_VAR, "0px");
			return;
		}
		const report = () =>
			root.style.setProperty(LIFECYCLE_BANNER_HEIGHT_CSS_VAR, `${el.offsetHeight}px`);
		report();
		const observer = new ResizeObserver(report);
		observer.observe(el);
		observerRef.current = observer;
	}, []);

	// Also reset if the whole component unmounts (e.g. route change tears
	// down AppShell) while an observer is still attached.
	useEffect(() => {
		return () => {
			observerRef.current?.disconnect();
			document.documentElement.style.setProperty(LIFECYCLE_BANNER_HEIGHT_CSS_VAR, "0px");
		};
	}, []);

	return setRef;
}

/**
 * Permanent banner shown throughout the Demo/Trial period, driven entirely
 * by tfs-backend's computed lifecycle fields — never computes expiry itself.
 * See tfs-backend/docs/account-lifecycle-design.md §3 and §8.
 */
export function AccountLifecycleBanner() {
	const { t } = useTranslation();
	const { lifecycle } = useAccountLifecycle();
	const bannerRef = useReportBannerHeight();

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
			ref={bannerRef}
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
				<span className="font-medium">{accountTypeLabel}:</span>
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
