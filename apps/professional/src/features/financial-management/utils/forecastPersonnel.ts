import { ROLES, type Role } from "@/constants/roles";
import type { EmployeeOverviewItem } from "@/features/personnel/types/personnelOverview.types";
import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import {
	PERSONNEL_CHANGE_WINDOW_DAYS,
	PERSONNEL_KATEGORI_LABELS,
	PERSONNEL_LEVEL_ORDER,
	PERSONNEL_MONTH_KEYS,
	PERSONNEL_ROLE_KATEGORI,
	PERSONNEL_SALARY_CAP_SEK,
} from "../constants/forecastPersonnel.constants";
import type { AnalysisPeriod } from "../types/forecastAnalysis.types";
import type {
	PersonnelChange,
	PersonnelDistributionSlice,
	PersonnelFilters,
	PersonnelKategori,
	PersonnelMonthlyRow,
	PersonnelMonthlySortField,
	PersonnelSummary,
	PersonnelTrendPoint,
	StaffingSortField,
} from "../types/forecastPersonnel.types";

/** Turns a translation key into the reader's text. */
export type PersonnelLabel = (key: TranslationKeys) => string;

const MONTHS_IN_YEAR = 12;
const DAY_MS = 24 * 60 * 60 * 1000;

/** How many months a period covers, counting back from the reference month. */
const PERIOD_MONTHS: Record<AnalysisPeriod, number> = { yearToDate: 0, quarter: 3, month: 1 };

function startOfMonth(year: number, month: number): number {
	return Date.UTC(year, month, 1);
}

function endOfMonth(year: number, month: number): number {
	return Date.UTC(year, month + 1, 0);
}

/** Whether an employee draws a salary in a given month. */
function employedInMonth(employee: EmployeeOverviewItem, year: number, month: number): boolean {
	const started = Date.parse(employee.startDate);
	if (Number.isNaN(started) || started > endOfMonth(year, month)) return false;
	if (!employee.endDate) return true;
	const ended = Date.parse(employee.endDate);
	return Number.isNaN(ended) || ended >= startOfMonth(year, month);
}

/** Whether an employee has started by the reference date. */
export function hasStarted(employee: EmployeeOverviewItem, reference: string): boolean {
	const started = Date.parse(employee.startDate);
	return !Number.isNaN(started) && started <= Date.parse(reference);
}

/** Where a role's salary is counted; a role nobody mapped falls to overhead. */
export function kategoriOf(role: string): PersonnelKategori {
	return PERSONNEL_ROLE_KATEGORI[role] ?? "overhead";
}

/** The months a period leaves, as indexes into the year. */
export function personnelMonthWindow(period: AnalysisPeriod, reference: string): { from: number; to: number } {
	const month = new Date(reference).getUTCMonth();
	const span = PERIOD_MONTHS[period];
	const to = month + 1;
	return { from: span === 0 ? 0 : Math.max(0, to - span), to };
}

/** What the payroll cost each month of the reference year, over the months the period leaves. */
export function personnelTrend(
	employees: EmployeeOverviewItem[],
	period: AnalysisPeriod,
	reference: string,
): PersonnelTrendPoint[] {
	const year = new Date(reference).getUTCFullYear();
	const { from, to } = personnelMonthWindow(period, reference);

	return PERSONNEL_MONTH_KEYS.slice(from, to).map((monthKey, index) => {
		const month = from + index;
		return {
			monthKey,
			cost: employees
				.filter((employee) => employedInMonth(employee, year, month))
				.reduce((sum, employee) => sum + employee.monthlyCost, 0),
		};
	});
}

/**
 * The four figures over the tab. The cost is what the people who have started
 * draw this month; the headcount counts everyone on record, those with a start
 * date still ahead of them included.
 */
export function personnelSummary(
	employees: EmployeeOverviewItem[],
	reference: string,
): PersonnelSummary {
	const year = new Date(reference).getUTCFullYear();
	const month = new Date(reference).getUTCMonth();

	const costIn = (index: number) =>
		employees
			.filter((employee) => employedInMonth(employee, year, index))
			.reduce((sum, employee) => sum + employee.monthlyCost, 0);

	const monthlyCost = costIn(month);
	const previous = month > 0 ? costIn(month - 1) : 0;
	const managerCount = employees.filter((employee) => employee.level === ROLES.MANAGER).length;

	return {
		monthlyCost,
		monthlyChangePercent: previous > 0 ? ((monthlyCost - previous) / previous) * 100 : 0,
		annualBudget: monthlyCost * MONTHS_IN_YEAR,
		headcount: employees.length,
		managerCount,
		staffCount: employees.length - managerCount,
		cap: PERSONNEL_SALARY_CAP_SEK,
		capUsedPercent: PERSONNEL_SALARY_CAP_SEK > 0 ? (monthlyCost / PERSONNEL_SALARY_CAP_SEK) * 100 : 0,
	};
}

/** How the headcount divides between those who lead and everyone else. */
export function personnelDistribution(employees: EmployeeOverviewItem[]): PersonnelDistributionSlice[] {
	return PERSONNEL_LEVEL_ORDER.map((level: Role) => ({
		level,
		count: employees.filter((employee) => employee.level === level).length,
	}));
}

/**
 * Who joins or leaves next: a start date still ahead of the reference, or an
 * end date inside the window after it. Nearest first, as the panel reads.
 */
export function personnelChanges(employees: EmployeeOverviewItem[], reference: string): PersonnelChange[] {
	const from = Date.parse(reference);
	const until = from + PERSONNEL_CHANGE_WINDOW_DAYS * DAY_MS;
	const changes: PersonnelChange[] = [];

	for (const employee of employees) {
		const starts = Date.parse(employee.startDate);
		if (!Number.isNaN(starts) && starts > from && starts <= until) {
			changes.push({
				id: `${employee.id}-hire`,
				name: employee.name,
				role: employee.role,
				date: employee.startDate,
				kind: "newHire",
			});
		}

		if (!employee.endDate) continue;
		const ends = Date.parse(employee.endDate);
		if (!Number.isNaN(ends) && ends >= from && ends <= until) {
			changes.push({
				id: `${employee.id}-end`,
				name: employee.name,
				role: employee.role,
				date: employee.endDate,
				kind: "contractEnding",
			});
		}
	}

	return changes.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

/** Månads-analys: one line per role, its months summed over the employees holding it. */
export function personnelMonthlyRows(
	employees: EmployeeOverviewItem[],
	period: AnalysisPeriod,
	reference: string,
): PersonnelMonthlyRow[] {
	const year = new Date(reference).getUTCFullYear();
	const { from, to } = personnelMonthWindow(period, reference);
	const roles = [...new Set(employees.map((employee) => employee.role))].sort((a, b) => a.localeCompare(b));

	return roles.map((role) => {
		const holders = employees.filter((employee) => employee.role === role);
		return {
			id: role,
			role,
			kategori: kategoriOf(role),
			months: PERSONNEL_MONTH_KEYS.slice(from, to).map((_, index) =>
				holders
					.filter((employee) => employedInMonth(employee, year, from + index))
					.reduce((sum, employee) => sum + employee.monthlyCost, 0),
			),
		};
	});
}

/** Löneprognos: every shown role summed, month by month. */
export function personnelMonthlyTotals(rows: PersonnelMonthlyRow[]): number[] {
	const span = rows[0]?.months.length ?? 0;
	return Array.from({ length: span }, (_, month) => rows.reduce((sum, row) => sum + (row.months[month] ?? 0), 0));
}

/** Whether an employee belongs in the selection. */
export function matchesEmployee(employee: EmployeeOverviewItem, filters: PersonnelFilters): boolean {
	if (filters.department && employee.department !== filters.department) return false;
	if (filters.status && employee.status !== filters.status) return false;
	if (filters.kategori && kategoriOf(employee.role) !== filters.kategori) return false;
	if (filters.roles.length > 0 && !filters.roles.includes(employee.role)) return false;
	return true;
}

function staffingValue(employee: EmployeeOverviewItem, field: StaffingSortField): string | number {
	switch (field) {
		case "monthlyCost":
			return employee.monthlyCost;
		case "endDate":
			/* A permanent employee sorts after every ending contract. */
			return employee.endDate ?? "9999-12-31";
		default:
			return employee[field];
	}
}

/** Employees in header order; amounts as numbers, the rest in the app's language. */
export function sortStaffing(
	employees: EmployeeOverviewItem[],
	field: StaffingSortField | null,
	dir: SortDir,
	locale: string,
): EmployeeOverviewItem[] {
	if (!field || !dir) return employees;

	const factor = dir === "asc" ? 1 : -1;
	return [...employees].sort((a, b) => {
		const left = staffingValue(a, field);
		const right = staffingValue(b, field);
		if (typeof left === "number" && typeof right === "number") return factor * (left - right);
		return factor * String(left).localeCompare(String(right), locale, { sensitivity: "base", numeric: true });
	});
}

/** `month-3` is the fourth column; anything else is one of the two lead columns. */
function monthIndexOf(field: PersonnelMonthlySortField): number | null {
	const match = /^month-(\d+)$/.exec(field);
	return match ? Number(match[1]) : null;
}

export function sortPersonnelMonthly(
	rows: PersonnelMonthlyRow[],
	field: PersonnelMonthlySortField | null,
	dir: SortDir,
	label: PersonnelLabel,
	locale: string,
): PersonnelMonthlyRow[] {
	if (!field || !dir) return rows;

	const factor = dir === "asc" ? 1 : -1;
	const month = monthIndexOf(field);

	return [...rows].sort((a, b) => {
		if (month !== null) return factor * ((a.months[month] ?? 0) - (b.months[month] ?? 0));
		const left = field === "kategori" ? label(PERSONNEL_KATEGORI_LABELS[a.kategori]) : a.role;
		const right = field === "kategori" ? label(PERSONNEL_KATEGORI_LABELS[b.kategori]) : b.role;
		return factor * left.localeCompare(right, locale, { sensitivity: "base", numeric: true });
	});
}

/** Every department on record, for the selection's own list. */
export function personnelDepartments(employees: EmployeeOverviewItem[]): string[] {
	return [...new Set(employees.map((employee) => employee.department))].sort((a, b) => a.localeCompare(b));
}

/** Every role on record, for the Roll tags. */
export function personnelRoles(employees: EmployeeOverviewItem[]): string[] {
	return [...new Set(employees.map((employee) => employee.role))].sort((a, b) => a.localeCompare(b));
}

