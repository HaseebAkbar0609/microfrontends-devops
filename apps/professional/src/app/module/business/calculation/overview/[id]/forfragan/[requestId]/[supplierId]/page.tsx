import { SupplierQuoteView } from "@/features/calculation/components/SupplierQuoteView";
import { MOCK_SUPPLIER_QUOTE } from "@/features/calculation/constants/forfragnMock";

interface PageProps {
	params: Promise<{ id: string; requestId: string; supplierId: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id, requestId } = await params;
	return (
		<SupplierQuoteView
			calcId={id}
			requestId={requestId}
			data={MOCK_SUPPLIER_QUOTE}
		/>
	);
}
