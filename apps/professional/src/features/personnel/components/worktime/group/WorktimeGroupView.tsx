"use client";

import React from "react";
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
import { WorktimeOverheadCalendarGrid } from "./overhead/WorktimeOverheadCalendarGrid";
import { WorktimeOverheadListView } from "./overhead/WorktimeOverheadListView";

export function WorktimeGroupView() {
	const {
		activeTab,
		groupByMode,
		selectedDateRange,
		searchQuery,
		showExceptionsOnly,
		ganttTimeRange,
		groupData,
		timesheetEmployees,
		ganttEmployees,
		computedTotals,
		expandedEmployees,
		filteredProjects,
		expandedProjects,
		filteredProjectGanttRows,
		computedProjectTotals,
		expandedOverheadEmployees,
		filteredOverheadEmployees,
		computedOverheadDailyTotals,
		computedOverheadTotals,
		confirmAction,
		handleTabChange,
		handleGroupByModeChange,
		handleToggleEmployee,
		handleToggleProject,
		handleToggleOverheadEmployee,
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
	const isOverheadMode = groupByMode === "overhead";

	const totals = {
		person: computedTotals,
		project: computedProjectTotals,
		overhead: computedOverheadTotals,
	}[groupByMode];

	const footerCount = {
		person: timesheetEmployees.length,
		project: filteredProjects.length,
		overhead: filteredOverheadEmployees.length,
	}[groupByMode];

	const footerLogged = totals.totalLogged;
	const footerOt = totals.totalOt;
	const footerAta = totals.totalAta;

	return (
		<div className="space-y-4">
			{/* Top Header: Title, Date Pill & Group Toggle */}
			<WorktimeGroupHeader
				activeTab={activeTab}
				groupByMode={groupByMode}
				dateRange={selectedDateRange}
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
				(isOverheadMode ? (
					<WorktimeOverheadCalendarGrid
						employees={filteredOverheadEmployees}
						dailyTotals={computedOverheadDailyTotals}
					/>
				) : isProjectMode ? (
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
				(isOverheadMode ? (
					<WorktimeOverheadListView
						employees={filteredOverheadEmployees}
						expandedEmployees={expandedOverheadEmployees}
						onToggleEmployee={handleToggleOverheadEmployee}
						totalOh={computedOverheadTotals.totalOh}
					/>
				) : isProjectMode ? (
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
				!isOverheadMode &&
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
				totalCount={footerCount}
				itemType={isProjectMode ? "project" : "employee"}
				weekNumber={groupData.weekNumber}
				year={groupData.year}
				totalLogged={footerLogged}
				totalOt={footerOt}
				totalAta={footerAta}
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
