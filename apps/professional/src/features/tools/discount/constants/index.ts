import type { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import type { DiscountStatus } from "../types/discount.types";

export const DISCOUNTS_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools, href: "#" },
	{ label: localizationConstants.discountsItem },
];

export const DISCOUNT_DETAIL_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools, href: "#" },
	{ label: localizationConstants.discountsItem, href: "/tools/discount" },
];

/** Sentinel for "no filter applied" — Radix Select forbids an empty string value. */
export const DISCOUNT_FILTER_ALL = "__all__";

/** Skeleton cards rendered while the mock service resolves. */
export const DISCOUNT_SKELETON_COUNT = 6;

/** How long the "Copied" confirmation stays on the copy button, in ms. */
export const DISCOUNT_COPY_FEEDBACK_MS = 2000;

/** Latency the mock service simulates so loading states are exercised, in ms. */
export const DISCOUNT_MOCK_LATENCY_MS = 300;

/** Auto-advance interval of the partner banner carousel, in ms. */
export const DISCOUNT_BANNER_INTERVAL_MS = 4000;

export const DISCOUNT_STATUS_LABELS: Record<DiscountStatus, string> = {
	active: localizationConstants.discountsStatusActive,
	upcoming: localizationConstants.discountsStatusUpcoming,
	expired: localizationConstants.discountsStatusExpired,
};

/** Tailwind classes per status badge, keyed so the card stays declarative. */
export const DISCOUNT_STATUS_BADGE_CLASSES: Record<DiscountStatus, string> = {
	active: "text-[#008236] bg-[#F0FDF4] border-[#B9F8CF]",
	upcoming: "text-[#1447E6] bg-[#EFF6FF] border-[#BEDBFF]",
	expired: "text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]",
};

export const DISCOUNT_STATUS_ORDER: DiscountStatus[] = [
	"active",
	"upcoming",
	"expired",
];
