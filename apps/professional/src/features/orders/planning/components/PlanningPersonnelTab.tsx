"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
	startOfWeek,
	addDays,
	addWeeks,
	subWeeks,
	getISOWeek,
	format,
} from "date-fns";
import type {
	PlanningResource,
	PersonnelScheduleItem,
	PlanningStatus,
	PlanningAssignee,
	PlanningResponse,
} from "../types/planning.types";
import {
	getPlanning,
	createPlanningTask,
	updatePlanningTask,
	deletePlanningTask,
} from "../api/planning.api";
import { MOCK_PLANNING_RESPONSE } from "../data/planning.mock";
import { PersonnelSummaryCards } from "./personnel/PersonnelSummaryCards";
import { PersonnelFilterBar } from "./personnel/PersonnelFilterBar";
import { PersonnelScheduleGrid } from "./personnel/PersonnelScheduleGrid";
import {
	PersonnelCreateTaskModal,
	type PersonnelTaskFormData,
} from "./personnel/PersonnelCreateTaskModal";

interface PlanningPersonnelTabProps {
	resources?: PlanningResource[];
}

const EVA_MENDES_AVATAR =
	"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120";

const INITIAL_SCHEDULE_ITEMS: PersonnelScheduleItem[] = [
	{
		id: "item-1",
		employeeId: "emp-1",
		employeeName: "Göran Andersson",
		employeeInitials: "GA",
		title: "Order 5000 - Badrum",
		dayStart: 10,
		daySpan: 1,
		colorTheme: "yellow",
		hasLeftBar: true,
		status: "completed",
		timeRange: "10:00 - 18:00 (8 tim)",
		dateText: "Måndag 10 Dec, 2025",
		assignees: [
			{ id: "u-3", name: "Anders Larsson", initials: "AB", hours: 8 },
			{ id: "u-2", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR, hours: 6 },
		],
	},
	{
		id: "item-2",
		employeeId: "emp-1",
		employeeName: "Göran Andersson",
		employeeInitials: "GA",
		title: "Order 5000 - Badrum",
		dayStart: 10,
		daySpan: 1,
		colorTheme: "blue",
		hasLeftBar: true,
		status: "in_progress",
		timeRange: "08:00 - 16:00 (8 tim)",
		dateText: "Måndag 10 Dec, 2025",
		assignees: [{ id: "u-1", name: "Göran Andersson", initials: "GA", hours: 8 }],
	},
	{
		id: "item-3",
		employeeId: "emp-1",
		employeeName: "Göran Andersson",
		employeeInitials: "GA",
		title: "Order 5000 - Badrum",
		dayStart: 12,
		daySpan: 1,
		colorTheme: "purple",
		hasLeftBar: true,
		status: "in_progress",
		timeRange: "08:00 - 16:00 (8 tim)",
		dateText: "Onsdag 12 Dec, 2025",
		assignees: [{ id: "u-1", name: "Göran Andersson", initials: "GA", hours: 8 }],
	},
	{
		id: "item-4",
		employeeId: "emp-1",
		employeeName: "Göran Andersson",
		employeeInitials: "GA",
		title: "Order 5000 - Badrum",
		dayStart: 13,
		daySpan: 2,
		colorTheme: "blue",
		hasLeftBar: true,
		status: "in_progress",
		timeRange: "08:00 - 17:00 (16 tim)",
		dateText: "13-14 Dec, 2025",
		assignees: [{ id: "u-1", name: "Göran Andersson", initials: "GA", hours: 16 }],
	},
	{
		id: "item-5",
		employeeId: "emp-1",
		employeeName: "Göran Andersson",
		employeeInitials: "GA",
		title: "Order 5000 - Badrum",
		dayStart: 15,
		daySpan: 1,
		colorTheme: "pink",
		hasLeftBar: true,
		status: "not_started",
		timeRange: "09:00 - 15:00 (6 tim)",
		dateText: "Lördag 15 Dec, 2025",
		assignees: [{ id: "u-1", name: "Göran Andersson", initials: "GA", hours: 6 }],
	},
	{
		id: "item-6",
		employeeId: "emp-1",
		employeeName: "Göran Andersson",
		employeeInitials: "GA",
		title: "Order 5000 - Badrum",
		dayStart: 16,
		daySpan: 1,
		colorTheme: "purple",
		hasLeftBar: true,
		status: "in_progress",
		timeRange: "10:00 - 16:00 (6 tim)",
		dateText: "Söndag 16 Dec, 2025",
		assignees: [{ id: "u-1", name: "Göran Andersson", initials: "GA", hours: 6 }],
	},
	{
		id: "item-7",
		employeeId: "emp-2",
		employeeName: "Eva Mendes",
		employeeInitials: "EM",
		employeeAvatarUrl: EVA_MENDES_AVATAR,
		title: "Order 5000 - Badrum",
		dayStart: 10,
		daySpan: 2,
		colorTheme: "green",
		hasLeftBar: true,
		status: "completed",
		timeRange: "08:00 - 17:00 (16 tim)",
		dateText: "10-11 Dec, 2025",
		assignees: [{ id: "u-2", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR, hours: 16 }],
	},
	{
		id: "item-8",
		employeeId: "emp-2",
		employeeName: "Eva Mendes",
		employeeInitials: "EM",
		employeeAvatarUrl: EVA_MENDES_AVATAR,
		title: "Order 5000 - Badrum",
		dayStart: 13,
		daySpan: 2,
		colorTheme: "light-purple",
		hasLeftBar: false,
		status: "in_progress",
		timeRange: "08:00 - 17:00 (16 tim)",
		dateText: "13-14 Dec, 2025",
		assignees: [{ id: "u-2", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR, hours: 16 }],
	},
	{
		id: "item-9",
		employeeId: "emp-3",
		employeeName: "Anders Larsson",
		employeeInitials: "AB",
		title: "Order 5000 - Badrum",
		dayStart: 10,
		daySpan: 1,
		colorTheme: "blue",
		hasLeftBar: false,
		status: "in_progress",
		timeRange: "08:00 - 16:00 (8 tim)",
		dateText: "Måndag 10 Dec, 2025",
		assignees: [{ id: "u-3", name: "Anders Larsson", initials: "AB", hours: 8 }],
	},
	{
		id: "item-10",
		employeeId: "emp-3",
		employeeName: "Anders Larsson",
		employeeInitials: "AB",
		title: "Order 5000 - Badrum",
		dayStart: 13,
		daySpan: 4,
		colorTheme: "blue",
		hasLeftBar: false,
		status: "in_progress",
		timeRange: "08:00 - 17:00 (32 tim)",
		dateText: "13-16 Dec, 2025",
		assignees: [{ id: "u-3", name: "Anders Larsson", initials: "AB", hours: 32 }],
	},
	{
		id: "item-11",
		employeeId: "emp-4",
		employeeName: "Eva Mendes",
		employeeInitials: "EM",
		employeeAvatarUrl: EVA_MENDES_AVATAR,
		title: "Order 5000 - Badrum",
		dayStart: 10,
		daySpan: 1,
		colorTheme: "yellow",
		hasLeftBar: false,
		status: "in_progress",
		timeRange: "08:00 - 16:00 (8 tim)",
		dateText: "Måndag 10 Dec, 2025",
		assignees: [{ id: "u-2", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR, hours: 8 }],
	},
	{
		id: "item-12",
		employeeId: "emp-4",
		employeeName: "Eva Mendes",
		employeeInitials: "EM",
		employeeAvatarUrl: EVA_MENDES_AVATAR,
		title: "Order 5000 - Badrum",
		dayStart: 13,
		daySpan: 4,
		colorTheme: "light-yellow",
		hasLeftBar: false,
		status: "in_progress",
		timeRange: "08:00 - 17:00 (32 tim)",
		dateText: "13-16 Dec, 2025",
		assignees: [{ id: "u-2", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR, hours: 32 }],
	},
	{
		id: "item-13",
		employeeId: "emp-5",
		employeeName: "Anders Larsson",
		employeeInitials: "AB",
		title: "Order 5000 - Badrum",
		dayStart: 10,
		daySpan: 2,
		colorTheme: "green",
		hasLeftBar: true,
		status: "completed",
		timeRange: "08:00 - 17:00 (16 tim)",
		dateText: "10-11 Dec, 2025",
		assignees: [{ id: "u-3", name: "Anders Larsson", initials: "AB", hours: 16 }],
	},
	{
		id: "item-14",
		employeeId: "emp-5",
		employeeName: "Anders Larsson",
		employeeInitials: "AB",
		title: "Order 5000 - Badrum",
		dayStart: 13,
		daySpan: 2,
		colorTheme: "green",
		hasLeftBar: false,
		status: "completed",
		timeRange: "08:00 - 17:00 (16 tim)",
		dateText: "13-14 Dec, 2025",
		assignees: [{ id: "u-3", name: "Anders Larsson", initials: "AB", hours: 16 }],
	},
	{
		id: "item-15",
		employeeId: "emp-6",
		employeeName: "Eva Mendes",
		employeeInitials: "EM",
		employeeAvatarUrl: EVA_MENDES_AVATAR,
		title: "Order 5000 - Badrum",
		dayStart: 10,
		daySpan: 1,
		colorTheme: "blue",
		hasLeftBar: true,
		status: "in_progress",
		timeRange: "08:00 - 16:00 (8 tim)",
		dateText: "Måndag 10 Dec, 2025",
		assignees: [{ id: "u-2", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR, hours: 8 }],
	},
	{
		id: "item-16",
		employeeId: "emp-6",
		employeeName: "Eva Mendes",
		employeeInitials: "EM",
		employeeAvatarUrl: EVA_MENDES_AVATAR,
		title: "Order 5000 - Badrum",
		dayStart: 11,
		daySpan: 1,
		colorTheme: "blue",
		hasLeftBar: false,
		status: "in_progress",
		timeRange: "08:00 - 16:00 (8 tim)",
		dateText: "Tisdag 11 Dec, 2025",
		assignees: [{ id: "u-3", name: "Anders Larsson", initials: "AB", hours: 8 }],
	},
	{
		id: "item-17",
		employeeId: "emp-7",
		employeeName: "Anders Larsson",
		employeeInitials: "AB",
		title: "Order 5000 - Badrum",
		dayStart: 13,
		daySpan: 1,
		colorTheme: "blue",
		hasLeftBar: true,
		status: "in_progress",
		timeRange: "08:00 - 16:00 (8 tim)",
		dateText: "Torsdag 13 Dec, 2025",
		assignees: [{ id: "u-3", name: "Anders Larsson", initials: "AB", hours: 8 }],
	},
	{
		id: "item-18",
		employeeId: "emp-7",
		employeeName: "Anders Larsson",
		employeeInitials: "AB",
		title: "Order 5000 - Badrum",
		dayStart: 15,
		daySpan: 1,
		colorTheme: "blue",
		hasLeftBar: true,
		status: "in_progress",
		timeRange: "08:00 - 16:00 (8 tim)",
		dateText: "Lördag 15 Dec, 2025",
		assignees: [{ id: "u-3", name: "Anders Larsson", initials: "AB", hours: 8 }],
	},
];

const EMPLOYEES = [
	{ id: "emp-1", name: "Göran Andersson", initials: "GA" },
	{ id: "emp-2", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR },
	{ id: "emp-3", name: "Anders Larsson", initials: "AB" },
	{ id: "emp-4", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR },
	{ id: "emp-5", name: "Anders Larsson", initials: "AB" },
	{ id: "emp-6", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR },
	{ id: "emp-7", name: "Anders Larsson", initials: "AB" },
];

const DAY_NAME_KEYS = [
	"weekdayFullMon",
	"weekdayFullTue",
	"weekdayFullWed",
	"weekdayFullThu",
	"weekdayFullFri",
	"weekdayFullSat",
	"weekdayFullSun",
] as const;

const MONTH_NAME_KEYS = [
	"monthJanuary",
	"monthFebruary",
	"monthMarch",
	"monthApril",
	"monthMay",
	"monthJune",
	"monthJuly",
	"monthAugust",
	"monthSeptember",
	"monthOctober",
	"monthNovember",
	"monthDecember",
] as const;

export function PlanningPersonnelTab({ resources: _resources }: PlanningPersonnelTabProps) {
	const [scheduleItems, setScheduleItems] = useState<PersonnelScheduleItem[]>(INITIAL_SCHEDULE_ITEMS);
	const [apiData, setApiData] = useState<PlanningResponse | null>(null);
	const [, setIsLoading] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [selectedProject, setSelectedProject] = useState<string>("all");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<PersonnelScheduleItem | null>(null);

	// Date Navigation State
	const [currentWeekStart, setCurrentWeekStart] = useState(() =>
		startOfWeek(new Date(2025, 11, 10), { weekStartsOn: 1 })
	);

	const daysHeader = useMemo(() => {
		return Array.from({ length: 7 }, (_, i) => {
			const d = addDays(currentWeekStart, i);
			return { dayNumber: d.getDate(), dayNameKey: DAY_NAME_KEYS[i] };
		});
	}, [currentWeekStart]);

	const currentMonthKey = useMemo(
		() => MONTH_NAME_KEYS[currentWeekStart.getMonth()],
		[currentWeekStart]
	);
	const currentWeekNumber = useMemo(() => getISOWeek(currentWeekStart), [currentWeekStart]);
	const currentYear = useMemo(() => currentWeekStart.getFullYear(), [currentWeekStart]);

	const handlePrevWeek = () => {
		setCurrentWeekStart((prev) => subWeeks(prev, 1));
	};
	const handleNextWeek = () => {
		setCurrentWeekStart((prev) => addWeeks(prev, 1));
	};

	const employeesList = useMemo(() => {
		if (apiData?.resources && apiData.resources.length > 0) {
			return apiData.resources.map((r) => ({
				id: r.id,
				name: r.name,
				initials: r.initials,
				avatarUrl: r.avatarUrl,
			}));
		}
		return EMPLOYEES;
	}, [apiData]);

	const loadDataFromApi = useCallback(async () => {
		const weekEnd = addDays(currentWeekStart, 6);
		setIsLoading(true);
		try {
			const res = await getPlanning({
				startDate: format(currentWeekStart, "yyyy-MM-dd"),
				endDate: format(weekEnd, "yyyy-MM-dd"),
				search: searchQuery,
				status: selectedStatus !== "all" ? (selectedStatus as PlanningStatus) : undefined,
				assigneeId: selectedAssignee !== "all" ? selectedAssignee : undefined,
			});
			if (res) {
				setApiData(res);

				const mappedItems: PersonnelScheduleItem[] = [];
				res.orders.forEach((order) => {
					order.tasks.forEach((task) => {
						const startDateObj = new Date(task.startDate);
						const dayStart = startDateObj.getDate() || 10;
						const daySpan = task.durationDays || 1;

						const colorThemeMap: Record<string, PersonnelScheduleItem["colorTheme"]> = {
							"#EAB308": "yellow",
							"#F59E0B": "yellow",
							"#16A34A": "green",
							"#10B981": "green",
							"#DC2626": "pink",
							"#EC4899": "pink",
							"#8B5CF6": "purple",
							"#A855F7": "light-purple",
							"#FDE68A": "light-yellow",
						};

						task.assignees.forEach((assignee) => {
							mappedItems.push({
								id: `${task.id}-${assignee.id}`,
								employeeId: assignee.id,
								employeeName: assignee.name,
								employeeInitials: assignee.initials,
								employeeAvatarUrl: assignee.avatarUrl,
								title: `${order.orderNumber} - ${task.name || order.orderName}`,
								dayStart: dayStart,
								daySpan: daySpan,
								colorTheme: (colorThemeMap[task.color] || "blue") as PersonnelScheduleItem["colorTheme"],
								status: task.status,
								timeRange: task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : undefined,
								assignees: task.assignees,
							});
						});
					});
				});

				if (mappedItems.length > 0) {
					setScheduleItems(mappedItems);
				} else {
					setScheduleItems(INITIAL_SCHEDULE_ITEMS);
				}
			}
		} catch {
			setApiData(MOCK_PLANNING_RESPONSE);
			setScheduleItems(INITIAL_SCHEDULE_ITEMS);
		} finally {
			setIsLoading(false);
		}
	}, [searchQuery, selectedStatus, selectedAssignee, currentWeekStart]);

	useEffect(() => {
		loadDataFromApi();
	}, [loadDataFromApi]);

	const handleResetFilters = () => {
		setSearchQuery("");
		setSelectedAssignee("all");
		setSelectedStatus("all");
		setSelectedProject("all");
	};

	const handleOpenCreateModal = () => {
		setEditingItem(null);
		setIsCreateModalOpen(true);
	};

	const handleOpenEditModal = (item: PersonnelScheduleItem) => {
		setEditingItem(item);
		setIsCreateModalOpen(true);
	};

	const handleSaveTask = async (data: PersonnelTaskFormData) => {
		setIsSaving(true);
		try {
			const targetEmp = employeesList.find((e) => e.id === data.employeeId) || {
				id: data.employeeId,
				name: "Anställd",
				initials: "AN",
				avatarUrl: undefined,
			};

			if (editingItem) {
				const updated: PersonnelScheduleItem = {
					...editingItem,
					title: data.title,
					employeeId: data.employeeId,
					employeeName: targetEmp.name,
					employeeInitials: targetEmp.initials,
					employeeAvatarUrl: targetEmp.avatarUrl,
					dayStart: data.dayStart,
					daySpan: data.daySpan,
					colorTheme: data.colorTheme,
					status: data.status,
				};
				setScheduleItems((prev) => prev.map((it) => (it.id === editingItem.id ? updated : it)));
				await updatePlanningTask({
					taskId: editingItem.id,
					payload: { name: data.title, status: data.status },
				}).catch(() => {});
			} else {
				const newItem: PersonnelScheduleItem = {
					id: `sched-${Date.now()}`,
					title: data.title,
					employeeId: data.employeeId,
					employeeName: targetEmp.name,
					employeeInitials: targetEmp.initials,
					employeeAvatarUrl: targetEmp.avatarUrl,
					dayStart: data.dayStart,
					daySpan: data.daySpan,
					colorTheme: data.colorTheme,
					status: data.status,
					timeRange: "08:00 - 16:00 (8 tim)",
					dateText: `Måndag ${data.dayStart} Dec, 2025`,
					assignees: [
						{
							id: targetEmp.id,
							name: targetEmp.name,
							initials: targetEmp.initials,
							hours: 8,
							avatarUrl: targetEmp.avatarUrl,
						},
					],
				};
				setScheduleItems((prev) => [newItem, ...prev]);
				await createPlanningTask({
					orderId: "ord-1",
					orderNumber: "5000",
					orderName: data.title,
					name: data.title,
					startDate: `2025-12-${String(data.dayStart).padStart(2, "0")}`,
					endDate: `2025-12-${String(data.dayStart + data.daySpan - 1).padStart(2, "0")}`,
					status: data.status,
					color: "#3B82F6",
					assignees: [
						{
							id: targetEmp.id,
							name: targetEmp.name,
							initials: targetEmp.initials,
							hours: 8,
							avatarUrl: targetEmp.avatarUrl,
						},
					],
				}).catch(() => {});
			}
			setIsCreateModalOpen(false);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteTask = async (itemId: string) => {
		setScheduleItems((prev) => prev.filter((i) => i.id !== itemId));
		setActivePopoverId(null);
		await deletePlanningTask(itemId).catch(() => {});
	};

	const handleAddAssigneeToTask = (
		item: PersonnelScheduleItem,
		newAssignee: PlanningAssignee
	) => {
		const exists = item.assignees.some((a) => a.id === newAssignee.id);
		if (exists) return;

		const updatedAssignees = [...item.assignees, newAssignee];
		const updatedItem = { ...item, assignees: updatedAssignees };

		setScheduleItems((prev) => prev.map((it) => (it.id === item.id ? updatedItem : it)));
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

	const filteredItems = useMemo(() => {
		return scheduleItems.filter((item) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchTitle = item.title.toLowerCase().includes(q);
				const matchEmp = item.employeeName.toLowerCase().includes(q);
				if (!matchTitle && !matchEmp) return false;
			}
			if (selectedStatus !== "all" && item.status !== selectedStatus) {
				return false;
			}
			if (selectedAssignee !== "all" && item.employeeId !== selectedAssignee) {
				return false;
			}
			if (selectedProject !== "all" && !item.title.startsWith(selectedProject)) {
				return false;
			}
			return true;
		});
	}, [scheduleItems, searchQuery, selectedStatus, selectedAssignee, selectedProject]);

	const topEmployees = useMemo(() => {
		if (apiData?.resources && apiData.resources.length > 0) {
			return apiData.resources;
		}
		return [
			{ id: "emp-1", name: "Göran Andersson", initials: "GA", role: "Snickare", totalHours: 40, allocatedHours: 32, percentage: 80 },
			{ id: "emp-2", name: "Eva Mendes", initials: "EM", avatarUrl: EVA_MENDES_AVATAR, role: "Projektledare", totalHours: 20, allocatedHours: 12, percentage: 60 },
			{ id: "emp-3", name: "Anders Larsson", initials: "AB", role: "Elektriker", totalHours: 10, allocatedHours: 4, percentage: 40 },
			{ id: "emp-4", name: "Sara Nilsson", initials: "SN", role: "Målare", totalHours: 35, allocatedHours: 28, percentage: 80 },
		];
	}, [apiData]);

	return (
		<div className="flex flex-col gap-6 w-full font-sans text-slate-900 pb-8">
			{/* Top Summary Cards */}
			<PersonnelSummaryCards
				topEmployees={topEmployees}
				statistics={apiData?.statistics}
				dateRangeText="10/12/2025 - 17/12/2025"
			/>

			{/* Filter Bar */}
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

			{/* Clean Timeline Grid (No outer shadow/border) */}
			<PersonnelScheduleGrid
				currentMonthKey={currentMonthKey}
				currentYear={currentYear}
				currentWeekNumber={currentWeekNumber}
				daysHeader={daysHeader}
				employeesList={employeesList}
				filteredItems={filteredItems}
				activePopoverId={activePopoverId}
				setActivePopoverId={setActivePopoverId}
				onPrevWeek={handlePrevWeek}
				onNextWeek={handleNextWeek}
				onOpenCreateModal={handleOpenCreateModal}
				onOpenEditModal={handleOpenEditModal}
				onDeleteTask={handleDeleteTask}
				onAddAssignee={handleAddAssigneeToTask}
			/>

			{/* Create / Edit Modal Dialog (Zod + React Hook Form + Shadcn UI) */}
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
