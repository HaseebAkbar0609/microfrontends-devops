import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderInformationPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderInformationPageRoute({
	params,
}: OrderInformationPageRouteProps) {
	const { id } = await params;
	return <OrderOpenedPage orderId={id} initialTab="order-information" />;
}
