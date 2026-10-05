import {
	BookUser,
	ChartLine,
	FolderOpen,
	PartyPopper,
	Target,
	Users,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type {
	MarketingGroup,
	MarketingGroupId,
	MarketingSection,
} from "../types";
import { CONTACT_SECTIONS } from "./sections/contactSections";
import { CONTENT_SECTIONS } from "./sections/contentSections";
import { EVENT_SECTIONS } from "./sections/eventSections";
import { INSIGHT_SECTIONS } from "./sections/insightSections";
import { ORGANISATION_SECTIONS } from "./sections/organisationSections";
import { STRATEGY_SECTIONS } from "./sections/strategySections";

/**
 * The 19 registers, grouped the way the prototype's sidebar grouped them. The
 * group slugs are authored rather than derived: the prototype's labels are
 * prose ("Översikt & Strategi"), which does not make a URL segment.
 */
export const MARKETING_GROUPS: MarketingGroup[] = [
	{
		id: "strategi",
		titleKey: localizationConstants.marketingGroupStrategi,
		icon: Target,
		sections: STRATEGY_SECTIONS,
	},
	{
		id: "innehall",
		titleKey: localizationConstants.marketingGroupInnehall,
		icon: FolderOpen,
		sections: CONTENT_SECTIONS,
	},
	{
		id: "insikter",
		titleKey: localizationConstants.marketingGroupInsikter,
		icon: ChartLine,
		sections: INSIGHT_SECTIONS,
	},
	{
		id: "organisation",
		titleKey: localizationConstants.marketingGroupOrganisation,
		icon: Users,
		sections: ORGANISATION_SECTIONS,
	},
	{
		id: "kontakter",
		titleKey: localizationConstants.marketingGroupKontakter,
		icon: BookUser,
		sections: CONTACT_SECTIONS,
	},
	{
		id: "event",
		titleKey: localizationConstants.marketingGroupEvent,
		icon: PartyPopper,
		sections: EVENT_SECTIONS,
	},
];

const GROUP_BY_ID = new Map(MARKETING_GROUPS.map((group) => [group.id, group]));

export function findMarketingGroup(id: string): MarketingGroup | null {
	return GROUP_BY_ID.get(id as MarketingGroupId) ?? null;
}

export function findMarketingSection(
	group: MarketingGroup,
	slug: string,
): MarketingSection | null {
	return group.sections.find((section) => section.slug === slug) ?? null;
}

/** Rows are stored per register; `fragor-svar`-style slug reuse stays safe. */
export function getSectionKey(groupId: MarketingGroupId, slug: string): string {
	return `${groupId}:${slug}`;
}

/** The register a group entry lands on. */
export function getFirstSection(group: MarketingGroup): MarketingSection {
	const [first] = group.sections;
	if (!first) throw new Error(`Marketing group ${group.id} has no sections`);
	return first;
}

/** Locates a register by slug alone, for the two contact registers the newsletter reads. */
export function findSectionKeyBySlug(slug: string): string | null {
	for (const group of MARKETING_GROUPS) {
		if (group.sections.some((section) => section.slug === slug)) {
			return getSectionKey(group.id, slug);
		}
	}
	return null;
}
