import { notFound } from "next/navigation";
import CompanyDetailPage from "@/features/sales/components/company/CompanyDetailPage";
import { parseSalesCompanyId } from "@/features/sales/schemas/salesCompany.schema";

type CompanyPageProps = {
	params: Promise<{ companyId: string }>;
};

export default async function Page({ params }: CompanyPageProps) {
	const { companyId } = await params;
	const parsedCompanyId = parseSalesCompanyId(companyId);
	if (!parsedCompanyId) notFound();

	return <CompanyDetailPage companyId={parsedCompanyId} />;
}
