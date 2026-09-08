import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderGuaranteePageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderGuaranteePageRoute({
	params,
}: OrderGuaranteePageRouteProps) {
	const { id } = await params;
	return <OrderOpenedPage orderId={id} initialTab="guarantee" />;
}
