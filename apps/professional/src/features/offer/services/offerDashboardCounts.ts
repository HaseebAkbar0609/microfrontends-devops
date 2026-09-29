import {
	listAvailableOffersAPIAction,
	listOffersAPIAction,
	OFFER_API_STATUS,
} from "@/api-actions/offers";

export const OFFER_COUNT_KEYS = ["available", "requested", "offered", "accepted", "archived"] as const;
export type OfferCountKey = (typeof OFFER_COUNT_KEYS)[number];
export type OfferDashboardCounts = Record<OfferCountKey, number | null>;
export const OFFER_COUNTS_CACHE_MS = 60_000;
const COUNT_PAGE = 1;
const COUNT_PAGE_SIZE = 1;

const cachedCounts = new Map<string, { value: OfferDashboardCounts; expiresAt: number }>();
const pendingCounts = new Map<string, Promise<OfferDashboardCounts>>();

export function offerCountsScope(companyId: string, actorId: string) {
	return JSON.stringify([companyId, actorId]);
}

export function invalidateOfferCounts(companyId: string, actorId: string) {
	cachedCounts.delete(offerCountsScope(companyId, actorId));
}

export function loadOfferCounts(companyId: string, actorId: string): Promise<OfferDashboardCounts> {
	if (!companyId || !actorId) return Promise.reject(new Error("Offer counts require company and actor context"));
	const key = offerCountsScope(companyId, actorId);
	const cached = cachedCounts.get(key);
	if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value);
	cachedCounts.delete(key);
	const pending = pendingCounts.get(key);
	if (pending) return pending;
	const params = { companyId, page: COUNT_PAGE, pageSize: COUNT_PAGE_SIZE };
	const request = Promise.allSettled([
		listAvailableOffersAPIAction(params),
		listOffersAPIAction({ ...params, status: OFFER_API_STATUS.REQUESTED }),
		listOffersAPIAction({ ...params, status: OFFER_API_STATUS.OFFERED }),
		listOffersAPIAction({ ...params, status: OFFER_API_STATUS.ACCEPTED }),
		listOffersAPIAction({ ...params, status: OFFER_API_STATUS.ARCHIVED }),
	]).then((results) => {
		const counts = Object.fromEntries(results.map((result, index) => {
			const total = result.status === "fulfilled" ? result.value.totalItems : null;
			return [OFFER_COUNT_KEYS[index], typeof total === "number" && Number.isInteger(total) && total >= 0 ? total : null];
		})) as OfferDashboardCounts;
		if (OFFER_COUNT_KEYS.every((id) => counts[id] !== null)) {
			cachedCounts.set(key, { value: counts, expiresAt: Date.now() + OFFER_COUNTS_CACHE_MS });
		}
		return counts;
	}).finally(() => pendingCounts.delete(key));
	pendingCounts.set(key, request);
	return request;
}
