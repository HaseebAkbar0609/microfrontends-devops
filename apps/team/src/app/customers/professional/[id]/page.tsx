import { ProfessionalOverviewPage } from "@/features/customers/professional/overview/ProfessionalOverviewPage";

export const dynamic = "force-dynamic";

interface PageProps {
	readonly params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <ProfessionalOverviewPage id={id} />;
}
