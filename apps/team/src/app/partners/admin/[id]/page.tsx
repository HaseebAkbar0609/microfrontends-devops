import { PartnerDetailPage } from "@/features/partners/admin/components/PartnerDetailPage";

export const dynamic = "force-dynamic";

interface PageProps {
	readonly params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <PartnerDetailPage id={id} />;
}
