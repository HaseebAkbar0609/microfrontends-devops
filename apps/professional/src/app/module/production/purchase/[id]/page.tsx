import { notFound } from "next/navigation";
import { z } from "zod";

import PurchaseRecordPage from "@/features/purchase/components/PurchaseRecordPage";
import { MOCK_PURCHASES } from "@/features/purchase/data/purchases.mock";

/**
 * Purchase ids are numbers like "I501". Validating the shape here keeps the
 * pattern honest once this reads from an API rather than the mock, where an
 * unchecked path segment would reach a query.
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

	return <PurchaseRecordPage purchase={purchase} />;
}
