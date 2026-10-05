"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
	GroupByMode,
	GroupViewTab,
	GanttTimeRange,
	WorktimeGroupData,
	EmployeeGroupSummary,
} from "../types/worktimeGroup.types";
import { initialWorktimeGroupData } from "../constants/worktimeGroup.mock";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";

export function useWorktimeGroup() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<GroupViewTab>("kalender");
	const [groupByMode, setGroupByMode] = useState<GroupByMode>("person");
	const [searchQuery, setSearchQuery] = useState("");
	const [showExceptionsOnly, setShowExceptionsOnly] = useState(false);
	const [ganttTimeRange, setGanttTimeRange] = useState<GanttTimeRange>("vecka");
	const [groupData, setGroupData] = useState<WorktimeGroupData>(initialWorktimeGroupData);

	// Expanded state for list view
	const [expandedEmployees, setExpandedEmployees] = useState<Record<string, boolean>>({
		"emp-1": true,
	});

	// Safe confirmation dialog state
	const [confirmAction, setConfirmAction] = useState<{
		employeeId: string;
		dayId: string;
		action: "approve" | "reject";
	} | null>(null);

	const handleTabChange = useCallback((tab: GroupViewTab) => {
		setActiveTab(tab);
	}, []);

	const handleGroupByModeChange = useCallback((mode: GroupByMode) => {
		setGroupByMode(mode);
	}, []);

	const handleToggleEmployee = useCallback((employeeId: string) => {
		setExpandedEmployees((prev) => ({
			...prev,
			[employeeId]: !prev[employeeId],
		}));
	}, []);

	const handleExpandAll = useCallback(() => {
		const expanded: Record<string, boolean> = {};
		groupData.employees.forEach((emp) => {
			expanded[emp.id] = true;
		});
		setExpandedEmployees(expanded);
	}, [groupData.employees]);

	const handleCollapseAll = useCallback(() => {
		setExpandedEmployees({});
	}, []);

	const handleToggleExceptions = useCallback(() => {
		setShowExceptionsOnly((prev) => !prev);
	}, []);

	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
	}, []);

	const handleGanttRangeChange = useCallback((range: GanttTimeRange) => {
		setGanttTimeRange(range);
	}, []);

	// Filtered employees list
	const filteredEmployees = useMemo(() => {
		return groupData.employees.filter((emp: EmployeeGroupSummary) => {
			if (showExceptionsOnly && !emp.hasDeviation) {
				return false;
			}
			if (searchQuery.trim() !== "") {
				const query = searchQuery.toLowerCase();
				const matchName = emp.name.toLowerCase().includes(query);
				const matchRole = emp.role.toLowerCase().includes(query);
				const matchTeam = emp.team.toLowerCase().includes(query);
				if (!matchName && !matchRole && !matchTeam) {
					return false;
				}
			}
			return true;
		});
	}, [groupData.employees, showExceptionsOnly, searchQuery]);

	// Open action confirmation dialogs
	const handleOpenApproveDay = useCallback((employeeId: string, dayId: string) => {
		setConfirmAction({ employeeId, dayId, action: "approve" });
	}, []);

	const handleOpenRejectDay = useCallback((employeeId: string, dayId: string) => {
		setConfirmAction({ employeeId, dayId, action: "reject" });
	}, []);

	const handleCloseConfirmDialog = useCallback(() => {
		setConfirmAction(null);
	}, []);

	const handleConfirmDayAction = useCallback(() => {
		if (!confirmAction) return;

		const { employeeId, dayId, action } = confirmAction;

		setGroupData((prev) => {
			const updatedEmployees = prev.employees.map((emp) => {
				if (emp.id !== employeeId) return emp;

				const updatedDays = emp.days.map((day) => {
					if (day.id !== dayId) return day;
					return {
						...day,
						actionStatus: (action === "approve" ? "approved" : "rejected") as "approved" | "rejected",
						status: (action === "approve" ? "approved" : "rejected") as "approved" | "rejected",
					};
				});

				// Recompute employee status on approve or reject
				const hasAnyRejected = updatedDays.some((d) => d.actionStatus === "rejected");
				const allSubmittedApproved = updatedDays
					.filter((d) => d.loggedHours > 0)
					.every((d) => d.actionStatus === "approved");

				let newStatus: "inkickad" | "godkand" | "mangler" | "returned" = emp.status;
				if (hasAnyRejected) {
					newStatus = "returned";
				} else if (allSubmittedApproved) {
					newStatus = "godkand";
				} else {
					newStatus = "inkickad";
				}

				return {
					...emp,
					days: updatedDays,
					status: newStatus,
				};
			});

			return {
				...prev,
				employees: updatedEmployees,
			};
		});

		if (action === "approve") {
			toast.success(t(localizationConstants.worktimeGroupToastApproved));
		} else {
			toast.error(t(localizationConstants.worktimeGroupToastRejected));
		}

		setConfirmAction(null);
	}, [confirmAction, t]);

	const handleRemind = useCallback(
		(_employeeId: string) => {
			toast.info(t(localizationConstants.worktimeGroupToastReminded));
		},
		[t]
	);

	// Week navigation preserving state
	const handlePrevWeek = useCallback(() => {
		setGroupData((prev) => {
			const nextWeek = prev.weekNumber > 1 ? prev.weekNumber - 1 : 52;
			const nextYear = prev.weekNumber > 1 ? prev.year : prev.year - 1;
			return {
				...prev,
				weekNumber: nextWeek,
				year: nextYear,
				dateRange: `${nextWeek === 51 ? "16 Dec - 22 Dec" : `Vecka ${nextWeek}, ${nextYear}`}`,
			};
		});
	}, []);

	const handleNextWeek = useCallback(() => {
		setGroupData((prev) => {
			const nextWeek = prev.weekNumber < 52 ? prev.weekNumber + 1 : 1;
			const nextYear = prev.weekNumber < 52 ? prev.year : prev.year + 1;
			return {
				...prev,
				weekNumber: nextWeek,
				year: nextYear,
				dateRange: `${nextWeek === 1 ? "30 Dec - 05 Jan" : `Vecka ${nextWeek}, ${nextYear}`}`,
			};
		});
	}, []);

	const handleResetThisWeek = useCallback(() => {
		setGroupData(initialWorktimeGroupData);
	}, []);

	return {
		activeTab,
		groupByMode,
		searchQuery,
		showExceptionsOnly,
		ganttTimeRange,
		groupData,
		filteredEmployees,
		expandedEmployees,
		confirmAction,
		handleTabChange,
		handleGroupByModeChange,
		handleToggleEmployee,
		handleExpandAll,
		handleCollapseAll,
		handleToggleExceptions,
		handleSearchChange,
		handleGanttRangeChange,
		handleOpenApproveDay,
		handleOpenRejectDay,
		handleCloseConfirmDialog,
		handleConfirmDayAction,
		handleRemind,
		handlePrevWeek,
		handleNextWeek,
		handleResetThisWeek,
	};
}
