import { ForfragnListView } from "@/features/calculation/components/ForfragnListView";
import { MOCK_FORFRAGNNINGAR } from "@/features/calculation/constants/forfragnMock";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <ForfragnListView calcId={id} rows={MOCK_FORFRAGNNINGAR} />;
}
