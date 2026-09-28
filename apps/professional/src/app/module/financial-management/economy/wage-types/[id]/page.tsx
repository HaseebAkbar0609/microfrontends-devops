import { WageTypeDetailPage } from "@/features/financial-management/components/wage-types/detail/WageTypeDetailPage";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EconomyWageTypeDetailPage({ params }: PageProps) {
	const { id } = await params;
	return <WageTypeDetailPage id={id} />;
}
