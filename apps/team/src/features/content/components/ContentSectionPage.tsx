"use client";

import localizationConstants from "@/utils/translation/constants";
import { getContentGroupHref } from "../constants/contentNav";
import { CONTENT_BASE_HREF } from "../constants/content.constants";
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
 * One content section. The sub-sidebar selects it; the header names it.
 */
export function ContentSectionPage({
	groupId,
	sectionSlug,
}: ContentSectionPageProps) {
	const group = findContentGroup(groupId);
	const section = group ? findContentSection(group, sectionSlug) : null;
	if (!group || !section) return null;

	const sectionKey = getSectionKey(group.id, section.slug);

	return (
		<ContentModuleShell
			titleKey={section.titleKey}
			parents={[
				{ label: localizationConstants.settings, href: CONTENT_BASE_HREF },
				{ label: group.titleKey, href: getContentGroupHref(group.id) },
			]}
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
