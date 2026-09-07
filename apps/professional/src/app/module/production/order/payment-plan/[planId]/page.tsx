import { OrderPaymentPlanDetailPage } from "@/features/orders/payment-plan/OrderPaymentPlanDetailPage";

interface OrderPaymentPlanDetailRootPageRouteProps {
	params: Promise<{ planId: string }>;
}

export default async function OrderPaymentPlanDetailRootPageRoute({
	params,
}: OrderPaymentPlanDetailRootPageRouteProps) {
	const { planId } = await params;
	return <OrderPaymentPlanDetailPage orderId="5000-001" planId={planId} />;
}
