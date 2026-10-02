"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
	WorktimeViewMode,
	WorktimeSubModule,
	WeeklyTimesheetData,
	WorktimeAllocationItem,
} from "../types/worktime.types";
import { INITIAL_WEEKLY_TIMESHEET, INITIAL_DAY_COLUMNS } from "../constants/worktime.mock";
import localizationConstants from "@/utils/translation/constants";

export function useWorktime(employeeName = "Anna Svensson") {
	const [subModule, setSubModule] = useState<WorktimeSubModule>("worktime");
	const [viewMode, setViewMode] = useState<WorktimeViewMode>("calendar");
	const [timesheet, setTimesheet] = useState<WeeklyTimesheetData>(() => ({
		...INITIAL_WEEKLY_TIMESHEET,
		employeeName,
	}));
	const [isComparisonOn, setIsComparisonOn] = useState<boolean>(false);
	const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({
		day_2024_12_23: true,
		day_2024_12_24: true,
	});
	const [confirmAction, setConfirmAction] = useState<"approve" | "return" | null>(null);
	const [addObjectModalOpen, setAddObjectModalOpen] = useState(false);
	const [targetDayId, setTargetDayId] = useState<string | null>(null);

	const dayColumns = useMemo(() => INITIAL_DAY_COLUMNS, []);

	const handleSelectSubModule = useCallback((mod: WorktimeSubModule) => {
		setSubModule(mod);
		if (mod === "timesheet") {
			setViewMode("table");
		} else {
			setViewMode("calendar");
		}
	}, []);

	const handleToggleView = useCallback((mode: WorktimeViewMode) => {
		setViewMode(mode);
		if (mode === "table") {
			setSubModule("timesheet");
		} else {
			setSubModule("worktime");
		}
	}, []);

	const handleToggleComparison = useCallback(() => {
		setIsComparisonOn((prev) => !prev);
	}, []);

	const handleToggleDay = useCallback((dayId: string) => {
		setExpandedDays((prev) => ({
			...prev,
			[dayId]: !prev[dayId],
		}));
	}, []);

	const handleOpenApproveDialog = useCallback(() => {
		setConfirmAction("approve");
	}, []);

	const handleOpenReturnDialog = useCallback(() => {
		setConfirmAction("return");
	}, []);

	const handleCloseConfirmDialog = useCallback(() => {
		setConfirmAction(null);
	}, []);

	const handleConfirmAction = useCallback(() => {
		if (confirmAction === "approve") {
			setTimesheet((prev) => ({ ...prev, status: "approved" }));
			toast.success(localizationConstants.worktimeToastApproved);
		} else if (confirmAction === "return") {
			setTimesheet((prev) => ({ ...prev, status: "returned" }));
			toast.success(localizationConstants.worktimeToastReturned);
		}
		setConfirmAction(null);
	}, [confirmAction]);

	const handleOpenAddObjectModal = useCallback((dayId: string) => {
		setTargetDayId(dayId);
		setAddObjectModalOpen(true);
	}, []);

	const handleCloseAddObjectModal = useCallback(() => {
		setAddObjectModalOpen(false);
		setTargetDayId(null);
	}, []);

	const handleSaveNewAllocation = useCallback(
		(allocation: Omit<WorktimeAllocationItem, "id">) => {
			if (!targetDayId) return;

			const newItem: WorktimeAllocationItem = {
				...allocation,
				id: `alloc_${Date.now()}`,
				isModified: true,
			};

			setTimesheet((prev) => {
				const updatedDays = prev.days.map((day) => {
					if (day.id !== targetDayId) return day;
					const newAllocations = [...day.allocations, newItem];
					const newFinalHours = newAllocations.reduce(
						(acc, curr) => acc + curr.regularHours + curr.otHours,
						0
					);
					const deviation = +(newFinalHours - day.originalHours).toFixed(1);
					return {
						...day,
						allocations: newAllocations,
						finalHours: newFinalHours,
						deviationHours: deviation,
						isModified: true,
					};
				});

				const totalFinal = updatedDays.reduce((acc, d) => acc + d.finalHours, 0);
				const deviationTotal = +(totalFinal - prev.originalTotalHours).toFixed(1);

				return {
					...prev,
					days: updatedDays,
					finalTotalHours: totalFinal,
					deviationHours: deviationTotal,
				};
			});

			toast.success(localizationConstants.worktimeToastObjectAdded);
			handleCloseAddObjectModal();
		},
		[targetDayId, handleCloseAddObjectModal]
	);

	const handleDeleteAllocation = useCallback(
		(dayId: string, allocId: string) => {
			setTimesheet((prev) => {
				const updatedDays = prev.days.map((day) => {
					if (day.id !== dayId) return day;
					const newAllocations = day.allocations.filter((a) => a.id !== allocId);
					const newFinalHours = newAllocations.reduce(
						(acc, curr) => acc + curr.regularHours + curr.otHours,
						0
					);
					const deviation = +(newFinalHours - day.originalHours).toFixed(1);
					return {
						...day,
						allocations: newAllocations,
						finalHours: newFinalHours,
						deviationHours: deviation,
						isModified: newAllocations.some((a) => a.isModified),
					};
				});

				const totalFinal = updatedDays.reduce((acc, d) => acc + d.finalHours, 0);
				const deviationTotal = +(totalFinal - prev.originalTotalHours).toFixed(1);

				return {
					...prev,
					days: updatedDays,
					finalTotalHours: totalFinal,
					deviationHours: deviationTotal,
				};
			});

			toast.success(localizationConstants.worktimeToastObjectDeleted);
		},
		[]
	);

	const handlePrevWeek = useCallback(() => {
		setTimesheet((prev) => {
			const newWeek = prev.weekNumber > 1 ? prev.weekNumber - 1 : 52;
			return {
				...prev,
				weekNumber: newWeek,
				dateRange: `v.${newWeek}, 2024`,
			};
		});
	}, []);

	const handleNextWeek = useCallback(() => {
		setTimesheet((prev) => {
			const newWeek = prev.weekNumber < 52 ? prev.weekNumber + 1 : 1;
			return {
				...prev,
				weekNumber: newWeek,
				dateRange: `v.${newWeek}, 2024`,
			};
		});
	}, []);

	const handleResetThisWeek = useCallback(() => {
		setTimesheet((prev) => ({
			...prev,
			weekNumber: 52,
			dateRange: "Dec 23 - Dec 29",
		}));
	}, []);

	return {
		subModule,
		viewMode,
		timesheet,
		dayColumns,
		isComparisonOn,
		expandedDays,
		confirmAction,
		addObjectModalOpen,
		targetDayId,
		handleSelectSubModule,
		handleToggleView,
		handleToggleComparison,
		handleToggleDay,
		handleOpenApproveDialog,
		handleOpenReturnDialog,
		handleCloseConfirmDialog,
		handleConfirmAction,
		handleOpenAddObjectModal,
		handleCloseAddObjectModal,
		handleSaveNewAllocation,
		handleDeleteAllocation,
		handlePrevWeek,
		handleNextWeek,
		handleResetThisWeek,
	};
}
