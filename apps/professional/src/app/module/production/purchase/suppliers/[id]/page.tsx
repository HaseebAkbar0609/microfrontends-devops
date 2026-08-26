import { notFound } from "next/navigation";

import PurchaseSupplierDetailPage from "@/features/purchase/components/PurchaseSupplierDetailPage";
import { MOCK_PURCHASE_SUPPLIERS } from "@/features/purchase/data/purchaseSuppliers.mock";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supplier = MOCK_PURCHASE_SUPPLIERS.find(
		(row) => row.id === decodeURIComponent(id),
	);

	if (!supplier) notFound();

	return <PurchaseSupplierDetailPage supplier={supplier} />;
}
