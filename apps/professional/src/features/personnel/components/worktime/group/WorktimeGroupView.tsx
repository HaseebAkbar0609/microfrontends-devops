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
		handleRemind,
		handlePrevWeek,
		handleNextWeek,
	} = useWorktimeGroup();

	// Timesheet employees with logged days
	const timesheetEmployees = useMemo(() => {
		return filteredEmployees.filter((emp) => emp.days && emp.days.length > 0);
	}, [filteredEmployees]);

	// Alphabetically sorted employees for Gantt schedule
	const ganttEmployees = useMemo(() => {
		return [...filteredEmployees].sort((a, b) => a.name.localeCompare(b.name));
	}, [filteredEmployees]);

	// Dynamically derived totals computed from active filtered employees
	const computedTotals = useMemo(() => {
		const totalLogged = filteredEmployees.reduce((sum, emp) => sum + (emp.loggedHours || 0), 0);
		const totalOt = filteredEmployees.reduce((sum, emp) => sum + (emp.otHours || 0), 0);
		const totalAta = filteredEmployees.reduce((sum, emp) => sum + (emp.ataHours || 0), 0);
		const totalPlanned = filteredEmployees.reduce((sum, emp) => sum + (emp.plannedHours || 0), 0);
		const totalTravel = filteredEmployees.reduce((sum, emp) => sum + (emp.travelKm || 0), 0);

		return {
			totalPlanned,
			totalLogged: Number(totalLogged.toFixed(1)),
			totalOt: Number(totalOt.toFixed(1)),
			totalAta: Number(totalAta.toFixed(1)),
			totalTravel,
			dailyTotals: groupData.totals.dailyTotals,
		};
	}, [filteredEmployees, groupData.totals.dailyTotals]);

	return (
		<div className="space-y-4">
			{/* Top Header: Title, Date Navigator & Underline Tabs */}
			<WorktimeGroupHeader
				activeTab={activeTab}
				groupByMode={groupByMode}
				dateRange={groupData.dateRange}
				onTabChange={handleTabChange}
				onGroupByChange={handleGroupByModeChange}
				onPrevWeek={handlePrevWeek}
				onNextWeek={handleNextWeek}
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
			{activeTab === "kalender" && (
				<WorktimeGroupCalendarGrid
					employees={timesheetEmployees}
					dailyTotals={computedTotals.dailyTotals}
				/>
			)}

			{/* Tab 2: Lista */}
			{activeTab === "list" && (
				<WorktimeGroupListView
					employees={timesheetEmployees}
					totals={computedTotals}
					expandedEmployees={expandedEmployees}
					onToggleExpand={handleToggleEmployee}
					onApproveDay={handleOpenApproveDay}
					onRejectDay={handleOpenRejectDay}
					onRemind={handleRemind}
				/>
			)}

			{/* Tab 3: Gantt-schema */}
			{activeTab === "gantt" && (
				<WorktimeGroupGanttView
					employees={ganttEmployees}
					ganttTimeRange={ganttTimeRange}
					onRangeChange={handleGanttRangeChange}
				/>
			)}

			{/* Bottom Aggregated Metrics Footer with Derived Totals */}
			<WorktimeGroupFooterBar
				totalEmployees={filteredEmployees.length}
				weekNumber={groupData.weekNumber}
				year={groupData.year}
				totalLogged={computedTotals.totalLogged}
				totalOt={computedTotals.totalOt}
				totalAta={computedTotals.totalAta}
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
