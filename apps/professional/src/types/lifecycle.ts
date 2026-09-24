/**
 * Demo/Trial account lifecycle contract.
 * Mirrors tfs-backend `GET /companies/{id}/lifecycle` exactly — see
 * tfs-backend/docs/account-lifecycle-design.md §8. The frontend must never
 * independently compute expiry/remaining days; always read these fields.
 */

export type AccountType = "demo" | "trial" | "standard";

export type LifecycleStatus =
	| "active"
	| "expired"
	| "upgraded"
	| "cancelled"
	| "paused"
	| null;

export interface AccountLifecycle {
	accountType: AccountType;
	lifecycleStatus: LifecycleStatus;
	startedAt: string | null;
	expiresAt: string | null;
	configuredDuration: number | null;
	daysRemaining: number | null;
	canCreateContent: boolean;
}

export interface AccountLifecyclePopup {
	id: string;
	event: string;
	title: string;
	body: string;
	deepLink: string | null;
	payload: Record<string, unknown> | null;
	createdAt: number;
}

/** Stable backend error code — see tfs-backend/app/api/dependencies/entitlement.py */
export const ACCOUNT_EXPIRED_ERROR_CODE = "ACCOUNT_EXPIRED_READ_ONLY" as const;

export interface AccountExpiredErrorDetails {
	accountType: AccountType;
	lifecycleStatus: LifecycleStatus;
	expiresAt: string | null;
}
