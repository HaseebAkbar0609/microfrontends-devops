"use client";

import { useState, useMemo, useCallback } from "react";
import {
	WorktimeOverheadGroupData,
	OverheadEmployeeSummary,
	DailyGroupTotal,
	WorktimeOverheadTotals,
} from "../types/worktimeGroup.types";
import { initialWorktimeOverheadData } from "../constants/worktimeOverheadGroup.mock";

interface UseWorktimeOverheadGroupProps {
	searchQuery: string;
	showExceptionsOnly: boolean;
}

export function useWorktimeOverheadGroup({
	searchQuery,
	showExceptionsOnly,
}: UseWorktimeOverheadGroupProps) {
	const [overheadData] = useState<WorktimeOverheadGroupData>(
		initialWorktimeOverheadData
	);

	// Expanded state for list view (default Erik Andersson expanded matching Figma Image 2)
	const [expandedEmployees, setExpandedEmployees] = useState<Record<string, boolean>>({
		"emp-oh-1": true,
	});

	const handleToggleEmployee = useCallback((employeeId: string) => {
		setExpandedEmployees((prev) => ({
			...prev,
			[employeeId]: !prev[employeeId],
		}));
	}, []);

	const handleExpandAll = useCallback(() => {
		const allExpanded: Record<string, boolean> = {};
		overheadData.employees.forEach((emp) => {
			allExpanded[emp.id] = true;
		});
		setExpandedEmployees(allExpanded);
	}, [overheadData.employees]);

	const handleCollapseAll = useCallback(() => {
		setExpandedEmployees({});
	}, []);

	// Filtered employees list based on search and exception toggle
	const filteredEmployees = useMemo(() => {
		return overheadData.employees.filter((emp: OverheadEmployeeSummary) => {
			if (showExceptionsOnly && !emp.hasDeviation && (!emp.flags || emp.flags <= 0)) {
				return false;
			}
			if (searchQuery.trim() !== "") {
				const q = searchQuery.toLowerCase();
				const matchName = emp.name.toLowerCase().includes(q);
				const matchCode = emp.empCode.toLowerCase().includes(q);
				const matchProject = emp.topProject.toLowerCase().includes(q);
				if (!matchName && !matchCode && !matchProject) {
					return false;
				}
			}
			return true;
		});
	}, [overheadData.employees, showExceptionsOnly, searchQuery]);

	// Dynamically compute daily column totals strictly from active filtered employees
	const computedDailyTotals = useMemo<DailyGroupTotal[]>(() => {
		return overheadData.totals.dailyTotals.map((col) => {
			const dayIndex = col.dayIndex;
			let totalHours = 0;

			filteredEmployees.forEach((emp) => {
				const day = emp.days?.find((d) => d.dayIndex === dayIndex);
				if (day) {
					totalHours += day.ohHours || 0;
				}
			});

			return {
				...col,
				totalHours,
				otHours: totalHours,
			};
		});
	}, [filteredEmployees, overheadData.totals.dailyTotals]);

	// Dynamically compute totals from filtered employees
	const computedTotals = useMemo<WorktimeOverheadTotals>(() => {
		const totalOh = filteredEmployees.reduce((sum, emp) => sum + (emp.totalOhHours || 0), 0);
		const totalLogged = filteredEmployees.reduce((sum, emp) => sum + (emp.loggedHours || 0), 0);

		return {
			totalOh: Number(totalOh.toFixed(1)),
			totalLogged: Number(totalLogged.toFixed(1)),
			totalOt: Number(totalOh.toFixed(1)),
			totalAta: 2,
			dailyTotals: computedDailyTotals,
		};
	}, [filteredEmployees, computedDailyTotals]);

	return {
		overheadData,
		expandedEmployees,
		filteredEmployees,
		computedDailyTotals,
		computedTotals,
		handleToggleEmployee,
		handleExpandAll,
		handleCollapseAll,
	};
}
