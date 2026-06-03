import { DiscountDetailFeature } from "@/features/discount/components/Index";

export const dynamic = "force-dynamic";

export default async function DiscountDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <DiscountDetailFeature partnerId={id} />;
}
