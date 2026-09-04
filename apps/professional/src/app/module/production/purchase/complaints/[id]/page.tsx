import { notFound } from "next/navigation";
import { z } from "zod";

import PurchaseComplaintDetailPage from "@/features/purchase/components/PurchaseComplaintDetailPage";
import { MOCK_PURCHASE_COMPLAINTS } from "@/features/purchase/data/purchaseComplaints.mock";

/**
 * Complaint ids are slugs. Validating the shape here keeps the pattern honest
 * once this reads from an API rather than the mock, where an unchecked path
 * segment would reach a query.
 */
const complaintIdSchema = z
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

	const parsed = complaintIdSchema.safeParse(decodeURIComponent(id));
	if (!parsed.success) notFound();

	const complaint = MOCK_PURCHASE_COMPLAINTS.find(
		(row) => row.id === parsed.data,
	);

	if (!complaint) notFound();

	return <PurchaseComplaintDetailPage complaint={complaint} />;
}
