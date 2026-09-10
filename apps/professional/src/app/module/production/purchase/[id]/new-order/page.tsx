import { notFound } from "next/navigation";

import { parseRecordIdParam } from "@/lib/routeParams";

import CreatePurchaseOrderPage from "@/features/purchase/create-order/CreatePurchaseOrderPage";
import { MOCK_PURCHASES } from "@/features/purchase/data/purchases.mock";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const recordId = parseRecordIdParam(id);

	const purchase = MOCK_PURCHASES.find((row) => row.id === recordId);
	if (!purchase) notFound();

	return <CreatePurchaseOrderPage purchase={purchase} />;
}
