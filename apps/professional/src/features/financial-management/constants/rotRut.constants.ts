import localizationConstants from "@/utils/translation/constants";
import { BreadcrumbItem } from "@/types/common";

export const ROT_RUT_ANNUAL_LIMIT = 75000;
export const ROT_ANNUAL_SUB_LIMIT = 50000;
export const ROT_RUT_DEDUCTION_RATE = 0.30;

export const STORAGE_KEY_ROT_RUT = "tfs_professional_rot_rut_data";
export const ROT_RUT_ROUTE = "/module/financial-management/rot-rut";

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const rotRutBreadcrumbs: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/" },
	{ label: localizationConstants.module, href: "/module" },
	{ label: localizationConstants.financialManagement, href: "/module/financial-management" },
	{ label: localizationConstants.rotRutBreadcrumb, href: ROT_RUT_ROUTE },
];
