"use client";

import { useTranslate } from "@/utils/translation/translate";
import { getContentGroupHref } from "../constants/contentNav";
import {
	findContentGroup,
	findContentSection,
	getSectionKey,
} from "../constants/contentGroups";
import type { ContentGroupId } from "../types";
import { ContentModuleShell } from "./ContentModuleShell";
import { SectionWorkbench } from "./SectionWorkbench";
import { SupportWorkbench } from "./support/SupportWorkbench";

type ContentSectionPageProps = {
	groupId: ContentGroupId;
	sectionSlug: string;
};

/**
 * One content section. The section name sits in the back-navigation row rather
 * than the H1, so the module title is the same on every page of the console.
 */
export function ContentSectionPage({
	groupId,
	sectionSlug,
}: ContentSectionPageProps) {
	const t = useTranslate();
	const group = findContentGroup(groupId);
	const section = group ? findContentSection(group, sectionSlug) : null;
	if (!group || !section) return null;

	const sectionKey = getSectionKey(group.id, section.slug);

	return (
		<ContentModuleShell
			record={{
				title: t(section.titleKey),
				description: t(section.summaryKey),
				backHref: getContentGroupHref(group.id),
			}}
		>
			{section.variant === "support" ? (
				<SupportWorkbench groupId={group.id} section={section} />
			) : (
				// Keyed so switching sections rebuilds the form against the new field
				// config; the rows themselves live in the provider and are untouched.
				<SectionWorkbench
					key={sectionKey}
					section={section}
					sectionKey={sectionKey}
				/>
			)}
		</ContentModuleShell>
	);
}

export default ContentSectionPage;
