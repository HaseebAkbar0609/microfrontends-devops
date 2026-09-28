import { ArticleDetailPage } from "@/features/financial-management/components/articles/detail/ArticleDetailPage";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EconomyArticleDetailPage({ params }: PageProps) {
	const { id } = await params;
	return <ArticleDetailPage id={id} />;
}
