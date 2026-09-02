"use client";

import { useMemo } from "react";
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
import { EVA_MENDES_AVATAR } from "../data/personnelPlanning.mock";

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
		if (editingItem) {
			await handleUpdateTask({
				id: editingItem.id,
				title: formData.title,
				dayStart: formData.dayStart,
				daySpan: formData.daySpan,
				colorTheme: formData.colorTheme,
				status: formData.status,
				timeRange: "08:00 - 16:00 (8 tim)",
				dateText: `Måndag ${formData.dayStart} Dec, 2025`,
				assigneeIds: [formData.employeeId],
			});
		} else {
			await handleCreateTask({
				title: formData.title,
				dayStart: formData.dayStart,
				daySpan: formData.daySpan,
				colorTheme: formData.colorTheme,
				status: formData.status,
				timeRange: "08:00 - 16:00 (8 tim)",
				dateText: `Måndag ${formData.dayStart} Dec, 2025`,
				assigneeIds: [formData.employeeId],
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
		return [
			{ id: "emp-1", name: "Göran Andersson", initials: "GA", role: "Snickare", totalHours: 40, allocatedHours: 32, percentage: 70 },
			{ id: "emp-2", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR, role: "Projektledare", totalHours: 20, allocatedHours: 12, percentage: 40 },
			{ id: "emp-3", name: "Anders Larsson", initials: "AB", role: "Elektriker", totalHours: 10, allocatedHours: 4, percentage: 20 },
			{ id: "emp-4", name: "Sara Nilsson", initials: "SN", role: "Målare", totalHours: 19, allocatedHours: 10, percentage: 40 },
		];
	}, [apiData]);

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
				onDeleteTask={handleDeleteTask}
				onAddAssignee={(item, assignee) => handleAddAssignee(item, assignee)}
			/>

			{/* 4. Create / Edit Modal Dialog */}
			<PersonnelCreateTaskModal
				isOpen={isCreateModalOpen}
				onOpenChange={setIsCreateModalOpen}
				editingItem={editingItem}
				onSave={handleSaveTask}
				isSaving={isSaving}
				employeesList={employeesList}
				daysHeader={daysHeader}
			/>
		</div>
	);
}

export default PlanningPersonnelTab;
