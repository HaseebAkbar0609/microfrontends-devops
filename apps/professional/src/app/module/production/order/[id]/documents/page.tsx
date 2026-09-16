import { Suspense } from "react";
import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderDocumentsPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderDocumentsPageRoute({
	params,
}: OrderDocumentsPageRouteProps) {
	const { id } = await params;
	return (
		<Suspense fallback={null}>
			<OrderOpenedPage orderId={id} initialTab="handlingar" />
		</Suspense>
	);
}
