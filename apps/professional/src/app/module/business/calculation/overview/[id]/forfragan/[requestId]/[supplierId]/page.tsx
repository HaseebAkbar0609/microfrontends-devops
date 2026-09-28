import { SupplierQuoteView } from "@/features/calculation/components/SupplierQuoteView";

interface PageProps {
	params: Promise<{ id: string; requestId: string; supplierId: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id, requestId, supplierId } = await params;
	return (
		<SupplierQuoteView
			calcId={id}
			requestId={requestId}
			supplierId={supplierId}
		/>
	);
}
