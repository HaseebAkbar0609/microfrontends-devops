import { Suspense } from "react";
import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderAtaPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderAtaPageRoute({
	params,
}: OrderAtaPageRouteProps) {
	const { id } = await params;
	return (
		<Suspense fallback={null}>
			<OrderOpenedPage orderId={id} initialTab="ata" />
		</Suspense>
	);
}
