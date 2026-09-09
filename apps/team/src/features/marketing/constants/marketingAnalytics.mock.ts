import localizationConstants from "@/utils/translation/constants";
import type { TrafficPoint, TrafficSource } from "../types";

/**
 * Web-analytics figures for the overview.
 *
 * These are a fixed sample rather than a derivation of the `rapporter`
 * register: the register stores whole saved reports at whatever period the user
 * chose, while the chart needs a continuous monthly series. The prototype had
 * both and let them drift silently; keeping the seam explicit here means the
 * chart swaps to an analytics endpoint without touching the registers.
 *
 * Month labels stay literal - translating them would desynchronise the axis
 * from the series it plots.
 */
export const MARKETING_TRAFFIC: TrafficPoint[] = [
	{ label: "Sep", visitors: 8200, conversions: 140, organic: 3900 },
	{ label: "Okt", visitors: 9400, conversions: 168, organic: 4300 },
	{ label: "Nov", visitors: 11200, conversions: 205, organic: 5100 },
	{ label: "Dec", visitors: 9800, conversions: 172, organic: 4700 },
	{ label: "Jan", visitors: 12600, conversions: 244, organic: 5900 },
	{ label: "Feb", visitors: 14100, conversions: 281, organic: 6800 },
];

/** Colours are inline hex, matching how the support module feeds recharts. */
export const MARKETING_TRAFFIC_SOURCES: TrafficSource[] = [
	{
		id: "organic",
		labelKey: localizationConstants.marketingSourceOrganic,
		share: 42,
		chartColor: "#0f766e",
	},
	{
		id: "googleAds",
		labelKey: localizationConstants.marketingSourceGoogleAds,
		share: 24,
		chartColor: "#0284c7",
	},
	{
		id: "social",
		labelKey: localizationConstants.marketingSourceSocial,
		share: 18,
		chartColor: "#f59e0b",
	},
	{
		id: "email",
		labelKey: localizationConstants.marketingSourceEmail,
		share: 10,
		chartColor: "#8b5cf6",
	},
	{
		id: "direct",
		labelKey: localizationConstants.marketingSourceDirect,
		share: 6,
		chartColor: "#64748b",
	},
];

/** Series colours for the two charts, kept beside the data they colour. */
export const MARKETING_CHART_COLORS = {
	visitors: "#0f766e",
	organic: "#38bdf8",
	budget: "#94a3b8",
	actual: "#0f766e",
} as const;
