import { Suspense } from "react";
import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderConstructionLogPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderConstructionLogPageRoute({
	params,
}: OrderConstructionLogPageRouteProps) {
	const { id } = await params;
	return (
		<Suspense fallback={null}>
			<OrderOpenedPage orderId={id} initialTab="dagbok" />
		</Suspense>
	);
}
