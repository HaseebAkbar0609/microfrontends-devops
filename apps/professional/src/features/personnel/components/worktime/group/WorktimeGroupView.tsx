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
		searchQuery,
		showExceptionsOnly,
		ganttTimeRange,
		groupData,
		filteredEmployees,
		expandedEmployees,
		confirmAction,
		handleTabChange,
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
	} = useWorktimeGroup();

	// Timesheet employees with logged days
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

	return (
		<div className="space-y-4">
			{/* Top Header: Title, Date Pill & Underline Tabs */}
			<WorktimeGroupHeader
				activeTab={activeTab}
				dateRange={groupData.dateRange}
				onTabChange={handleTabChange}
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
				totalEmployees={timesheetEmployees.length}
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
