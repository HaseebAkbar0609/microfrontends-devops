import type { SystemCategory, SystemStatus } from "../types/dataItSystem.types";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";

export const DATA_IT_SYSTEM_STORAGE_KEY = "tfs_data_it_system_items";
export const DATA_IT_SYSTEM_BASE_URL = "/module/business-support/data-it/system";

export const DEFAULT_SYSTEM_PAGE_SIZE = 10;
export const SYSTEM_PAGE_SIZE_OPTIONS = [10, 25, 50];

export const SYSTEM_STATUS_OPTIONS: SystemStatus[] = [
	"ACTIVE",
	"PAUSED",
	"INACTIVE",
];

export const SYSTEM_CATEGORY_OPTIONS: SystemCategory[] = [
	"CALCULATION",
	"OVERHEAD",
	"ECONOMY",
	"CONTINUOUS",
	"PROJECT",
	"OPERATIONS",
	"OTHER",
];

export const SYSTEM_STATUS_BADGE_CONFIG: Record<
	SystemStatus,
	{ labelKey: TranslationKeys; className: string }
> = {
	ACTIVE: {
		labelKey: localizationConstants.dataItSystemStatusActive,
		className: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
	PAUSED: {
		labelKey: localizationConstants.dataItSystemStatusPaused,
		className: "bg-sky-50 text-sky-700 border-sky-200",
	},
	INACTIVE: {
		labelKey: localizationConstants.dataItSystemStatusInactive,
		className: "bg-slate-100 text-slate-600 border-slate-200",
	},
};

export const SYSTEM_CATEGORY_TRANSLATION_MAP: Record<SystemCategory, TranslationKeys> = {
	CALCULATION: localizationConstants.dataItSystemCategoryCalculation,
	OVERHEAD: localizationConstants.dataItSystemCategoryOverhead,
	ECONOMY: localizationConstants.dataItSystemCategoryEconomy,
	CONTINUOUS: localizationConstants.dataItSystemCategoryContinuous,
	PROJECT: localizationConstants.dataItSystemCategoryProject,
	OPERATIONS: localizationConstants.dataItSystemCategoryOperations,
	OTHER: localizationConstants.dataItSystemCategoryOther,
};

export const SYSTEM_DETAIL_TAB_BASIC = "basic-info" as const;
export const SYSTEM_DETAIL_TAB_ASSIGNMENT = "assignment" as const;

export type SystemDetailTabId =
	| typeof SYSTEM_DETAIL_TAB_BASIC
	| typeof SYSTEM_DETAIL_TAB_ASSIGNMENT;
