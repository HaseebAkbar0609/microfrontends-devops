import { PriceListDetailPage } from "@/features/financial-management";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EconomyPriceListDetailPage({ params }: PageProps) {
	const { id } = await params;
	return <PriceListDetailPage id={id} />;
}
