import { notFound } from "next/navigation";
import QuoteBuilderPage from "@/features/sales/components/quote/QuoteBuilderPage";
import { parseSalesCompanyId } from "@/features/sales/schemas/salesCompany.schema";

type QuotePageProps = {
	params: Promise<{ companyId: string }>;
};

export default async function Page({ params }: QuotePageProps) {
	const { companyId } = await params;
	const parsedCompanyId = parseSalesCompanyId(companyId);
	if (!parsedCompanyId) notFound();

	return <QuoteBuilderPage companyId={parsedCompanyId} />;
}
