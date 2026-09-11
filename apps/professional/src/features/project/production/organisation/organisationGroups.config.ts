import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { OrganisationGroupId } from "./types";

/**
 * The groups a project's organisation is drawn in, in the frame's order.
 *
 * Configuration rather than mock data — these are the parties a construction
 * project has, not stand-ins for records that do not exist yet. It lives apart
 * from the mock because three things read it: the seed, the order rows are
 * flattened and regrouped in, and the group a row is filtered to. Reading it
 * from the mock would make the filter depend on seeded data.
 *
 * The frame draws four. The ticket also names Underentreprenör, which has no
 * title key and no rows anywhere in the app; it joins here when it has both.
 */
export const ORGANISATION_GROUPS: {
	id: OrganisationGroupId;
	titleKey: TranslationKeys;
}[] = [
	{
		id: "bestallare",
		titleKey: localizationConstants.orgGroupBestallare,
	},
	{ id: "arkitekt", titleKey: localizationConstants.orgGroupArkitekt },
	{
		id: "byggentreprenor",
		titleKey: localizationConstants.orgGroupByggentreprenor,
	},
	{ id: "elektriker", titleKey: localizationConstants.orgGroupElektriker },
];
