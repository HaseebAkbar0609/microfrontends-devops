import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
	const { id } = await params;
	return <OrderOpenedPage orderId={id} />;
}
