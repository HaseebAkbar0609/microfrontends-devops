import { ROLES, type Role } from "@/constants/roles";
import type { EmployeeStatus } from "@/features/personnel/types/personnelOverview.types";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type {
	PersonnelChangeKind,
	PersonnelFilters,
	PersonnelKategori,
	PersonnelMonthlySortField,
	StaffingSortField,
} from "../types/forecastPersonnel.types";

export const FORECAST_PERSONNEL_BASE_ROUTE = "/module/financial-management/forecast/personnel";

export const PERSONNEL_FORECAST_PAGE_SIZE = 10;

/** Everyone, over the year so far, until the reader chooses otherwise. */
export const INITIAL_PERSONNEL_FILTERS: PersonnelFilters = {
	period: "yearToDate",
	department: null,
	kategori: null,
	roles: [],
	status: null,
};

/** What the payroll may reach in a month before the dark card flags it, in SEK. */
export const PERSONNEL_SALARY_CAP_SEK = 2000000;

/** How far ahead Upcoming Changes looks, in days. */
export const PERSONNEL_CHANGE_WINDOW_DAYS = 30;

/** The twelve months the trend and the matrix run over. */
export const PERSONNEL_MONTH_KEYS: TranslationKeys[] = [
	localizationConstants.monthJan,
	localizationConstants.monthFeb,
	localizationConstants.monthMar,
	localizationConstants.monthApr,
	localizationConstants.monthMay,
	localizationConstants.monthJun,
	localizationConstants.monthJul,
	localizationConstants.monthAug,
	localizationConstants.monthSep,
	localizationConstants.monthOct,
	localizationConstants.monthNov,
	localizationConstants.monthDec,
];

/** Where a role's salary is counted; anything unlisted is overhead. */
export const PERSONNEL_ROLE_KATEGORI: Record<string, PersonnelKategori> = {
	Snickare: "entreprenad",
	Elektriker: "entreprenad",
	"VVS-montör": "entreprenad",
	Lärling: "entreprenad",
	Tekniker: "service",
	"Site Supervisor": "service",
	Projektledare: "overhead",
	"HR-koordinator": "overhead",
	Kalkyl: "overhead",
	Ekonomichef: "overhead",
	VD: "overhead",
};

export const PERSONNEL_KATEGORI_LABELS: Record<PersonnelKategori, TranslationKeys> = {
	service: localizationConstants.forecastPersonnelKategoriService,
	entreprenad: localizationConstants.forecastPersonnelKategoriEntreprenad,
	overhead: localizationConstants.forecastPersonnelKategoriOverhead,
};

/** The employee statuses, typed as keys so the shared filter can read them. */
export const PERSONNEL_STATUS_LABELS: Record<EmployeeStatus, TranslationKeys> = {
	active: localizationConstants.statusActive,
	probation: localizationConstants.statusProbation,
	sick: localizationConstants.statusSick,
	leave: localizationConstants.statusLeave,
	not_started: localizationConstants.statusNotStarted,
};

/** The ring's two arcs: who leads, and everyone else. */
export const PERSONNEL_LEVEL_META: Record<Role, { labelKey: TranslationKeys; color: string }> = {
	[ROLES.MANAGER]: { labelKey: localizationConstants.forecastPersonnelManagers, color: "#93c5fd" },
	[ROLES.WORKER]: { labelKey: localizationConstants.forecastPersonnelStaff, color: "#2563eb" },
};

/** Staff first, as the ring's larger arc. */
export const PERSONNEL_LEVEL_ORDER: Role[] = [ROLES.WORKER, ROLES.MANAGER];

export const PERSONNEL_CHANGE_META: Record<
	PersonnelChangeKind,
	{ labelKey: TranslationKeys; variant: "success" | "danger"; iconClass: string }
> = {
	newHire: {
		labelKey: localizationConstants.forecastPersonnelChangeNewHire,
		variant: "success",
		iconClass: "bg-emerald-50 text-emerald-600",
	},
	contractEnding: {
		labelKey: localizationConstants.forecastPersonnelChangeEnding,
		variant: "danger",
		iconClass: "bg-red-50 text-red-600",
	},
};

/** The salary line's colour, beside the other Prognos charts' own. */
export const PERSONNEL_TREND_COLOR = "#2563eb";

export const STAFFING_COLUMNS: { key: StaffingSortField; labelKey: TranslationKeys }[] = [
	{ key: "name", labelKey: localizationConstants.forecastPersonnelColName },
	{ key: "role", labelKey: localizationConstants.forecastPersonnelColRole },
	{ key: "monthlyCost", labelKey: localizationConstants.forecastPersonnelColMonthlyCost },
	{ key: "startDate", labelKey: localizationConstants.forecastPersonnelColStartDate },
	{ key: "endDate", labelKey: localizationConstants.forecastPersonnelColEndDate },
];

/** Roll and Kategori, then the twelve months. */
export const PERSONNEL_MONTHLY_LEAD_COLUMNS: { key: PersonnelMonthlySortField; labelKey: TranslationKeys }[] = [
	{ key: "role", labelKey: localizationConstants.forecastPersonnelColRole },
	{ key: "kategori", labelKey: localizationConstants.forecastPersonnelColKategori },
];
