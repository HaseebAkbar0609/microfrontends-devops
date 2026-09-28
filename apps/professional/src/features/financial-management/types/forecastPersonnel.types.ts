import type { Role } from "@/constants/roles";
import type { EmployeeStatus } from "@/features/personnel/types/personnelOverview.types";
import type { TranslationKeys } from "@/utils/translation/constants";
import type { AnalysisPeriod } from "./forecastAnalysis.types";

/** What a role's salary is counted as; the Månads-analys table groups on it. */
export type PersonnelKategori = "service" | "entreprenad" | "overhead";

/**
 * Both tabs' fields in one selection, so Period, Roll and Status stay put when
 * the reader moves between them. Each tab shows the fields it cares about.
 */
export interface PersonnelFilters {
	period: AnalysisPeriod;
	/** A department as the employee record spells it, not a translated label. */
	department: string | null;
	kategori: PersonnelKategori | null;
	/** Roles as the employee record spells them; the frame's Roll tags. */
	roles: string[];
	status: EmployeeStatus | null;
}

/** The four cards over the Översikt tab. */
export interface PersonnelSummary {
	/** What the employees who have started cost a month, in SEK. */
	monthlyCost: number;
	/** That against the month before, as a percentage. */
	monthlyChangePercent: number;
	/** Twelve months of the current cost, in SEK. */
	annualBudget: number;
	headcount: number;
	managerCount: number;
	staffCount: number;
	/** What the payroll may reach in a month before it is flagged, in SEK. */
	cap: number;
	/** The monthly cost against that cap, as a percentage. */
	capUsedPercent: number;
}

export interface PersonnelTrendPoint {
	monthKey: TranslationKeys;
	/** What the people on the payroll that month cost together, in SEK. */
	cost: number;
}

/** One arc of the Personnel Distribution ring. */
export interface PersonnelDistributionSlice {
	level: Role;
	count: number;
}

export type PersonnelChangeKind = "newHire" | "contractEnding";

/** Someone joining or leaving inside the window the panel covers. */
export interface PersonnelChange {
	id: string;
	name: string;
	role: string;
	/** ISO date the change falls on. */
	date: string;
	kind: PersonnelChangeKind;
}

/** One line of Månads-analys: a role's salary cost month by month. */
export interface PersonnelMonthlyRow {
	id: string;
	role: string;
	kategori: PersonnelKategori;
	months: number[];
}

export type PersonnelMonthlySortField = "role" | "kategori" | `month-${number}`;

export type StaffingSortField = "name" | "role" | "monthlyCost" | "startDate" | "endDate";
