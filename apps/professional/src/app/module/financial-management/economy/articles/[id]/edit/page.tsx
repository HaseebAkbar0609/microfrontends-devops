import { CreateArticleWizard } from "@/features/financial-management/components/articles/create/CreateArticleWizard";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EconomyEditArticlePage({ params }: PageProps) {
	const { id } = await params;
	return <CreateArticleWizard articleId={id} />;
}
