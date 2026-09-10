import { parseRecordIdParam } from "@/lib/routeParams";

import { OrderWarrantyDetailPage } from "@/features/orders/warranty/OrderWarrantyDetailPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <OrderWarrantyDetailPage id={parseRecordIdParam(id)} />;
}
