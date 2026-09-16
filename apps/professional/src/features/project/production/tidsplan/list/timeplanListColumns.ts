import localizationConstants from "@/utils/translation/constants";

export type TimeplanColumnKey = "createdDate" | "kind" | "createdById";

/**
 * The list's three columns, in the frame's order.
 *
 * Datum and Tidsplan carry sort arrows in the frame; Skapad av does not. Tidsplan
 * sorts on the stored kind id ("main" before "sub"), not its translated label, so
 * the order does not flip with the language.
 */
export const TIMEPLAN_LIST_COLUMNS: {
	key: TimeplanColumnKey;
	labelKey: string;
	sortable: boolean;
}[] = [
	{
		key: "createdDate",
		labelKey: localizationConstants.dateHeaderLabel,
		sortable: true,
	},
	{
		key: "kind",
		labelKey: localizationConstants.projectSectionTidsplan,
		sortable: true,
	},
	{
		key: "createdById",
		labelKey: localizationConstants.lblSkapadAv,
		sortable: false,
	},
];
