import { z } from "zod";

import CreateComplaintPage from "@/features/purchase/create-complaint/CreateComplaintPage";
import { MOCK_PURCHASES } from "@/features/purchase/data/purchases.mock";

/**
 * Opened from a purchase record, the wizard is told which purchase to start on
 * via `?purchaseNo=`. That value is user-supplied, so it is shape-checked here
 * and then resolved against the known purchases — only a number that matches a
 * real row reaches the form, and anything else silently falls back to the
 * unscoped default rather than being echoed into the draft.
 */
const purchaseNoSchema = z
	.string()
	.trim()
	.min(1)
	.max(64)
	.regex(/^[A-Za-z0-9_-]+$/);

function resolvePurchaseNo(value: string | string[] | undefined) {
	if (typeof value !== "string") return undefined;

	let decoded: string;
	try {
		decoded = decodeURIComponent(value);
	} catch {
		return undefined;
	}

	const parsed = purchaseNoSchema.safeParse(decoded);
	if (!parsed.success) return undefined;

	return MOCK_PURCHASES.find((row) => row.purchaseNo === parsed.data)
		?.purchaseNo;
}

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ purchaseNo?: string | string[] }>;
}) {
	const { purchaseNo } = await searchParams;

	return <CreateComplaintPage prefillPurchaseNo={resolvePurchaseNo(purchaseNo)} />;
}
