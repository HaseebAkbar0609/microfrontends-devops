import { notFound, redirect } from "next/navigation";
import {
	findMarketingGroup,
	getFirstSection,
} from "@/features/marketing/constants/marketingGroups";
import { getMarketingSectionHref } from "@/features/marketing/constants/marketingNav";
import { parseMarketingSlug } from "@/features/marketing/schemas/registerSection.schema";

type GroupPageProps = {
	params: Promise<{ group: string }>;
};

/** A group tab lands on its first register, so the secondary row is never empty. */
export default async function Page({ params }: GroupPageProps) {
	const { group } = await params;
	const slug = parseMarketingSlug(group);
	const marketingGroup = slug ? findMarketingGroup(slug) : null;
	if (!marketingGroup) notFound();

	redirect(
		getMarketingSectionHref(
			marketingGroup.id,
			getFirstSection(marketingGroup).slug,
		),
	);
}
