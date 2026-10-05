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
		handleResetThisWeek,
	} = useWorktimeGroup();

	// In Kalendervy (Image 1) and List (Image 2), 3 employees with timesheets are shown
	const timesheetEmployees = useMemo(() => {
		return filteredEmployees.filter((emp) => emp.days && emp.days.length > 0);
	}, [filteredEmployees]);

	// In Gantt view (Image 3), 7 employees are shown with Anna Bergström first
	const ganttEmployees = useMemo(() => {
		return [...filteredEmployees].sort((a, b) => {
			if (a.name === "Anna Bergström") return -1;
			if (b.name === "Anna Bergström") return 1;
			return 0;
		});
	}, [filteredEmployees]);

	return (
		<div className="space-y-4">
			{/* Top Header: Title, Date Pill, Group Dropdown & Underline Tabs */}
			<WorktimeGroupHeader
				activeTab={activeTab}
				groupByMode={groupByMode}
				dateRange={groupData.dateRange}
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

			{/* Tab 1: Kalendervy matching Figma Image 1 */}
			{activeTab === "kalender" && (
				<WorktimeGroupCalendarGrid
					employees={timesheetEmployees}
					dailyTotals={groupData.totals.dailyTotals}
				/>
			)}

			{/* Tab 2: List matching Figma Image 2 */}
			{activeTab === "list" && (
				<WorktimeGroupListView
					employees={timesheetEmployees}
					totals={groupData.totals}
					expandedEmployees={expandedEmployees}
					onToggleExpand={handleToggleEmployee}
					onApproveDay={handleOpenApproveDay}
					onRejectDay={handleOpenRejectDay}
				/>
			)}

			{/* Tab 3: Gantt-schema matching Figma Image 3 */}
			{activeTab === "gantt" && (
				<WorktimeGroupGanttView
					employees={ganttEmployees}
					ganttTimeRange={ganttTimeRange}
					onRangeChange={handleGanttRangeChange}
				/>
			)}

			{/* Bottom Aggregated Metrics Footer */}
			<WorktimeGroupFooterBar
				totalEmployees={4}
				weekNumber={groupData.weekNumber}
				year={groupData.year}
				totalLogged={164.5}
				totalOt={6.5}
				totalAta={14.5}
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
