import { SupplierArticleDetailPage } from "@/features/financial-management/components/articles/supplier-detail/SupplierArticleDetailPage";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EconomySupplierArticleDetailPage({ params }: PageProps) {
	const { id } = await params;
	return <SupplierArticleDetailPage id={id} />;
}
