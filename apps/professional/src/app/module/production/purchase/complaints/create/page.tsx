import { parseOptionalIdParam } from "@/lib/routeParams";

import CreateComplaintPage from "@/features/purchase/create-complaint/CreateComplaintPage";
import { MOCK_PURCHASES } from "@/features/purchase/data/purchases.mock";

/**
 * Opened from a purchase record, the wizard is told which purchase to start on
 * via `?purchaseNo=`. That value is user-supplied, so it is shape-checked and
 * then resolved against the known purchases — only a number that matches a real
 * row reaches the form, and anything else silently falls back to the unscoped
 * default rather than being echoed into the draft.
 */
function resolvePurchaseNo(value: string | string[] | undefined) {
	const purchaseNo = parseOptionalIdParam(value);
	if (!purchaseNo) return undefined;

	return MOCK_PURCHASES.find((row) => row.purchaseNo === purchaseNo)
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
