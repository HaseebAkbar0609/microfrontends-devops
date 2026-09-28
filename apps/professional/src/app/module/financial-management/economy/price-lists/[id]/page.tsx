import { PriceListDetailPage } from "@/features/financial-management/components/price-lists/detail/PriceListDetailPage";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EconomyPriceListDetailPage({ params }: PageProps) {
	const { id } = await params;
	return <PriceListDetailPage id={id} />;
}
