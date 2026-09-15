import { Suspense } from "react";
import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderQaPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderQaPageRoute({
	params,
}: OrderQaPageRouteProps) {
	const { id } = await params;
	return (
		<Suspense fallback={null}>
			<OrderOpenedPage orderId={id} initialTab="fraga-svar" />
		</Suspense>
	);
}
