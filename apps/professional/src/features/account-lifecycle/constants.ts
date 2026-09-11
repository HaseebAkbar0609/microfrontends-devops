/**
 * Demo/Trial account lifecycle feature constants.
 * See tfs-backend/docs/account-lifecycle-design.md for the backend contract
 * this feature consumes.
 */

/** How often to re-fetch lifecycle status / pending popups while the app is open. */
export const LIFECYCLE_REFETCH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
export const LIFECYCLE_POPUP_REFETCH_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

/** daysRemaining at/below this value switches the banner to its urgent style. */
export const LIFECYCLE_URGENT_DAYS_THRESHOLD = 3;

/** Where the banner's / popup's upgrade CTA links to. */
export const LIFECYCLE_UPGRADE_PATH = "/manage-plans";

/**
 * CSS custom property the banner writes its own rendered height to, on
 * `document.documentElement`. Read by Header.tsx so its viewport-`fixed`
 * centered logo offsets correctly when the banner is/isn't showing — see
 * AccountLifecycleBanner.tsx and Header.tsx for the full story.
 */
export const LIFECYCLE_BANNER_HEIGHT_CSS_VAR = "--lifecycle-banner-height";

export const LIFECYCLE_QUERY_KEYS = {
	status: (companyId: string | undefined) => ["account-lifecycle", companyId] as const,
	popups: (companyId: string | undefined) =>
		["account-lifecycle-popups", companyId] as const,
};
