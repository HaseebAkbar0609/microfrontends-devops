import { notFound } from "next/navigation";
import OrderConfirmationPage from "@/features/sales/components/order/OrderConfirmationPage";
import { parseSalesCompanyId } from "@/features/sales/schemas/salesCompany.schema";

type OrderConfirmationPageProps = {
	params: Promise<{ companyId: string }>;
};

export default async function Page({ params }: OrderConfirmationPageProps) {
	const { companyId } = await params;
	const parsedCompanyId = parseSalesCompanyId(companyId);
	if (!parsedCompanyId) notFound();

	return <OrderConfirmationPage companyId={parsedCompanyId} />;
}
