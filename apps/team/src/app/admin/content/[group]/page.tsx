import { notFound } from "next/navigation";
import ContentGroupPage from "@/features/content/components/ContentGroupPage";
import { findContentGroup } from "@/features/content/constants/contentGroups";
import { parseContentSlug } from "@/features/content/schemas/contentSection.schema";

type GroupPageProps = {
	params: Promise<{ group: string }>;
};

export default async function Page({ params }: GroupPageProps) {
	const { group } = await params;
	const slug = parseContentSlug(group);
	const contentGroup = slug ? findContentGroup(slug) : null;
	if (!contentGroup) notFound();

	return <ContentGroupPage groupId={contentGroup.id} />;
}
