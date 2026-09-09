import { Suspense } from "react";
import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderProtocolPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderProtocolPageRoute({
	params,
}: OrderProtocolPageRouteProps) {
	const { id } = await params;
	return (
		<Suspense fallback={null}>
			<OrderOpenedPage orderId={id} initialTab="protocol" />
		</Suspense>
	);
}
