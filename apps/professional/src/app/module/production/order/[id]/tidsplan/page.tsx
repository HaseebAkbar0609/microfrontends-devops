import { Suspense } from "react";
import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderTimeplanPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderTimeplanPageRoute({
	params,
}: OrderTimeplanPageRouteProps) {
	const { id } = await params;
	return (
		<Suspense fallback={null}>
			<OrderOpenedPage orderId={id} initialTab="tidsplan" />
		</Suspense>
	);
}
