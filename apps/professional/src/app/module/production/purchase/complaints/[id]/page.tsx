import { notFound } from "next/navigation";

import PurchaseComplaintDetailPage from "@/features/purchase/components/PurchaseComplaintDetailPage";
import { MOCK_PURCHASE_COMPLAINTS } from "@/features/purchase/data/purchaseComplaints.mock";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const complaint = MOCK_PURCHASE_COMPLAINTS.find(
		(row) => row.id === decodeURIComponent(id),
	);

	if (!complaint) notFound();

	return <PurchaseComplaintDetailPage complaint={complaint} />;
}
