import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderProtocolPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderProtocolPageRoute({
	params,
}: OrderProtocolPageRouteProps) {
	const { id } = await params;
	return <OrderOpenedPage orderId={id} initialTab="protocol" />;
}
