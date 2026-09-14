export const STAFF_CONSTANTS = {
	DEFAULT_ORDER_ID: "5000-001",
	DEFAULT_PAGE_SIZE: 10,
	PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100] as const,
	ALL_SUPPLIERS_VALUE: "all",
	STORAGE_KEYS: {
		PAGE_SIZE: "tfs_order_staff_page_size",
		FILTER_SUPPLIER: "tfs_order_staff_supplier",
	},
	WORKING_HOURS: "7:00 - 16:00",
	DEFAULT_TOOL: "App Timeflow Work",
	DEFAULT_DATE_START: "2025-12-10",
	DEFAULT_DATE_END: "2025-12-11",
	ROLES: [
		"Snickare",
		"Målare",
		"Elektriker",
		"Rörmokare",
		"Städare",
		"Projektledare",
		"Platschef",
		"Tekniker",
	] as const,
	STATUSES: {
		ACTIVE: "active",
		PENDING: "pending",
		COMPLETED: "completed",
	} as const,
};

export type StaffRoleConstant = (typeof STAFF_CONSTANTS.ROLES)[number];
