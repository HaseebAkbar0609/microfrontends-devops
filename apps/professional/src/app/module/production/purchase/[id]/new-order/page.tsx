import { notFound } from "next/navigation";
import { z } from "zod";

import CreatePurchaseOrderPage from "@/features/purchase/create-order/CreatePurchaseOrderPage";
import { MOCK_PURCHASES } from "@/features/purchase/data/purchases.mock";

/**
 * The order is created under a purchase, so the same id guard as the record
 * route applies: validate the shape before it is used to look anything up.
 */
const purchaseIdSchema = z
	.string()
	.trim()
	.min(1)
	.max(64)
	.regex(/^[A-Za-z0-9_-]+$/);

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const parsed = purchaseIdSchema.safeParse(decodeURIComponent(id));
	if (!parsed.success) notFound();

	const purchase = MOCK_PURCHASES.find((row) => row.id === parsed.data);
	if (!purchase) notFound();

	return <CreatePurchaseOrderPage purchase={purchase} />;
}
