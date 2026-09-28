import { ROLES, type Role } from "@/constants/roles";
import localizationConstants from "@/utils/translation/constants";
import { EmployeeStatus, EmploymentType } from "../types/personnelOverview.types";

/** The roles that lead. Everyone else is counted as staff. */
export const MANAGER_ROLES = ["VD", "Ekonomichef", "Projektledare", "Site Supervisor", "Arbetschef"];

/** Where a role puts its holder, so the wizard and Prognos agree on the split. */
export function employeeLevelOf(role: string): Role {
	return MANAGER_ROLES.includes(role.trim()) ? ROLES.MANAGER : ROLES.WORKER;
}

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50];
export const PERSONNEL_STORAGE_KEY = "tfs_personnel_records_v2";

export const STATUS_STYLE_MAP: Record<EmployeeStatus, { bg: string; text: string }> = {
	active: {
		bg: "bg-emerald-600",
		text: "text-white",
	},
	probation: {
		bg: "bg-sky-800",
		text: "text-white",
	},
	sick: {
		bg: "bg-amber-500",
		text: "text-white",
	},
	leave: {
		bg: "bg-amber-400",
		text: "text-slate-900",
	},
	not_started: {
		bg: "bg-slate-400",
		text: "text-white",
	},
};

export const STATUS_LABEL_KEY_MAP: Record<EmployeeStatus, string> = {
	active: localizationConstants.statusActive,
	probation: localizationConstants.statusProbation,
	sick: localizationConstants.statusSick,
	leave: localizationConstants.statusLeave,
	not_started: localizationConstants.statusNotStarted,
};

export const TYPE_LABEL_KEY_MAP: Record<EmploymentType, string> = {
	full_time: localizationConstants.typeFullTime,
	part_time: localizationConstants.typePartTime,
};

export const FILTER_LOCATION_OPTIONS = [
	"Stockholm",
	"Göteborg",
	"Malmö",
	"Uppsala",
	"Västerås",
];

export const FILTER_ROLE_OPTIONS = [
	"Snickare",
	"Projektledare",
	"Tekniker",
	"HR-koordinator",
	"Site Supervisor",
	"Lärling",
	"Elektriker",
	"VVS-montör",
	"Kalkyl",
	"Ekonomichef",
	"VD",
];
