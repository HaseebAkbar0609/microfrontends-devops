import { CalculationDetailView } from "@/features/calculation/components/CalculationDetailView";

export default async function CalculationDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <CalculationDetailView id={id} />;
}
