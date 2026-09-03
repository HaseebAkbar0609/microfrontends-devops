import { OrderOrganisationPage } from "@/features/orders/organisation/OrderOrganisationPage";

interface OrderOrganisationPageRouteProps {
	params: Promise<{ id: string }>;
}

export default async function OrderOrganisationPageRoute({
	params,
}: OrderOrganisationPageRouteProps) {
	const { id } = await params;
	return <OrderOrganisationPage orderId={id} />;
}
