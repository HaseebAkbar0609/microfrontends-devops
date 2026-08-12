import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { PROJECT_GOTO_ITEMS } from "@/features/project/data/projectNav.config";

interface ProjectDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
	const { id } = await params;
	const project = PROJECT_GOTO_ITEMS.find((item) => item.id === id);
	return <ComingSoonPage title={project?.title ?? decodeURIComponent(id)} />;
}
