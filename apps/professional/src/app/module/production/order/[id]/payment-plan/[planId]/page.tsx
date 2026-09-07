import { OrderPaymentPlanDetailPage } from "@/features/orders/payment-plan/OrderPaymentPlanDetailPage";

interface OrderPaymentPlanDetailPageRouteProps {
	params: Promise<{ id: string; planId: string }>;
}

export default async function OrderPaymentPlanDetailPageRoute({
	params,
}: OrderPaymentPlanDetailPageRouteProps) {
	const { id, planId } = await params;
	return <OrderPaymentPlanDetailPage orderId={id} planId={planId} />;
}
