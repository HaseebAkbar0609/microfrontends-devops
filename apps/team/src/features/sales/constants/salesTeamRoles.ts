import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import type { SalesTeamRole } from "../types";

export type SalesTeamRoleOption = {
	id: SalesTeamRole;
	labelKey: TranslationKeys;
};

/** The roles a member of the sales organisation can hold. */
export const SALES_TEAM_ROLES: SalesTeamRoleOption[] = [
	{ id: "seller", labelKey: localizationConstants.salesTeamRoleSeller },
	{ id: "meeting-booker", labelKey: localizationConstants.salesTeamRoleBooker },
	{
		id: "account-manager",
		labelKey: localizationConstants.salesTeamRoleAccountManager,
	},
];
