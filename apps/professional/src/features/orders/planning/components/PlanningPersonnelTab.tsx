"use client";

import { useMemo, useState } from "react";
import type {
	PlanningResource,
	PersonnelScheduleItem,
} from "../types/planning.types";
import { usePersonnelPlanning } from "../hooks/usePersonnelPlanning";
import { PersonnelSummaryCards } from "./personnel/PersonnelSummaryCards";
import { PersonnelFilterBar } from "./personnel/PersonnelFilterBar";
import { PersonnelScheduleGrid } from "./personnel/PersonnelScheduleGrid";
import {
	PersonnelCreateTaskModal,
	type PersonnelTaskFormData,
} from "./personnel/PersonnelCreateTaskModal";
import { PersonnelDeleteConfirmModal } from "./personnel/PersonnelDeleteConfirmModal";
import { MOCK_PERSONNEL_TOP_ASSIGNED_ALL } from "../data/personnelPlanning.mock";

interface PlanningPersonnelTabProps {
	resources?: PlanningResource[];
}

export function PlanningPersonnelTab({ resources: _resources }: PlanningPersonnelTabProps) {
	const {
		scheduleItems,
		apiData,
		isSaving,
		employeesList,
		searchQuery,
		setSearchQuery,
		selectedAssignee,
		setSelectedAssignee,
		selectedStatus,
		setSelectedStatus,
		selectedProject,
		setSelectedProject,
		activePopoverId,
		setActivePopoverId,
		handleResetFilters,
		isCreateModalOpen,
		setIsCreateModalOpen,
		editingItem,
		setEditingItem,
		currentMonthKey,
		currentWeekNumber,
		currentYear,
		daysHeader,
		handlePrevWeek,
		handleNextWeek,
		handleCreateTask,
		handleUpdateTask,
		handleDeleteTask,
		handleAddAssignee,
	} = usePersonnelPlanning();

	const handleOpenCreateModal = () => {
		setEditingItem(null);
		setIsCreateModalOpen(true);
	};

	const handleOpenEditModal = (item: PersonnelScheduleItem) => {
		setEditingItem(item);
		setIsCreateModalOpen(true);
	};

	const handleSaveTask = async (formData: PersonnelTaskFormData) => {
		const assigneeIds = formData.assignees && formData.assignees.length > 0
			? formData.assignees.map((a) => a.id)
			: [formData.employeeId];

		if (editingItem) {
			await handleUpdateTask({
				id: editingItem.id,
				title: formData.title,
				dayStart: formData.dayStart,
				daySpan: formData.daySpan,
				colorTheme: formData.colorTheme,
				status: formData.status,
				timeRange: formData.timeRange || "08:00 - 16:00 (8 tim)",
				dateText: formData.dateText || `Måndag ${formData.dayStart} Dec, 2025`,
				assigneeIds,
			});
		} else {
			await handleCreateTask({
				title: formData.title,
				dayStart: formData.dayStart,
				daySpan: formData.daySpan,
				colorTheme: formData.colorTheme,
				status: formData.status,
				timeRange: formData.timeRange || "08:00 - 16:00 (8 tim)",
				dateText: formData.dateText || `Måndag ${formData.dayStart} Dec, 2025`,
				assigneeIds,
			});
		}
	};

	const uniqueProjects = useMemo(() => {
		const projectMap = new Map<string, string>();
		scheduleItems.forEach((item) => {
			if (item.title) {
				const projectKey = item.title.split(" - ")[0] || item.title;
				projectMap.set(projectKey, item.title);
			}
		});
		return Array.from(projectMap.entries()).map(([key, label]) => ({ key, label }));
	}, [scheduleItems]);

	const topEmployees = useMemo(() => {
		if (apiData?.resources && apiData.resources.length > 0) {
			return apiData.resources;
		}
		return MOCK_PERSONNEL_TOP_ASSIGNED_ALL;
	}, [apiData]);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleRequestDelete = (taskId: string) => {
		setTaskToDeleteId(taskId);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (taskToDeleteId) {
			setIsDeleting(true);
			try {
				await handleDeleteTask(taskToDeleteId);
				setIsDeleteModalOpen(false);
				setTaskToDeleteId(null);
			} finally {
				setIsDeleting(false);
			}
		}
	};

	return (
		<div className="flex flex-col gap-5 w-full font-sans text-slate-900 pb-12">
			{/* 1. Top Summary Cards */}
			<PersonnelSummaryCards
				topEmployees={topEmployees}
				statistics={apiData?.statistics}
				dateRangeText="10/12/2025 - 17/12/2025"
			/>

			{/* 2. Filter Bar */}
			<PersonnelFilterBar
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				selectedStatus={selectedStatus}
				setSelectedStatus={setSelectedStatus}
				selectedAssignee={selectedAssignee}
				setSelectedAssignee={setSelectedAssignee}
				selectedProject={selectedProject}
				setSelectedProject={setSelectedProject}
				uniqueProjects={uniqueProjects}
				employeesList={employeesList}
				onResetFilters={handleResetFilters}
			/>

			{/* 3. 7-Day Hourly Timeline Grid */}
			<PersonnelScheduleGrid
				currentMonthKey={currentMonthKey}
				currentYear={currentYear}
				currentWeekNumber={currentWeekNumber}
				daysHeader={daysHeader}
				employeesList={employeesList}
				searchQuery={searchQuery}
				selectedStatus={selectedStatus}
				selectedAssignee={selectedAssignee}
				selectedProject={selectedProject}
				activePopoverId={activePopoverId}
				setActivePopoverId={setActivePopoverId}
				onPrevWeek={handlePrevWeek}
				onNextWeek={handleNextWeek}
				onOpenCreateModal={handleOpenCreateModal}
				onOpenEditModal={handleOpenEditModal}
				onDeleteTask={handleRequestDelete}
				onAddAssignee={(item, assignee) => handleAddAssignee(item, assignee)}
			/>

			{/* 4. Create / Edit Slide-over Sheet */}
			<PersonnelCreateTaskModal
				isOpen={isCreateModalOpen}
				onOpenChange={setIsCreateModalOpen}
				editingItem={editingItem}
				onSave={handleSaveTask}
				isSaving={isSaving}
				employeesList={employeesList}
				daysHeader={daysHeader}
			/>

			{/* 5. Delete Confirmation Dialog */}
			<PersonnelDeleteConfirmModal
				isOpen={isDeleteModalOpen}
				onOpenChange={setIsDeleteModalOpen}
				onConfirm={handleConfirmDelete}
				isDeleting={isDeleting}
			/>
		</div>
	);
}

export default PlanningPersonnelTab;
