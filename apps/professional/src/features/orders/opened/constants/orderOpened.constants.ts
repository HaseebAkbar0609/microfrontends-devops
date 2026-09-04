import localizationConstants from "@/utils/translation/constants";

export const CONTACT_ROLES = {
  CLIENT: "client",
  PROJECT_MANAGER: "project_manager",
  SUPERVISOR: "supervisor",
} as const;

export type ContactRole = (typeof CONTACT_ROLES)[keyof typeof CONTACT_ROLES];

export const ORDER_CATEGORIES = {
  CLIENT: "client",
  ONGOING: "ongoing",
  FIXED_PRICE: "fixed_price",
} as const;

export type OrderCategory =
  (typeof ORDER_CATEGORIES)[keyof typeof ORDER_CATEGORIES];

// Backward-compatibility aliases
export const CONTACT_ROLE_VALUES = CONTACT_ROLES;
export type ContactRoleValue = ContactRole;
export const ORDER_CATEGORY_VALUES = ORDER_CATEGORIES;
export type OrderCategoryValue = OrderCategory;

export const ORDER_DATE_FORMAT = "yyyy-MM-dd";
export const DEFAULT_ORDER_NR_PLACEHOLDER = "ORD-0001";

export const CONTACT_ROLE_TRANSLATION_KEYS: Record<ContactRole, string> = {
  [CONTACT_ROLES.CLIENT]: localizationConstants.roleBestallare,
  [CONTACT_ROLES.PROJECT_MANAGER]: localizationConstants.roleProjektledare,
  [CONTACT_ROLES.SUPERVISOR]: localizationConstants.roleSupervisor,
};

export const ORDER_CATEGORY_TRANSLATION_KEYS: Record<OrderCategory, string> = {
  [ORDER_CATEGORIES.CLIENT]: localizationConstants.roleBestallare,
  [ORDER_CATEGORIES.ONGOING]: localizationConstants.categoryLopande,
  [ORDER_CATEGORIES.FIXED_PRICE]: localizationConstants.categoryFastPris,
};

/**
 * Returns the localization constant key for a contact role, supporting both new enum keys and legacy values
 */
export function getContactRoleTranslationKey(role?: string): string | null {
  if (!role) return null;
  if (role === CONTACT_ROLES.CLIENT || role === "Beställare")
    return localizationConstants.roleBestallare;
  if (role === CONTACT_ROLES.PROJECT_MANAGER || role === "Projektledare")
    return localizationConstants.roleProjektledare;
  if (role === CONTACT_ROLES.SUPERVISOR || role === "Arbetsledare")
    return localizationConstants.roleSupervisor;
  return null;
}

/**
 * Returns the localization constant key for an order category, supporting both new enum keys and legacy values
 */
export function getOrderCategoryTranslationKey(
  category?: string,
): string | null {
  if (!category) return null;
  if (category === ORDER_CATEGORIES.CLIENT || category === "Beställare")
    return localizationConstants.roleBestallare;
  if (category === ORDER_CATEGORIES.ONGOING || category === "Löpande")
    return localizationConstants.categoryLopande;
  if (category === ORDER_CATEGORIES.FIXED_PRICE || category === "Fast pris")
    return localizationConstants.categoryFastPris;
  return null;
}
