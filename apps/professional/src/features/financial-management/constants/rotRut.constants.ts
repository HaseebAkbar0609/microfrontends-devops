import localizationConstants from "@/utils/translation/constants";
import { BreadcrumbItem } from "@/types/common";

export const ROT_RUT_ANNUAL_LIMIT = 75000;
export const ROT_ANNUAL_SUB_LIMIT = 50000;
export const ROT_RUT_DEDUCTION_RATE = 0.30;

export const STORAGE_KEY_ROT_RUT = "tfs_professional_rot_rut_data_v3";
export const ROT_RUT_ROUTE = "/module/financial-management/rot-rut";

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

import { economyBreadcrumbs } from "./economyNav.config";

export const rotRutBreadcrumbs: BreadcrumbItem[] = economyBreadcrumbs(
	localizationConstants.rotRutBreadcrumb,
);

