import { ForfragnDetailView } from "@/features/calculation/components/ForfragnDetailView";
import { MOCK_INBJUDNA } from "@/features/calculation/constants/forfragnMock";

interface PageProps {
	params: Promise<{ id: string; requestId: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id, requestId } = await params;
	return (
		<ForfragnDetailView
			calcId={id}
			requestId={requestId}
			inbjudnaRows={MOCK_INBJUDNA}
		/>
	);
}
