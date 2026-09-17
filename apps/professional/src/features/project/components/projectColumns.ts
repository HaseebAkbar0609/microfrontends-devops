import localizationConstants from "@/utils/translation/constants";
import type { ProjectSortField } from "../hooks/useProjectOverviewFilters";

/**
 * The ten columns a project row can show, in the frames' order.
 *
 * `key` is both the field read from the row and the sort key the hook
 * receives, so a column cannot drift from what sorts it. Shared by the active
 * list, Arkiv and the column picker.
 */
export const PROJECT_COLUMNS: { key: ProjectSortField; labelKey: string }[] = [
	{ key: "projectNr", labelKey: localizationConstants.projectListColNr },
	{ key: "name", labelKey: localizationConstants.projectListColName },
	{ key: "category", labelKey: localizationConstants.projectListColCategory },
	{
		key: "department",
		labelKey: localizationConstants.projectListColDepartment,
	},
	{
		key: "contractSum",
		labelKey: localizationConstants.projectListColContractSum,
	},
	{
		key: "projectManager",
		labelKey: localizationConstants.projectListColManager,
	},
	{ key: "customer", labelKey: localizationConstants.projectListColCustomer },
	{ key: "offerNr", labelKey: localizationConstants.projectListColOfferNr },
	{ key: "startDate", labelKey: localizationConstants.projectListColStart },
	{ key: "endDate", labelKey: localizationConstants.projectListColEnd },
];
