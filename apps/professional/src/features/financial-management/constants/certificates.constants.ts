import localizationConstants from "@/utils/translation/constants";
import type { BreadcrumbItem } from "@/types/common";
import { economyBreadcrumbs } from "./economyNav.config";

export const STORAGE_KEY_CERTIFICATES = "tfs_professional_certificates_data_v1";
export const CERTIFICATES_BASE_ROUTE = "/module/financial-management/economy/certificates";
export const CREATE_CERTIFICATE_ROUTE = `${CERTIFICATES_BASE_ROUTE}/create`;

export const CERTIFICATES_DEFAULT_PAGE_SIZE = 10;
export const CERTIFICATES_PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const CERTIFICATE_CATEGORY_OPTIONS = [
	"Projekt",
	"Overhead",
	"Investering",
	"KMA & Säkerhet",
	"Kvalitet & Miljö",
	"Övrigt",
] as const;

export const OBJECT_TYPE_OPTIONS = [
	"Order",
	"Projekt",
	"Kostnadsställe",
	"Avdelning",
	"Fordon / Maskin",
] as const;

export const RESPONSIBLE_PERSON_OPTIONS = [
	"Kalle Andersson",
	"Erik Holm",
	"Anna Svensson",
	"Kalle Larsson",
	"Sara Nilsson",
	"Johan Lind",
] as const;

export const RESPONSIBLE_ROLE_OPTIONS = [
	"Projektledare",
	"Arbetsledare",
	"Platschef",
	"Inköpare",
	"Ekonom",
	"Ledande montör",
] as const;

export const MASTER_APPROVER_OPTIONS = [
	"Conny Larsson",
	"Helena Lindqvist",
	"Anders Berggren",
	"Stina Sjöberg",
] as const;

export const MASTER_ROLE_OPTIONS = [
	"Ekonomichef",
	"VD",
	"CFO",
	"Affärsområdeschef",
] as const;

export const certificatesBreadcrumbs: BreadcrumbItem[] = economyBreadcrumbs(
	localizationConstants.certificatesBreadcrumb,
);
