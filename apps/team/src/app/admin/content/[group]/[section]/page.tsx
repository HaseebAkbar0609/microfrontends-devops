import { notFound } from "next/navigation";
import ContentSectionPage from "@/features/content/components/ContentSectionPage";
import {
	findContentGroup,
	findContentSection,
} from "@/features/content/constants/contentGroups";
import { parseContentSlug } from "@/features/content/schemas/contentSection.schema";

type SectionPageProps = {
	params: Promise<{ group: string; section: string }>;
};

export default async function Page({ params }: SectionPageProps) {
	const { group, section } = await params;
	const groupSlug = parseContentSlug(group);
	const sectionSlug = parseContentSlug(section);
	const contentGroup = groupSlug ? findContentGroup(groupSlug) : null;
	const contentSection =
		contentGroup && sectionSlug
			? findContentSection(contentGroup, sectionSlug)
			: null;
	if (!contentGroup || !contentSection) notFound();

	return (
		<ContentSectionPage
			groupId={contentGroup.id}
			sectionSlug={contentSection.slug}
		/>
	);
}
