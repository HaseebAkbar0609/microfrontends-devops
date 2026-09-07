import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderPaymentPlanPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderPaymentPlanPageRoute({
	params,
}: OrderPaymentPlanPageRouteProps) {
	const { id } = await params;
	return <OrderOpenedPage orderId={id} initialTab="payment-plan" />;
}
