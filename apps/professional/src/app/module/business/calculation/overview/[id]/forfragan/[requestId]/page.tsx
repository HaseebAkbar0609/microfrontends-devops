import { ForfragnDetailView } from "@/features/calculation/components/ForfragnDetailView";

interface PageProps {
	params: Promise<{ id: string; requestId: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id, requestId } = await params;
	return (
		<ForfragnDetailView
			calcId={id}
			requestId={requestId}
		/>
	);
}
