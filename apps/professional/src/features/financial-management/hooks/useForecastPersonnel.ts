"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { personnelRepository } from "@/features/personnel/utils/personnelRepository";
import type { EmployeeOverviewItem } from "@/features/personnel/types/personnelOverview.types";
import { MOCK_REFERENCE_DATE } from "@/features/widgetdashboard/utils/mockDates";
import { useTableSort } from "@/hooks/useTableSort";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	INITIAL_PERSONNEL_FILTERS,
	PERSONNEL_FORECAST_PAGE_SIZE,
	PERSONNEL_MONTH_KEYS,
} from "../constants/forecastPersonnel.constants";
import type {
	PersonnelFilters,
	PersonnelMonthlySortField,
	StaffingSortField,
} from "../types/forecastPersonnel.types";
import {
	matchesEmployee,
	personnelChanges,
	personnelDepartments,
	personnelDistribution,
	personnelMonthlyRows,
	personnelMonthlyTotals,
	personnelRoles,
	personnelMonthWindow,
	personnelSummary,
	personnelTrend,
	sortPersonnelMonthly,
	sortStaffing,
	type PersonnelLabel,
} from "../utils/forecastPersonnel";

/**
 * Prognos › Personal reads the employees the Personal module keeps, so the two
 * screens forecast and manage the same people. The selection is edited as a
 * draft and only Välj hands it to the figures, as Analys does; both tabs share
 * it, so Period, Roll and Status stay put when the reader moves between them.
 *
 * Every figure is measured against the app's mock reference date rather than
 * today, so what the panels show does not drift as the calendar moves.
 */
export function useForecastPersonnel() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const label: PersonnelLabel = t;
	const reference = MOCK_REFERENCE_DATE;

	const [employees, setEmployees] = useState<EmployeeOverviewItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		/* The Personal module may add or change someone while this tab is open. */
		const unsubscribe = personnelRepository.subscribe((rows) => {
			if (!cancelled) setEmployees(rows);
		});

		personnelRepository.fetchEmployees().then((rows) => {
			if (cancelled) return;
			setEmployees(rows);
			setIsLoading(false);
		});

		return () => {
			cancelled = true;
			unsubscribe();
		};
	}, []);

	const [draft, setDraft] = useState<PersonnelFilters>(INITIAL_PERSONNEL_FILTERS);
	const [applied, setApplied] = useState<PersonnelFilters>(INITIAL_PERSONNEL_FILTERS);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(PERSONNEL_FORECAST_PAGE_SIZE);
	const [staffingPage, setStaffingPage] = useState(1);

	const staffingSort = useTableSort<StaffingSortField>();
	const monthlySort = useTableSort<PersonnelMonthlySortField>();

	const shown = useMemo(
		() => employees.filter((employee) => matchesEmployee(employee, applied)),
		[employees, applied],
	);

	const summary = useMemo(() => personnelSummary(shown, reference), [shown, reference]);
	const trend = useMemo(() => personnelTrend(shown, applied.period, reference), [shown, applied.period, reference]);
	const distribution = useMemo(() => personnelDistribution(shown), [shown]);
	const changes = useMemo(() => personnelChanges(shown, reference), [shown, reference]);

	const staffing = useMemo(
		() => sortStaffing(shown, staffingSort.sortField, staffingSort.sortDir, i18n.language),
		[shown, staffingSort.sortField, staffingSort.sortDir, i18n.language],
	);

	const monthlyRows = useMemo(
		() => personnelMonthlyRows(shown, applied.period, reference),
		[shown, applied.period, reference],
	);

	const monthKeys = useMemo(() => {
		const { from, to } = personnelMonthWindow(applied.period, reference);
		return PERSONNEL_MONTH_KEYS.slice(from, to);
	}, [applied.period, reference]);

	const monthlyShown = useMemo(
		() => sortPersonnelMonthly(monthlyRows, monthlySort.sortField, monthlySort.sortDir, label, i18n.language),
		[monthlyRows, monthlySort.sortField, monthlySort.sortDir, label, i18n.language],
	);

	/* Löneprognos totals the whole selection, not the page in front of the reader. */
	const monthlyTotals = useMemo(() => personnelMonthlyTotals(monthlyRows), [monthlyRows]);

	const totalPages = Math.max(1, Math.ceil(monthlyShown.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const staffingTotalPages = Math.max(1, Math.ceil(staffing.length / pageSize));
	const currentStaffingPage = Math.min(staffingPage, staffingTotalPages);

	const setFilter = useCallback(<K extends keyof PersonnelFilters>(key: K, value: PersonnelFilters[K]) => {
		setDraft((prev) => ({ ...prev, [key]: value }));
	}, []);

	/** A Roll tag: choosing one adds it, choosing it again takes it away. */
	const toggleRole = useCallback((role: string) => {
		setDraft((prev) => ({
			...prev,
			roles: prev.roles.includes(role) ? prev.roles.filter((item) => item !== role) : [...prev.roles, role],
		}));
	}, []);

	const apply = useCallback(() => {
		setApplied(draft);
		setPage(1);
		setStaffingPage(1);
	}, [draft]);

	const reset = useCallback(() => {
		setDraft(INITIAL_PERSONNEL_FILTERS);
		setApplied(INITIAL_PERSONNEL_FILTERS);
		setPage(1);
		setStaffingPage(1);
	}, []);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
		setStaffingPage(1);
	}, []);

	const onSortStaffing = useCallback(
		(field: StaffingSortField) => {
			staffingSort.toggleSort(field);
			setStaffingPage(1);
		},
		[staffingSort],
	);

	const onSortMonthly = useCallback(
		(field: PersonnelMonthlySortField) => {
			monthlySort.toggleSort(field);
			setPage(1);
		},
		[monthlySort],
	);

	const narrowed =
		applied.department !== null ||
		applied.status !== null ||
		applied.kategori !== null ||
		applied.roles.length > 0;
	const emptyKey = narrowed
		? localizationConstants.forecastPersonnelNoMatches
		: localizationConstants.forecastPersonnelEmpty;

	return {
		isLoading,
		draft,
		setFilter,
		toggleRole,
		apply,
		reset,
		departments: useMemo(() => personnelDepartments(employees), [employees]),
		roles: useMemo(() => personnelRoles(employees), [employees]),
		summary,
		trend,
		distribution,
		changes,
		staffingRows: staffing.slice((currentStaffingPage - 1) * pageSize, currentStaffingPage * pageSize),
		staffingPage: currentStaffingPage,
		staffingTotalPages,
		setStaffingPage,
		monthlyRows: monthlyShown.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		monthlyTotals,
		monthKeys,
		currentPage,
		totalPages,
		setPage,
		pageSize,
		setPageSize,
		staffingSortField: staffingSort.sortField,
		staffingSortDir: staffingSort.sortDir,
		onSortStaffing,
		monthlySortField: monthlySort.sortField,
		monthlySortDir: monthlySort.sortDir,
		onSortMonthly,
		emptyKey,
	};
}

export type ForecastPersonnelState = ReturnType<typeof useForecastPersonnel>;
