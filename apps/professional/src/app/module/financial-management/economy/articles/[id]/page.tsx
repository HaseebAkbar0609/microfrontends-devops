import { ArticleDetailPage } from "@/features/financial-management";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EconomyArticleDetailPage({ params }: PageProps) {
	const { id } = await params;
	return <ArticleDetailPage id={id} />;
}
