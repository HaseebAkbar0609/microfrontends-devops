import { MachinePurchaseDetailPage } from "@/features/machines/purchase/MachinePurchaseDetailPage";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <MachinePurchaseDetailPage id={id} />;
}
