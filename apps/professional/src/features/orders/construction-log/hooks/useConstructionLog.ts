"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CONSTRUCTION_LOG_CONSTANTS } from "../constants/constructionLog.constants";
import {
	INITIAL_MOCK_CONSTRUCTION_LOG,
	MOCK_CALENDAR_DAYS,
} from "../data/constructionLog.mock";
import {
	getConstructionLogs,
	saveConstructionLog,
} from "@/api-actions/orders/constructionLog";
import type {
	ConstructionLogEntry,
	ConstructionCalendarDay,
	WeatherInfo,
} from "../types/constructionLog.types";

function filterBySearch<T>(items: T[], query: string, keys: (keyof T)[]): T[] {
	if (!query.trim()) return items;
	const q = query.toLowerCase();
	return items.filter((item) =>
		keys.some((key) => String(item[key]).toLowerCase().includes(q))
	);
}

export function useConstructionLog(orderId?: string) {
	const t = useTranslate();
	const targetOrderId = orderId || CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID;

	const [selectedDate, setSelectedDate] = useState<string>(() => {
		const now = new Date();
		const yyyy = now.getFullYear();
		const mm = String(now.getMonth() + 1).padStart(2, "0");
		const dd = String(now.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	});
	// Initial UI state — replaced by API data on load
	const [log, setLog] = useState<ConstructionLogEntry>(INITIAL_MOCK_CONSTRUCTION_LOG);
	const [calendarDays, setCalendarDays] = useState<ConstructionCalendarDay[]>(MOCK_CALENDAR_DAYS);

	// Search & Filter
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>(
		CONSTRUCTION_LOG_CONSTANTS.FILTER_ALL
	);

	// Load data for selected date — API first, mock fallback silently
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const logs = await getConstructionLogs(targetOrderId);
				if (cancelled) return;

				const found = logs.find((l) => l.date === selectedDate);
				const logData: ConstructionLogEntry = found ?? {
					...INITIAL_MOCK_CONSTRUCTION_LOG,
					id: `log-${targetOrderId}-${selectedDate.replace(/-/g, "")}`,
					date: selectedDate,
					weather: { ...INITIAL_MOCK_CONSTRUCTION_LOG.weather, date: selectedDate },
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				setLog(logData);

				const [y, m] = selectedDate.split("-").map(Number);
				const monthStr = String(m).padStart(2, "0");
				const monthPrefix = `${y}-${monthStr}`;
				const logDates = new Set(logs.map((l) => l.date));
				const cDays = MOCK_CALENDAR_DAYS.filter((d) => d.date.startsWith(monthPrefix));
				for (const d of logDates) {
					if (d.startsWith(monthPrefix) && !cDays.some((cd) => cd.date === d)) {
						cDays.push({ date: d, type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.SELECTED });
					}
				}
				setCalendarDays(cDays);
			} catch {
				// API failed — mock data already in state, no action needed
			}
		})();
		return () => { cancelled = true; };
	}, [selectedDate, targetOrderId]);

	const handleDateChange = useCallback((date: string) => {
		setSelectedDate(date);
	}, []);

	const handleWeatherChange = useCallback((updated: Partial<WeatherInfo>) => {
		setLog((prev) => ({
			...prev,
			weather: {
				...prev.weather,
				...updated,
			},
		}));
	}, []);

	const handleGeneralNotesChange = useCallback((generalNotes: string) => {
		setLog((prev) => ({
			...prev,
			generalNotes,
		}));
	}, []);

	const handleSelfInspectionNoteChange = useCallback((selfInspectionNote: string) => {
		setLog((prev) => ({
			...prev,
			selfInspectionNote,
		}));
	}, []);

	const handleSave = async () => {
		try {
			await saveConstructionLog(log, targetOrderId);
			toast.success(t(localizationConstants.orderDagbokToastSaved));
		} catch {
			toast.error(t(localizationConstants.orderDagbokToastSaveError));
		}
	};

	const handlePrint = () => {
		window.print();
	};

	// Filtered sub-lists according to search query and category filter
	const filteredWorkforce = useMemo(
		() => filterBySearch(log.workforce, searchQuery, ["role", "note"]),
		[log.workforce, searchQuery]
	);

	const filteredActivities = useMemo(
		() => filterBySearch(log.activities, searchQuery, ["title", "note"]),
		[log.activities, searchQuery]
	);

	const filteredMachines = useMemo(
		() => filterBySearch(log.machines, searchQuery, ["name", "note"]),
		[log.machines, searchQuery]
	);

	const filteredDeviations = useMemo(() => {
		let deviations = log.deviations;

		if (categoryFilter === CONSTRUCTION_LOG_CONSTANTS.FILTER_DEVIATION) {
			deviations = deviations.filter(
				(d) => d.type === CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ATA
			);
		} else if (categoryFilter === CONSTRUCTION_LOG_CONSTANTS.FILTER_NORMAL) {
			deviations = deviations.filter(
				(d) => d.type !== CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ATA
			);
		}

		return filterBySearch(deviations, searchQuery, ["note"]);
	}, [log.deviations, searchQuery, categoryFilter]);

	return {
		log,
		selectedDate,
		calendarDays,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		handleDateChange,
		handleWeatherChange,
		handleGeneralNotesChange,
		handleSelfInspectionNoteChange,
		handleSave,
		handlePrint,
		filteredWorkforce,
		filteredActivities,
		filteredMachines,
		filteredDeviations,
	};
}
