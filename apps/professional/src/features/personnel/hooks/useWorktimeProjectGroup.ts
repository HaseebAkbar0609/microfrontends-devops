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

	return {
		projectData,
		expandedProjects,
		filteredProjects,
		handleToggleProject,
		handleExpandAllProjects,
		handleCollapseAllProjects,
	};
}
