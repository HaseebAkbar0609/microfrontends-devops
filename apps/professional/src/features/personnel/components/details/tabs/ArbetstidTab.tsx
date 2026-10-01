"use client";

import React from "react";
import { useWorktime } from "@/features/personnel/hooks/useWorktime";
import { WorktimeHeaderToolbar } from "./arbetstid/header/WorktimeHeaderToolbar";
import { WorktimeCalendarView } from "./arbetstid/calendar/WorktimeCalendarView";
import { WorktimeTableView } from "./arbetstid/table/WorktimeTableView";
import { WorktimeApprovalDialog } from "./arbetstid/dialogs/WorktimeApprovalDialog";
import { AddWorktimeObjectModal } from "./arbetstid/dialogs/AddWorktimeObjectModal";

interface ArbetstidTabProps {
	employeeName?: string;
}

export function ArbetstidTab({ employeeName = "Anna Svensson" }: ArbetstidTabProps) {
	const {
		subModule,
		viewMode,
		timesheet,
		dayColumns,
		isComparisonOn,
		expandedDays,
		confirmAction,
		addObjectModalOpen,
		handleSelectSubModule,
		handleToggleView,
		handleToggleComparison,
		handleToggleDay,
		handleOpenApproveDialog,
		handleOpenReturnDialog,
		handleCloseConfirmDialog,
		handleConfirmAction,
		handleOpenAddObjectModal,
		handleCloseAddObjectModal,
		handleSaveNewAllocation,
		handleDeleteAllocation,
		handlePrevWeek,
		handleNextWeek,
		handleResetThisWeek,
	} = useWorktime(employeeName);

	return (
		<div className="space-y-6">
			{/* Top Header & Controls */}
			<WorktimeHeaderToolbar
				employeeName={timesheet.employeeName}
				employeeId={timesheet.employeeId}
				weekNumber={timesheet.weekNumber}
				year={timesheet.year}
				dateRange={timesheet.dateRange}
				status={timesheet.status}
				viewMode={viewMode}
				subModule={subModule}
				onToggleView={handleToggleView}
				onSelectSubModule={handleSelectSubModule}
				onApprove={handleOpenApproveDialog}
				onReturn={handleOpenReturnDialog}
				onPrevWeek={handlePrevWeek}
				onNextWeek={handleNextWeek}
				onResetWeek={handleResetThisWeek}
			/>

			{/* Calendar or Table View */}
			{viewMode === "calendar" ? (
				<WorktimeCalendarView
					dayColumns={dayColumns}
					events={timesheet.calendarEvents}
				/>
			) : (
				<WorktimeTableView
					timesheet={timesheet}
					isComparisonOn={isComparisonOn}
					expandedDays={expandedDays}
					onToggleComparison={handleToggleComparison}
					onToggleDay={handleToggleDay}
					onAddObject={handleOpenAddObjectModal}
					onDeleteAllocation={handleDeleteAllocation}
				/>
			)}

			{/* Approval / Return Confirmation Dialog */}
			<WorktimeApprovalDialog
				action={confirmAction}
				isOpen={confirmAction !== null}
				onClose={handleCloseConfirmDialog}
				onConfirm={handleConfirmAction}
			/>

			{/* Add Project Object Modal */}
			<AddWorktimeObjectModal
				isOpen={addObjectModalOpen}
				onClose={handleCloseAddObjectModal}
				onSave={handleSaveNewAllocation}
			/>
		</div>
	);
}
