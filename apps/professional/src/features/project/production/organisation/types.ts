import type { TranslationKeys } from "@/utils/translation/constants";

/** Which collapsible group a row belongs to. */
export type OrganisationGroupId =
	| "bestallare"
	| "arkitekt"
	| "byggentreprenor"
	| "elektriker";

/**
 * One party on the project — a company, its role, and the person to call.
 *
 * The eight visible fields keep the spelling the order module's `MemberItem`
 * uses (`features/orders/organisation/api/orderOrganisation.api.ts`), so the two
 * screens can be consolidated later without a rename. The type is declared here
 * rather than imported: that module's file also pulls in `axiosInstance`,
 * `API_PATH` and `getOrderInformation`, none of which belong in a mock-backed
 * screen.
 *
 * `group` is ours. The order module carries the grouping in a nested
 * `GroupSection[]` instead, which is why its delete has to rebuild every group
 * and its filter empties groups rather than hiding them.
 */
export interface OrganisationMember {
	id: string;
	foretag: string;
	roll: string;
	kategori: string;
	address: string;
	postNr: string;
	ort: string;
	kontakt: string;
	mail: string;
	group: OrganisationGroupId;
}

/** One rendered group: its title and the rows on the current page. */
export interface OrganisationGroupRows {
	id: OrganisationGroupId;
	titleKey: TranslationKeys;
	rows: OrganisationMember[];
}
