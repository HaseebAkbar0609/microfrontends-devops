import { Suspense } from "react";
import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderStaffPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderStaffPageRoute({
	params,
}: OrderStaffPageRouteProps) {
	const { id } = await params;
	return (
		<Suspense fallback={null}>
			<OrderOpenedPage orderId={id} initialTab="staff" />
		</Suspense>
	);
}
