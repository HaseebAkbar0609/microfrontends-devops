import { CalculationQaPage } from "@/features/calculation/components/qa/CalculationQaPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <CalculationQaPage calcId={id} />;
}

