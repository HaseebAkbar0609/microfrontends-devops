export const CONTACT_ROLE_VALUES = {
	CLIENT: "Beställare",
	PROJECT_MANAGER: "Projektledare",
	SUPERVISOR: "Arbetsledare",
} as const;

export type ContactRoleValue =
	(typeof CONTACT_ROLE_VALUES)[keyof typeof CONTACT_ROLE_VALUES];

export const ORDER_CATEGORY_VALUES = {
	CLIENT: "Beställare",
	ONGOING: "Löpande",
	FIXED_PRICE: "Fast pris",
} as const;

export type OrderCategoryValue =
	(typeof ORDER_CATEGORY_VALUES)[keyof typeof ORDER_CATEGORY_VALUES];

export const ORDER_DATE_FORMAT = "yyyy-MM-dd";
export const DEFAULT_ORDER_NR_PLACEHOLDER = "ORD-0001";
