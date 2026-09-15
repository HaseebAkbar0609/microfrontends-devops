export const TIMEPLAN_CONSTANTS = {
	DEFAULT_ORDER_ID: "5000-001",
	KINDS: {
		MAIN: "Huvudtidsplan",
		PARTIAL: "Deltidsplan",
	} as const,
	DEFAULT_TYPE: "Standard",
	TYPES: [
		{ value: "Standard", labelKey: "orderTimeplanTypeStandard" },
		{ value: "Huvudtidsplan", labelKey: "orderTimeplanKindMain" },
		{ value: "Deltidsplan", labelKey: "orderTimeplanKindPartial" },
	] as const,
	AUTHORS: [
		{ id: "1", name: "Rachel Meyers", handle: "@rachel", avatar: "RM" },
		{ id: "2", name: "Stefan Lundberg", handle: "@stefan", avatar: "SL" },
		{ id: "3", name: "Kalle Svensson", handle: "@kalle", avatar: "KS" },
		{ id: "4", name: "Anna Andersson", handle: "@anna", avatar: "AA" },
	] as const,
	COLUMNS: [
		{ key: "date", labelKey: "orderTimeplanColDatum", sortable: true },
		{ key: "kind", labelKey: "orderTimeplanColTidsplan", sortable: true },
		{ key: "createdBy", labelKey: "orderTimeplanColCreatedBy", sortable: true },
	] as const,
};


