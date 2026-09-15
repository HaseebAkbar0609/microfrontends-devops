export const TIMEPLAN_CONSTANTS = {
	DEFAULT_ORDER_ID: "5000-001",
	KINDS: {
		MAIN: "Huvudtidsplan",
		PARTIAL: "Deltidsplan",
	} as const,
	COLUMNS: [
		{ key: "date", labelKey: "orderTimeplanColDatum", sortable: true },
		{ key: "kind", labelKey: "orderTimeplanColTidsplan", sortable: true },
		{ key: "createdBy", labelKey: "orderTimeplanColCreatedBy", sortable: true },
	] as const,
};

