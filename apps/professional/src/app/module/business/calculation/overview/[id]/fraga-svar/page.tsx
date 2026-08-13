import { FragaSvarPage } from "@/features/calculation/components/FragaSvarPage";
import { MOCK_QA_CARDS } from "@/features/calculation/constants/fragaSvarMock";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <FragaSvarPage calcId={id} cards={MOCK_QA_CARDS} />;
}
