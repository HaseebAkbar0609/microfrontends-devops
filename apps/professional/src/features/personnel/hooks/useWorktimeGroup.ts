"use client";

import { useState, useMemo, useCallback } from "react";
import {
	GroupByMode,
	GroupViewTab,
	GanttTimeRange,
	WorktimeGroupData,
	EmployeeGroupSummary,
} from "../types/worktimeGroup.types";
import { initialWorktimeGroupData } from "../constants/worktimeGroup.mock";
import { useWorktimeProjectGroup } from "./useWorktimeProjectGroup";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";

export function useWorktimeGroup() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<GroupViewTab>("kalender");
	const [groupByMode, setGroupByMode] = useState<GroupByMode>("person");
	const [searchQuery, setSearchQuery] = useState("");
	const [showExceptionsOnly, setShowExceptionsOnly] = useState(false);
	const [ganttTimeRange, setGanttTimeRange] = useState<GanttTimeRange>("vecka");
	const [groupData, setGroupData] = useState<WorktimeGroupData>(
		initialWorktimeGroupData
	);

	// Expanded employee rows for list view
	const [expandedEmployees, setExpandedEmployees] = useState<Record<string, boolean>>({
		"emp-1": true,
	});

	// Safe confirmation dialog state
	const [confirmAction, setConfirmAction] = useState<{
		employeeId: string;
		dayId: string;
		action: "approve" | "reject";
	} | null>(null);

	// Dedicated project group hook for project grouping view
	const {
		projectData,
		expandedProjects,
		filteredProjects,
		filteredGanttRows: filteredProjectGanttRows,
		handleToggleProject,
		handleExpandAllProjects,
		handleCollapseAllProjects,
	} = useWorktimeProjectGroup({
		searchQuery,
		showExceptionsOnly,
	});

	// Tab navigation
	const handleTabChange = useCallback((tab: GroupViewTab) => {
		setActiveTab(tab);
	}, []);

	// Group-by toggle (person vs project)
	const handleGroupByModeChange = useCallback((mode: GroupByMode) => {
		setGroupByMode(mode);
	}, []);

	// Search & exception filtering
	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
	}, []);

	const handleToggleExceptions = useCallback(() => {
		setShowExceptionsOnly((prev) => !prev);
	}, []);

	// Gantt timeline range switch (vecka vs månad)
	const handleGanttRangeChange = useCallback((range: GanttTimeRange) => {
		setGanttTimeRange(range);
	}, []);

	// Row expansion
	const handleToggleEmployee = useCallback((employeeId: string) => {
		setExpandedEmployees((prev) => ({
			...prev,
			[employeeId]: !prev[employeeId],
		}));
	}, []);

	const handleExpandAll = useCallback(() => {
		if (groupByMode === "project") {
			handleExpandAllProjects();
		} else {
			const allExpanded: Record<string, boolean> = {};
			groupData.employees.forEach((emp) => {
				allExpanded[emp.id] = true;
			});
			setExpandedEmployees(allExpanded);
		}
	}, [groupByMode, groupData.employees, handleExpandAllProjects]);

	const handleCollapseAll = useCallback(() => {
		if (groupByMode === "project") {
			handleCollapseAllProjects();
		} else {
			setExpandedEmployees({});
		}
	}, [groupByMode, handleCollapseAllProjects]);

	// Filtered employees list based on search and exception toggle
	const filteredEmployees = useMemo(() => {
		return groupData.employees.filter((emp: EmployeeGroupSummary) => {
			if (showExceptionsOnly && !emp.hasDeviation) {
				return false;
			}
			if (searchQuery.trim() !== "") {
				const q = searchQuery.toLowerCase();
				const matchName = emp.name.toLowerCase().includes(q);
				const matchRole = emp.role.toLowerCase().includes(q);
				const matchEmpCode = emp.empCode ? emp.empCode.toLowerCase().includes(q) : false;
				const matchTeam = emp.team ? emp.team.toLowerCase().includes(q) : false;
				if (!matchName && !matchRole && !matchEmpCode && !matchTeam) {
					return false;
				}
			}
			return true;
		});
	}, [groupData.employees, showExceptionsOnly, searchQuery]);

	// Day approval/rejection action handling
	const handleOpenApproveDay = useCallback(
		(employeeId: string, dayId: string) => {
			setConfirmAction({ employeeId, dayId, action: "approve" });
		},
		[]
	);

	const handleOpenRejectDay = useCallback(
		(employeeId: string, dayId: string) => {
			setConfirmAction({ employeeId, dayId, action: "reject" });
		},
		[]
	);

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
						actionStatus: (action === "approve"
							? "approved"
							: "rejected") as "approved" | "rejected",
						status: (action === "approve"
							? "approved"
							: "rejected") as "approved" | "rejected",
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
			showToast("success", t(localizationConstants.worktimeGroupToastApproved));
		} else {
			showToast("error", t(localizationConstants.worktimeGroupToastRejected));
		}

		setConfirmAction(null);
	}, [confirmAction, t]);

	const handleRemind = useCallback(
		(_employeeId: string) => {
			showToast("info", t(localizationConstants.worktimeGroupToastReminded));
		},
		[t]
	);

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
		projectData,
		filteredProjects,
		expandedProjects,
		filteredProjectGanttRows,
		confirmAction,
		handleTabChange,
		handleGroupByModeChange,
		handleToggleEmployee,
		handleToggleProject,
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
		handleResetThisWeek,
	};
}
