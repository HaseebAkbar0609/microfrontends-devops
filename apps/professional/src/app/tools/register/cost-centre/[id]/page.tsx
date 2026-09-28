import { CostCenterDetailPage } from "@/features/financial-management/components/cost-centers/detail/CostCenterDetailPage";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function CostCenterDetailRoute({ params }: PageProps) {
	const { id } = await params;
	return <CostCenterDetailPage id={id} />;
}
