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
import { useWorktimeProjectGroup } from "./useWorktimeProjectGroup";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";

export function useWorktimeGroup() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<GroupViewTab>("kalender");
	const [groupByMode, setGroupByMode] = useState<GroupByMode>("project");
	const [searchQuery, setSearchQuery] = useState("");
	const [showExceptionsOnly, setShowExceptionsOnly] = useState(false);
	const [ganttTimeRange, setGanttTimeRange] = useState<GanttTimeRange>("vecka");
	const [groupData, setGroupData] = useState<WorktimeGroupData>(
		initialWorktimeGroupData
	);

	// Project Group Sub-hook
	const {
		projectData,
		expandedProjects,
		filteredProjects,
		handleToggleProject,
		handleExpandAllProjects,
		handleCollapseAllProjects,
	} = useWorktimeProjectGroup({ searchQuery, showExceptionsOnly });

	// Expanded state for list view (default employee 1 expanded as in Figma)
	const [expandedEmployees, setExpandedEmployees] = useState<
		Record<string, boolean>
	>({
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
		if (groupByMode === "project") {
			handleExpandAllProjects();
		} else {
			const expanded: Record<string, boolean> = {};
			groupData.employees.forEach((emp) => {
				expanded[emp.id] = true;
			});
			setExpandedEmployees(expanded);
		}
	}, [groupByMode, handleExpandAllProjects, groupData.employees]);

	const handleCollapseAll = useCallback(() => {
		if (groupByMode === "project") {
			handleCollapseAllProjects();
		} else {
			setExpandedEmployees({});
		}
	}, [groupByMode, handleCollapseAllProjects]);

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
						actionStatus: (action === "approve"
							? "approved"
							: "rejected") as "approved" | "rejected",
						status: (action === "approve"
							? "approved"
							: "rejected") as "approved" | "rejected",
					};
				});

				const allApproved = updatedDays.every((d) => d.status === "approved");
				return {
					...emp,
					days: updatedDays,
					status: allApproved ? ("godkand" as const) : emp.status,
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
		handleResetThisWeek,
	};
}
