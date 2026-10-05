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
	} = useWorktimeGroup();

	// In Person Kalendervy & List, 3 employees with timesheets are shown
	const timesheetEmployees = useMemo(() => {
		return filteredEmployees.filter((emp) => emp.days && emp.days.length > 0);
	}, [filteredEmployees]);

	// In Person Gantt view, sort Anna Bergström first
	const ganttEmployees = useMemo(() => {
		return [...filteredEmployees].sort((a, b) => {
			if (a.name === "Anna Bergström") return -1;
			if (b.name === "Anna Bergström") return 1;
			return 0;
		});
	}, [filteredEmployees]);

	const isProjectMode = groupByMode === "project";

	return (
		<div className="space-y-4">
			{/* Top Header: Title, Date Pill, Group Dropdown & Underline Tabs */}
			<WorktimeGroupHeader
				activeTab={activeTab}
				groupByMode={groupByMode}
				dateRange={isProjectMode ? projectData.dateRange : groupData.dateRange}
				onTabChange={handleTabChange}
				onGroupByChange={handleGroupByModeChange}
				onResetWeek={handleResetThisWeek}
			/>

			{/* Filter Toolbar: Undantag, Search, Expand/Collapse (only in Kalender & List) */}
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
						dailyTotals={projectData.totals.dailyTotals}
					/>
				) : (
					<WorktimeGroupCalendarGrid
						employees={timesheetEmployees}
						dailyTotals={groupData.totals.dailyTotals}
					/>
				))}

			{/* Tab 2: List */}
			{activeTab === "list" &&
				(isProjectMode ? (
					<WorktimeProjectListView
						projects={filteredProjects}
						totals={projectData.totals}
						expandedProjects={expandedProjects}
						onToggleExpand={handleToggleProject}
					/>
				) : (
					<WorktimeGroupListView
						employees={timesheetEmployees}
						totals={groupData.totals}
						expandedEmployees={expandedEmployees}
						onToggleExpand={handleToggleEmployee}
						onApproveDay={handleOpenApproveDay}
						onRejectDay={handleOpenRejectDay}
					/>
				))}

			{/* Tab 3: Gantt-schema */}
			{activeTab === "gantt" &&
				(isProjectMode ? (
					<WorktimeProjectGanttView
						ganttRows={projectData.ganttRows}
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

			{/* Bottom Aggregated Metrics Footer */}
			<WorktimeGroupFooterBar
				totalCount={isProjectMode ? filteredProjects.length : 4}
				itemType={isProjectMode ? "project" : "employee"}
				weekNumber={groupData.weekNumber}
				year={groupData.year}
				totalLogged={isProjectMode ? projectData.totals.footerLogged : 164.5}
				totalOt={isProjectMode ? projectData.totals.footerOt : 6.5}
				totalAta={isProjectMode ? projectData.totals.footerAta : 14.5}
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
