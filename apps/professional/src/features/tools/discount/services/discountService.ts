import type { ActionResult } from "@/types/api";
import {
	DISCOUNTS,
	DISCOUNT_PARTNER_DETAILS,
} from "../constants/mockData";
import { DISCOUNT_MOCK_LATENCY_MS, DISCOUNT_STATUS_ORDER } from "../constants";
import type {
	Discount,
	DiscountFilters,
	DiscountPartnerDetail,
	DiscountQuery,
} from "../types/discount.types";

/**
 * Mock data source for the Tools / Discount view (TFS-1044).
 *
 * Every function resolves an `ActionResult<T>`, the same envelope the real
 * api-actions use, so wiring the Professional discounts API later means
 * replacing these bodies with axios calls — no component changes.
 */

function delay<T>(value: T): Promise<T> {
	return new Promise((resolve) =>
		setTimeout(() => resolve(value), DISCOUNT_MOCK_LATENCY_MS),
	);
}

function compareDiscounts(a: Discount, b: Discount): number {
	const byStatus =
		DISCOUNT_STATUS_ORDER.indexOf(a.status) -
		DISCOUNT_STATUS_ORDER.indexOf(b.status);
	if (byStatus !== 0) return byStatus;
	return b.discountPct - a.discountPct;
}

function matchesQuery(discount: Discount, query: DiscountQuery): boolean {
	if (query.supplier && discount.supplier !== query.supplier) return false;
	if (query.category && discount.category !== query.category) return false;
	if (query.status && discount.status !== query.status) return false;
	return true;
}

/** Discounts matching `query`, ordered active → upcoming → expired. */
export async function listDiscounts(
	query: DiscountQuery = {},
): Promise<ActionResult<Discount[]>> {
	const items = DISCOUNTS.filter((discount) =>
		matchesQuery(discount, query),
	).sort(compareDiscounts);

	return delay({ success: true, data: items, error: null });
}

/** Distinct supplier and category values backing the toolbar selects. */
export async function getDiscountFilters(): Promise<
	ActionResult<DiscountFilters>
> {
	const suppliers = [...new Set(DISCOUNTS.map((d) => d.supplier))].sort(
		(a, b) => a.localeCompare(b),
	);
	const categories = [...new Set(DISCOUNTS.map((d) => d.category))].sort(
		(a, b) => a.localeCompare(b),
	);

	return delay({
		success: true,
		data: { suppliers, categories },
		error: null,
	});
}

/**
 * Partner profile, offers and banners for the detail view. An unknown id
 * resolves successfully with a null partner, matching how the Customer
 * api-action maps a 404 so the view can render its not-found state.
 */
export async function getDiscountPartnerDetail(
	partnerId: string,
): Promise<ActionResult<DiscountPartnerDetail>> {
	const detail = DISCOUNT_PARTNER_DETAILS[partnerId];

	return delay({
		success: true,
		data: detail ?? { partner: null, offers: [], bannerSlides: [] },
		error: null,
	});
}
