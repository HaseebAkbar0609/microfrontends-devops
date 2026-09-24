"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import type {
	CalculationStatRow,
	CalculationStatKpis,
	CalculationStatSortField,
	CalculationStatFilters,
} from "../types/statistics";
import {
	DUMMY_CALCULATION_STAT_KPIS,
	DUMMY_CALCULATION_STAT_ROWS,
	DEFAULT_BESTELLARE_OPTIONS,
	DEFAULT_KATEGORI_OPTIONS,
	DEFAULT_TYP_OPTIONS,
	DEFAULT_ENTREPRENADFORM_OPTIONS,
	DEFAULT_START_DATE_OPTIONS,
	DEFAULT_END_DATE_OPTIONS,
} from "../constants/statisticsMock";
import {
	getCalculationStatisticsAPIAction,
	getCalculationStatisticsKpisAPIAction,
} from "../api/statisticsApi";

export function useCalculationStatistics() {
	const t = useTranslate();

	// KPI Metrics State
	const [kpis, setKpis] = useState<CalculationStatKpis>(DUMMY_CALCULATION_STAT_KPIS);
	const [isKpisLoading, setIsKpisLoading] = useState(false);

	// Table Data State
	const [rows, setRows] = useState<CalculationStatRow[]>(DUMMY_CALCULATION_STAT_ROWS);
	const [isLoading, setIsLoading] = useState(false);

	// Draft Filter State
	const [bestellare, setBestellare] = useState<string>("");
	const [selectedKategori, setSelectedKategori] = useState<string[]>(["Service"]);
	const [selectedTyp, setSelectedTyp] = useState<string[]>(["B2B", "B2C Offert", "Express"]);
	const [entreprenadform, setEntreprenadform] = useState<string>("General");
	const [startDate, setStartDate] = useState<string>("2025-12-24");
	const [endDate, setEndDate] = useState<string>("2025-12-30");

	// Applied Filters State (Triggered on clicking "Välj")
	const [appliedFilters, setAppliedFilters] = useState<CalculationStatFilters>({
		bestellare: "",
		kategori: [],
		typ: [],
		entreprenadform: "",
		startDate: "2025-12-24",
		endDate: "2025-12-30",
	});

	// Search, Pagination & Sort State
	const [search, setSearch] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const { sortField, sortDir, toggleSort } = useTableSort<CalculationStatSortField>();

	// Has active applied filters check
	const hasActiveFilters = useMemo(() => {
		return (
			!!bestellare ||
			selectedKategori.length > 0 ||
			selectedTyp.length > 0 ||
			!!entreprenadform ||
			startDate !== "2025-12-24" ||
			endDate !== "2025-12-30" ||
			!!appliedFilters.bestellare ||
			appliedFilters.kategori.length > 0 ||
			appliedFilters.typ.length > 0 ||
			!!appliedFilters.entreprenadform
		);
	}, [bestellare, selectedKategori, selectedTyp, entreprenadform, startDate, endDate, appliedFilters]);

	// Fetch KPI Metrics
	const fetchKpis = useCallback(async () => {
		setIsKpisLoading(true);
		try {
			const res = await getCalculationStatisticsKpisAPIAction({
				startDate: appliedFilters.startDate,
				endDate: appliedFilters.endDate,
			});
			if (res) {
				setKpis(res);
			}
		} catch {
			// Fallback handled inside API action
		} finally {
			setIsKpisLoading(false);
		}
	}, [appliedFilters.startDate, appliedFilters.endDate]);

	// Fetch Table Statistics Rows
	const fetchRows = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getCalculationStatisticsAPIAction({
				search,
				bestellare: appliedFilters.bestellare,
				kategori: appliedFilters.kategori,
				typ: appliedFilters.typ,
				entreprenadform: appliedFilters.entreprenadform,
				startDate: appliedFilters.startDate,
				endDate: appliedFilters.endDate,
				page,
				limit: pageSize,
				sortBy: sortField ?? undefined,
				sortOrder: sortDir ?? undefined,
			});
			if (res?.data && res.data.length > 0) {
				setRows(res.data);
			}
		} catch {
			// Fallback handled inside API action
		} finally {
			setIsLoading(false);
		}
	}, [
		search,
		appliedFilters.bestellare,
		appliedFilters.kategori,
		appliedFilters.typ,
		appliedFilters.entreprenadform,
		appliedFilters.startDate,
		appliedFilters.endDate,
		page,
		pageSize,
		sortField,
		sortDir,
	]);

	useEffect(() => {
		void fetchKpis();
	}, [fetchKpis]);

	useEffect(() => {
		void fetchRows();
	}, [fetchRows]);

	// Category Toggle handler
	const handleToggleKategori = useCallback((val: string) => {
		setSelectedKategori((prev) =>
			prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val],
		);
	}, []);

	// Type Toggle handler
	const handleToggleTyp = useCallback((val: string) => {
		setSelectedTyp((prev) =>
			prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val],
		);
	}, []);

	// Apply Filters handler (Clicking "Välj")
	const handleApplyFilters = useCallback(() => {
		setAppliedFilters({
			bestellare,
			kategori: selectedKategori,
			typ: selectedTyp,
			entreprenadform,
			startDate,
			endDate,
		});
		setPage(1);
		showToast("info", t(localizationConstants.filter));
	}, [bestellare, selectedKategori, selectedTyp, entreprenadform, startDate, endDate, t]);

	// Reset Filters handler (Clicking "Reset ✕")
	const handleResetFilters = useCallback(() => {
		setBestellare("");
		setSelectedKategori([]);
		setSelectedTyp([]);
		setEntreprenadform("");
		setStartDate("2025-12-24");
		setEndDate("2025-12-30");
		setAppliedFilters({
			bestellare: "",
			kategori: [],
			typ: [],
			entreprenadform: "",
			startDate: "2025-12-24",
			endDate: "2025-12-30",
		});
		setSearch("");
		setPage(1);
		showToast("info", t(localizationConstants.calcStatReset));
	}, [t]);

	// Filter & Sort for Client View (Instant UX responsiveness)
	const filteredRows = useMemo(() => {
		let result = rows;
		if (appliedFilters.bestellare) {
			result = result.filter((r) => r.bestellare === appliedFilters.bestellare);
		}
		if (appliedFilters.kategori.length > 0) {
			result = result.filter((r) => appliedFilters.kategori.includes(r.kategori));
		}
		if (appliedFilters.typ.length > 0) {
			result = result.filter((r) => appliedFilters.typ.includes(r.typ));
		}
		if (appliedFilters.entreprenadform) {
			result = result.filter((r) => r.entreprenadform === appliedFilters.entreprenadform);
		}
		const q = search.trim().toLowerCase();
		if (!q) return result;
		return result.filter(
			(r) =>
				r.bestellare.toLowerCase().includes(q) ||
				r.kategori.toLowerCase().includes(q) ||
				r.typ.toLowerCase().includes(q) ||
				r.datum.toLowerCase().includes(q) ||
				r.entreprenadform.toLowerCase().includes(q),
		);
	}, [rows, appliedFilters, search]);

	const sortedRows = useMemo(() => {
		return sortItems(
			filteredRows,
			sortField,
			sortDir,
			(item, field) => item[field as keyof CalculationStatRow] as string | number,
		);
	}, [filteredRows, sortField, sortDir]);

	const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
	const paginatedRows = useMemo(() => {
		return sortedRows.slice((page - 1) * pageSize, page * pageSize);
	}, [sortedRows, page, pageSize]);

	// View list item handler ("se lista")
	const handleViewList = useCallback(
		(_row: CalculationStatRow) => {
			showToast("info", t(localizationConstants.comingSoon));
		},
		[t],
	);

	return {
		kpis,
		isKpisLoading,
		rows: paginatedRows,
		totalRows: sortedRows.length,
		isLoading,
		bestellare,
		setBestellare,
		selectedKategori,
		selectedTyp,
		entreprenadform,
		setEntreprenadform,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		search,
		setSearch,
		page,
		setPage,
		pageSize,
		setPageSize,
		totalPages,
		sortField,
		sortDir,
		toggleSort,
		hasActiveFilters,
		bestellareOptions: DEFAULT_BESTELLARE_OPTIONS,
		kategoriOptions: DEFAULT_KATEGORI_OPTIONS,
		typOptions: DEFAULT_TYP_OPTIONS,
		entreprenadformOptions: DEFAULT_ENTREPRENADFORM_OPTIONS,
		startDateOptions: DEFAULT_START_DATE_OPTIONS,
		endDateOptions: DEFAULT_END_DATE_OPTIONS,
		handleToggleKategori,
		handleToggleTyp,
		handleApplyFilters,
		handleResetFilters,
		handleViewList,
	};
}
