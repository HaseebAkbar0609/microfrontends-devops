import { appConstants } from "@/constants/api";

const COOKIE_NAME = appConstants.LOCAL_REQUIRES_SUBSCRIPTION_COOKIE_NAME;
const MAX_AGE_SEC = 60 * 60 * 24 * 30;

export function coerceRequiresSubscription(value: unknown): boolean {
	if (value === true || value === "true" || value === "1" || value === 1)
		return true;
	if (value === false || value === "false" || value === "0" || value === 0)
		return false;
	if (value === undefined || value === null || value === "") return false;
	if (typeof value === "string") return value.toLowerCase() === "true";
	return false;
}

/** Read `requires_subscription` from root, `data`, or `data.data` (auth APIs vary). */
export function extractRequiresSubscriptionFlag(body: unknown): boolean {
	if (!body || typeof body !== "object") return false;
	const root = body as Record<string, unknown>;
	const fromRoot = root.requires_subscription;

	const d = root.data;
	if (d && typeof d === "object") {
		const layer1 = d as Record<string, unknown>;
		const fromLayer1 = layer1.requires_subscription;
		const inner = layer1.data;
		const fromLayer2 =
			inner && typeof inner === "object"
				? (inner as Record<string, unknown>).requires_subscription
				: undefined;
		return coerceRequiresSubscription(
			fromRoot ?? fromLayer1 ?? fromLayer2,
		);
	}

	return coerceRequiresSubscription(fromRoot);
}

export function setRequiresSubscriptionCookie(requiresSubscription: boolean): void {
	if (typeof document === "undefined") return;
	const v = requiresSubscription ? "1" : "0";
	document.cookie = `${COOKIE_NAME}=${v}; path=/; max-age=${MAX_AGE_SEC}; SameSite=Lax`;
}

export function clearRequiresSubscriptionCookie(): void {
	if (typeof document === "undefined") return;
	document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

/** Client-only: true when cookie value is "1". */
export function getRequiresSubscriptionFromBrowserCookie(): boolean {
	if (typeof document === "undefined") return false;
	const parts = document.cookie.split(";").map((p) => p.trim());
	for (const part of parts) {
		if (part.startsWith(`${COOKIE_NAME}=`)) {
			return part.slice(COOKIE_NAME.length + 1) === "1";
		}
	}
	return false;
}
