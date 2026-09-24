import { CostCenterDetailPage } from "@/features/financial-management";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EconomyCostCenterDetailPage({ params }: PageProps) {
	const { id } = await params;
	return <CostCenterDetailPage id={id} />;
}
