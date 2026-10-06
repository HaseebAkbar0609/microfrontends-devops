"use client";

import { useState, useMemo, useCallback } from "react";
import {
	WorktimeProjectGroupData,
	ProjectGroupSummary,
} from "../types/worktimeGroup.types";
import { initialWorktimeProjectData } from "../constants/worktimeProjectGroup.mock";

interface UseWorktimeProjectGroupProps {
	searchQuery: string;
	showExceptionsOnly: boolean;
}

export function useWorktimeProjectGroup({
	searchQuery,
	showExceptionsOnly,
}: UseWorktimeProjectGroupProps) {
	const [projectData] = useState<WorktimeProjectGroupData>(
		initialWorktimeProjectData
	);

	// Expanded state for list view (default Projekt 2025-001 expanded as in Figma Image 2)
	const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
		"proj-1": true,
	});

	const handleToggleProject = useCallback((projectId: string) => {
		setExpandedProjects((prev) => ({
			...prev,
			[projectId]: !prev[projectId],
		}));
	}, []);

	const handleExpandAllProjects = useCallback(() => {
		const allExpanded: Record<string, boolean> = {};
		projectData.projects.forEach((p) => {
			allExpanded[p.id] = true;
		});
		setExpandedProjects(allExpanded);
	}, [projectData.projects]);

	const handleCollapseAllProjects = useCallback(() => {
		setExpandedProjects({});
	}, []);

	// Filtered projects list based on search and exception toggle
	const filteredProjects = useMemo(() => {
		return projectData.projects.filter((proj: ProjectGroupSummary) => {
			if (showExceptionsOnly && !proj.hasDeviation && (!proj.flags || proj.flags <= 0)) {
				return false;
			}
			if (searchQuery.trim() !== "") {
				const q = searchQuery.toLowerCase();
				const matchName = proj.name.toLowerCase().includes(q);
				const matchCode = proj.code.toLowerCase().includes(q);
				const matchCustomer = proj.customer.toLowerCase().includes(q);
				const matchEmp = proj.employees.some(
					(e) =>
						e.name.toLowerCase().includes(q) ||
						e.empCode.toLowerCase().includes(q)
				);
				if (!matchName && !matchCode && !matchCustomer && !matchEmp) {
					return false;
				}
			}
			return true;
		});
	}, [projectData.projects, showExceptionsOnly, searchQuery]);

	// Filtered gantt rows matching filtered projects (search & Undantag exceptions)
	const filteredGanttRows = useMemo(() => {
		const allowedProjectIds = new Set(filteredProjects.map((p) => p.id));
		const allowedCodes = new Set(filteredProjects.map((p) => p.code));
		return projectData.ganttRows.filter(
			(row) =>
				allowedProjectIds.has(row.id) ||
				(row.projectId && allowedProjectIds.has(row.projectId)) ||
				allowedCodes.has(row.code)
		);
	}, [projectData.ganttRows, filteredProjects]);

	// Dynamically derived totals computed from active filtered projects
	const computedTotals = useMemo(() => {
		const totalLogged = filteredProjects.reduce((sum, p) => sum + (p.loggedHours || 0), 0);
		const totalOt = filteredProjects.reduce((sum, p) => sum + (p.otHours || 0), 0);
		const totalAta = filteredProjects.reduce((sum, p) => sum + (p.ataHours || 0), 0);

		return {
			totalLogged: Number(totalLogged.toFixed(1)),
			totalOt: Number(totalOt.toFixed(1)),
			totalAta: Number(totalAta.toFixed(1)),
			dailyTotals: projectData.totals.dailyTotals,
		};
	}, [filteredProjects, projectData.totals.dailyTotals]);

	return {
		projectData,
		expandedProjects,
		filteredProjects,
		filteredGanttRows,
		computedTotals,
		handleToggleProject,
		handleExpandAllProjects,
		handleCollapseAllProjects,
	};
}
