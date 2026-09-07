import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderInspectionPageProps {
	params: Promise<{ id: string }>;
}

export default async function OrderInspectionPage({ params }: OrderInspectionPageProps) {
	const { id } = await params;
	return <OrderOpenedPage orderId={id} initialTab="inspection" />;
}
