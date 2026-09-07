import { Building2, LayoutDashboard, type LucideIcon } from "lucide-react";
import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import type { ContentGroupId, ContentSection } from "../types";
import { KUND_SECTIONS } from "./kundSections";
import { WORKSPACE_SECTIONS } from "./workspaceSections";

export type ContentGroup = {
	id: ContentGroupId;
	titleKey: TranslationKeys;
	summaryKey: TranslationKeys;
	icon: LucideIcon;
	sections: ContentSection[];
};

export const CONTENT_GROUPS: ContentGroup[] = [
	{
		id: "kund",
		titleKey: localizationConstants.contentGroupKundTitle,
		summaryKey: localizationConstants.contentGroupKundSummary,
		icon: LayoutDashboard,
		sections: KUND_SECTIONS,
	},
	{
		id: "workspace",
		titleKey: localizationConstants.contentGroupWorkspaceTitle,
		summaryKey: localizationConstants.contentGroupWorkspaceSummary,
		icon: Building2,
		sections: WORKSPACE_SECTIONS,
	},
];

const GROUP_BY_ID = new Map(CONTENT_GROUPS.map((group) => [group.id, group]));

export function findContentGroup(id: string): ContentGroup | null {
	return GROUP_BY_ID.get(id as ContentGroupId) ?? null;
}

export function findContentSection(
	group: ContentGroup,
	slug: string,
): ContentSection | null {
	return group.sections.find((section) => section.slug === slug) ?? null;
}

/** Rows are stored per section; kund and workspace both have a `fragor-svar`. */
export function getSectionKey(groupId: ContentGroupId, slug: string): string {
	return `${groupId}:${slug}`;
}
