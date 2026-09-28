"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MOCK_REFERENCE_DATE } from "@/features/widgetdashboard/utils/mockDates";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { FORECAST_LIST_COLUMNS } from "../constants/forecastList.constants";
import {
	customReportRoutes,
	DEFAULT_CUSTOM_REPORT_COLUMNS,
} from "../constants/forecastCustomReports.constants";
import type { ForecastListSortField } from "../types/forecastList.types";
import { createCustomReport, listCustomReports } from "../utils/customReportsRepository";
import { customReportNameError } from "../utils/forecastCustomReports";
import { useForecastList } from "./useForecastList";

function sameColumns(a: ReadonlySet<ForecastListSortField>, b: ReadonlySet<ForecastListSortField>): boolean {
	return a.size === b.size && [...a].every((key) => b.has(key));
}

/**
 * Skapa ny rapport: which columns the report carries, and the report itself.
 *
 * The checkboxes hold a draft. The card's Spara applies it to the table and
 * Kasta bort returns it to what is applied, so a thirteen-column table does
 * not re-lay-out under the reader on every tick. What is applied is what the
 * preview shows and what gets saved.
 */
export function useCustomReportBuilder(basePath?: string) {
	const router = useRouter();
	const t = useTranslate();
	const routes = customReportRoutes(basePath);
	const list = useForecastList();

	const initial = () => new Set<ForecastListSortField>(DEFAULT_CUSTOM_REPORT_COLUMNS);
	const defaultColumns = useMemo(initial, []);
	const [appliedColumns, setAppliedColumns] = useState<ReadonlySet<ForecastListSortField>>(initial);
	const [draftColumns, setDraftColumns] = useState<ReadonlySet<ForecastListSortField>>(initial);
	const [lastColumnBlocked, setLastColumnBlocked] = useState(false);
	const [naming, setNaming] = useState(false);
	const [previewing, setPreviewing] = useState(false);
	const [leaving, setLeaving] = useState(false);

	const pendingCount = useMemo(() => {
		let count = 0;
		for (const key of draftColumns) if (!appliedColumns.has(key)) count += 1;
		for (const key of appliedColumns) if (!draftColumns.has(key)) count += 1;
		return count;
	}, [draftColumns, appliedColumns]);

	const pendingChanges = pendingCount > 0;

	/** The applied columns in the list's own order, whatever order they were ticked in. */
	const appliedList = useMemo(
		() => FORECAST_LIST_COLUMNS.filter((column) => appliedColumns.has(column.key)),
		[appliedColumns],
	);

	/* Untouched means the columns the builder opened with, not merely as many of them. */
	const dirty = pendingChanges || !sameColumns(appliedColumns, defaultColumns);

	/* A report half built is still worth a warning on the way out of the tab. */
	useEffect(() => {
		if (!dirty) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [dirty]);

	/** Ticks or unticks a column, never unticking the last one left. */
	const toggleColumn = useCallback((key: ForecastListSortField) => {
		setDraftColumns((previous) => {
			const next = new Set(previous);
			if (!next.has(key)) {
				next.add(key);
				setLastColumnBlocked(false);
				return next;
			}
			if (next.size === 1) {
				setLastColumnBlocked(true);
				return previous;
			}
			next.delete(key);
			setLastColumnBlocked(false);
			return next;
		});
	}, []);

	const applyColumns = useCallback(() => {
		setAppliedColumns(new Set(draftColumns));
		setLastColumnBlocked(false);
	}, [draftColumns]);

	const discardColumns = useCallback(() => {
		setDraftColumns(new Set(appliedColumns));
		setLastColumnBlocked(false);
	}, [appliedColumns]);

	const leave = useCallback(() => router.push(routes.list), [router, routes.list]);

	const requestLeave = useCallback(() => {
		if (dirty) {
			setLeaving(true);
			return;
		}
		leave();
	}, [dirty, leave]);

	/**
	 * Files the report, or says why it could not be — nothing typed, too long,
	 * or a name already taken. The dialog shows that reason against its field
	 * and stays open; `null` means saved, and only then does it close.
	 */
	const saveReport = useCallback(
		(name: string): TranslationKeys | null => {
			const error = customReportNameError(name, listCustomReports());
			if (error) return error;

			const created = createCustomReport({ name, columns: [...appliedColumns] }, MOCK_REFERENCE_DATE);
			if (!created) return localizationConstants.forecastCustomReportsSaveFailed;

			showToast("success", t(localizationConstants.forecastCustomReportsSaved, { name: created.name }));
			leave();
			return null;
		},
		[appliedColumns, leave, t],
	);

	return {
		list,
		appliedList,
		draftColumns,
		toggleColumn,
		applyColumns,
		discardColumns,
		pendingChanges,
		pendingCount,
		lastColumnBlocked,
		naming,
		setNaming,
		previewing,
		setPreviewing,
		leaving,
		setLeaving,
		requestLeave,
		leave,
		saveReport,
	};
}

export type CustomReportBuilderState = ReturnType<typeof useCustomReportBuilder>;
