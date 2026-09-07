import { OrderOpenedPage } from "@/features/orders/opened/OrderOpenedPage";

interface OrderOrganisationPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderOrganisationPageRoute({
	params,
}: OrderOrganisationPageRouteProps) {
	const { id } = await params;
	return <OrderOpenedPage orderId={id} initialTab="organisation" />;
}
