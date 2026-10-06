"use client";

import React, { useMemo } from "react";
import { useWorktimeGroup } from "@/features/personnel/hooks/useWorktimeGroup";
import { WorktimeGroupHeader } from "./WorktimeGroupHeader";
import { WorktimeGroupToolbar } from "./WorktimeGroupToolbar";
import { WorktimeGroupCalendarGrid } from "./WorktimeGroupCalendarGrid";
import { WorktimeGroupListView } from "./WorktimeGroupListView";
import { WorktimeGroupGanttView } from "./WorktimeGroupGanttView";
import { WorktimeGroupFooterBar } from "./WorktimeGroupFooterBar";
import { WorktimeGroupConfirmDialog } from "./WorktimeGroupConfirmDialog";
import { WorktimeProjectCalendarGrid } from "./project/WorktimeProjectCalendarGrid";
import { WorktimeProjectListView } from "./project/WorktimeProjectListView";
import { WorktimeProjectGanttView } from "./project/WorktimeProjectGanttView";

export function WorktimeGroupView() {
	const {
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
	} = useWorktimeGroup();

	const isProjectMode = groupByMode === "project";

	// Timesheet employees with logged days (matches rendered rows in calendar & list)
	const timesheetEmployees = useMemo(() => {
		return filteredEmployees.filter((emp) => emp.days && emp.days.length > 0);
	}, [filteredEmployees]);

	// Alphabetically sorted employees for Gantt schedule
	const ganttEmployees = useMemo(() => {
		return [...filteredEmployees].sort((a, b) => a.name.localeCompare(b.name));
	}, [filteredEmployees]);

	// Dynamically derived totals computed from active timesheet employees
	const computedTotals = useMemo(() => {
		const totalLogged = timesheetEmployees.reduce((sum, emp) => sum + (emp.loggedHours || 0), 0);
		const totalOt = timesheetEmployees.reduce((sum, emp) => sum + (emp.otHours || 0), 0);
		const totalAta = timesheetEmployees.reduce((sum, emp) => sum + (emp.ataHours || 0), 0);
		const totalPlanned = timesheetEmployees.reduce((sum, emp) => sum + (emp.plannedHours || 0), 0);
		const totalTravel = timesheetEmployees.reduce((sum, emp) => sum + (emp.travelKm || 0), 0);

		return {
			totalPlanned,
			totalLogged: Number(totalLogged.toFixed(1)),
			totalOt: Number(totalOt.toFixed(1)),
			totalAta: Number(totalAta.toFixed(1)),
			totalTravel,
			dailyTotals: groupData.totals.dailyTotals,
		};
	}, [timesheetEmployees, groupData.totals.dailyTotals]);

	// Dynamically derived totals computed from active filtered projects
	const computedProjectTotals = useMemo(() => {
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

	return (
		<div className="space-y-4">
			{/* Top Header: Title, Date Pill & Group Toggle */}
			<WorktimeGroupHeader
				activeTab={activeTab}
				groupByMode={groupByMode}
				dateRange={isProjectMode ? projectData.dateRange : groupData.dateRange}
				onTabChange={handleTabChange}
				onGroupByChange={handleGroupByModeChange}
			/>

			{/* Filter Toolbar: Undantag, Search, Expand/Collapse */}
			{activeTab !== "gantt" && (
				<WorktimeGroupToolbar
					searchQuery={searchQuery}
					showExceptionsOnly={showExceptionsOnly}
					onSearchChange={handleSearchChange}
					onToggleExceptions={handleToggleExceptions}
					onExpandAll={handleExpandAll}
					onCollapseAll={handleCollapseAll}
					showExpandCollapse={true}
				/>
			)}

			{/* Tab 1: Kalendervy */}
			{activeTab === "kalender" &&
				(isProjectMode ? (
					<WorktimeProjectCalendarGrid
						projects={filteredProjects}
						dailyTotals={computedProjectTotals.dailyTotals}
					/>
				) : (
					<WorktimeGroupCalendarGrid
						employees={timesheetEmployees}
						dailyTotals={computedTotals.dailyTotals}
					/>
				))}

			{/* Tab 2: Lista */}
			{activeTab === "list" &&
				(isProjectMode ? (
					<WorktimeProjectListView
						projects={filteredProjects}
						totals={computedProjectTotals}
						expandedProjects={expandedProjects}
						onToggleExpand={handleToggleProject}
					/>
				) : (
					<WorktimeGroupListView
						employees={timesheetEmployees}
						totals={computedTotals}
						expandedEmployees={expandedEmployees}
						onToggleExpand={handleToggleEmployee}
						onApproveDay={handleOpenApproveDay}
						onRejectDay={handleOpenRejectDay}
						onRemind={handleRemind}
					/>
				))}

			{/* Tab 3: Gantt-schema */}
			{activeTab === "gantt" &&
				(isProjectMode ? (
					<WorktimeProjectGanttView
						ganttRows={filteredProjectGanttRows}
						ganttTimeRange={ganttTimeRange}
						onRangeChange={handleGanttRangeChange}
					/>
				) : (
					<WorktimeGroupGanttView
						employees={ganttEmployees}
						ganttTimeRange={ganttTimeRange}
						onRangeChange={handleGanttRangeChange}
					/>
				))}

			{/* Bottom Aggregated Metrics Footer with Derived Totals */}
			<WorktimeGroupFooterBar
				totalCount={isProjectMode ? filteredProjects.length : timesheetEmployees.length}
				itemType={isProjectMode ? "project" : "employee"}
				weekNumber={groupData.weekNumber}
				year={groupData.year}
				totalLogged={isProjectMode ? computedProjectTotals.totalLogged : computedTotals.totalLogged}
				totalOt={isProjectMode ? computedProjectTotals.totalOt : computedTotals.totalOt}
				totalAta={isProjectMode ? computedProjectTotals.totalAta : computedTotals.totalAta}
			/>

			{/* Safe Confirmation Dialog */}
			<WorktimeGroupConfirmDialog
				action={confirmAction ? confirmAction.action : null}
				isOpen={confirmAction !== null}
				onClose={handleCloseConfirmDialog}
				onConfirm={handleConfirmDayAction}
			/>
		</div>
	);
}
