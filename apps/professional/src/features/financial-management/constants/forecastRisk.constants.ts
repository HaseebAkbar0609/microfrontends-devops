import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type {
	RiskClientStatus,
	RiskLevel,
	RiskListSortField,
	RiskProjectPayment,
} from "../types/forecastRisk.types";

export const FORECAST_RISK_BASE_ROUTE = "/module/financial-management/forecast/risk-management";

/** Every Riskhantering URL, built in one place so no component writes a path. */
export function riskRoutes(basePath: string = FORECAST_RISK_BASE_ROUTE) {
	return {
		list: basePath,
		detail: (id: string) => `${basePath}/${id}`,
	};
}

export const RISK_LIST_PAGE_SIZE = 10;

/** The register's columns in the frame's order; every one sorts. */
export const RISK_LIST_COLUMNS: { key: RiskListSortField; labelKey: TranslationKeys }[] = [
	{ key: "name", labelKey: localizationConstants.forecastRiskColClient },
	{ key: "activeObjects", labelKey: localizationConstants.forecastRiskColObjects },
	{ key: "totalCost", labelKey: localizationConstants.forecastRiskColTotalCost },
	{ key: "creditLimit", labelKey: localizationConstants.forecastRiskColLimit },
	{ key: "totalPaid", labelKey: localizationConstants.forecastRiskColPaid },
	{ key: "pendingAmount", labelKey: localizationConstants.forecastRiskColPending },
	{ key: "level", labelKey: localizationConstants.status },
];

/**
 * A level's badge, its ring colour and the text colour its outstanding amount
 * reads in. The frame draws only green and red; the middle band is what the
 * ring's third slice needs, and it earns its own amber.
 */
export const RISK_LEVEL_META: Record<
	RiskLevel,
	{ labelKey: TranslationKeys; variant: "success" | "warning" | "danger"; color: string; amountClass: string }
> = {
	low: {
		labelKey: localizationConstants.forecastRiskLevelLow,
		variant: "success",
		color: "#10b981",
		amountClass: "text-slate-900",
	},
	watch: {
		labelKey: localizationConstants.forecastRiskLevelWatch,
		variant: "warning",
		color: "#f59e0b",
		amountClass: "text-amber-600",
	},
	high: {
		labelKey: localizationConstants.forecastRiskLevelHigh,
		variant: "danger",
		color: "#ef4444",
		amountClass: "text-red-600",
	},
};

/** The order the ring and its legend read in: safest first. */
export const RISK_LEVEL_ORDER: RiskLevel[] = ["low", "watch", "high"];

/** The Filter menu's level group, reading its labels off the meta above. */
export const RISK_LEVEL_LABELS: Record<RiskLevel, TranslationKeys> = {
	low: RISK_LEVEL_META.low.labelKey,
	watch: RISK_LEVEL_META.watch.labelKey,
	high: RISK_LEVEL_META.high.labelKey,
};

export const RISK_CLIENT_STATUS_LABELS: Record<RiskClientStatus, TranslationKeys> = {
	ongoing: localizationConstants.forecastRiskStatusOngoing,
	paused: localizationConstants.forecastRiskStatusPaused,
};

/** A project's payment state, as its card's tag reads it. */
export const RISK_PAYMENT_META: Record<
	RiskProjectPayment,
	{ labelKey: TranslationKeys; variant: "success" | "warning" | "danger" }
> = {
	fullyPaid: { labelKey: localizationConstants.forecastRiskPaymentFullyPaid, variant: "success" },
	partiallyPaid: { labelKey: localizationConstants.forecastRiskPaymentPartiallyPaid, variant: "warning" },
	pending: { labelKey: localizationConstants.forecastRiskPaymentPending, variant: "danger" },
};

/**
 * The gauge reads the outstanding amount against the threshold. It stops at
 * 120 %, since a needle that has left the dial says no more than one pinned to
 * its end, and the figure above it carries the real number anyway.
 */
export const RISK_GAUGE_MAX_PERCENT = 120;

/** The dial's bands, in percent of the threshold. */
export const RISK_GAUGE_BANDS: { upTo: number; color: string }[] = [
	{ upTo: 80, color: "#10b981" },
	{ upTo: 100, color: "#f59e0b" },
	{ upTo: RISK_GAUGE_MAX_PERCENT, color: "#ef4444" },
];
