import { notFound } from "next/navigation";
import RegisterPage from "@/features/marketing/components/register/RegisterPage";
import {
	findMarketingGroup,
	findMarketingSection,
} from "@/features/marketing/constants/marketingGroups";
import { parseMarketingSlug } from "@/features/marketing/schemas/registerSection.schema";

type SectionPageProps = {
	params: Promise<{ group: string; section: string }>;
};

export default async function Page({ params }: SectionPageProps) {
	const { group, section } = await params;
	const groupSlug = parseMarketingSlug(group);
	const sectionSlug = parseMarketingSlug(section);
	const marketingGroup = groupSlug ? findMarketingGroup(groupSlug) : null;
	const marketingSection =
		marketingGroup && sectionSlug
			? findMarketingSection(marketingGroup, sectionSlug)
			: null;
	if (!marketingGroup || !marketingSection) notFound();

	return (
		<RegisterPage
			groupId={marketingGroup.id}
			sectionSlug={marketingSection.slug}
		/>
	);
}
