import { OrderPaymentPlanListPage } from "@/features/orders/payment-plan/OrderPaymentPlanListPage";

interface OrderPaymentPlanPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderPaymentPlanPageRoute({
	params,
}: OrderPaymentPlanPageRouteProps) {
	const { id } = await params;
	return <OrderPaymentPlanListPage orderId={id} />;
}
