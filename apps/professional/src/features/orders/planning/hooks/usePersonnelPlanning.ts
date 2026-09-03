"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { format, addWeeks, subWeeks, addDays, getISOWeek } from "date-fns";
import { showToast } from "@/lib/toast";
import type {
	PlanningQuery,
	PlanningResponse,
	PlanningStatus,
	PlanningAssignee,
	PersonnelScheduleItem,
	GridTaskItem,
} from "../types/planning.types";
import {
	getPlanning,
	createPlanningTask,
	updatePlanningTask,
	deletePlanningTask,
} from "../api/planning.api";
import {
	MOCK_PERSONNEL_GRID_TASKS,
	MOCK_PERSONNEL_EMPLOYEES,
	MOCK_INITIAL_SCHEDULE_ITEMS,
} from "../data/personnelPlanning.mock";

const DAY_NAME_KEYS = [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
] as const;

const MONTH_NAME_KEYS = [
	"monthJan",
	"monthFeb",
	"monthMar",
	"monthApr",
	"monthMay",
	"monthJun",
	"monthJul",
	"monthAug",
	"monthSep",
	"monthOct",
	"monthNov",
	"monthDec",
] as const;

const DAY_HOURS_MAP: Record<number, number> = {
	0: 38,
	1: 40,
	2: 42,
	3: 35,
	4: 45,
	5: 30,
	6: 50,
};

export function usePersonnelPlanning() {
	const [tasks, setTasks] = useState<GridTaskItem[]>(MOCK_PERSONNEL_GRID_TASKS);
	const [scheduleItems, setScheduleItems] = useState<PersonnelScheduleItem[]>(MOCK_INITIAL_SCHEDULE_ITEMS);
	const [apiData, setApiData] = useState<PlanningResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// Filters
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [selectedProject, setSelectedProject] = useState<string>("all");
	const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<PersonnelScheduleItem | null>(null);

	// Date Navigation State (Starts Monday 10 Dec matching Figma dates 10-16)
	const [currentWeekStart, setCurrentWeekStart] = useState(() => new Date(2025, 11, 10));

	const daysHeader = useMemo(() => {
		return Array.from({ length: 7 }, (_, i) => {
			const d = addDays(currentWeekStart, i);
			return {
				dayNumber: d.getDate(),
				dayNameKey: DAY_NAME_KEYS[i],
				hours: DAY_HOURS_MAP[i] ?? 40,
			};
		});
	}, [currentWeekStart]);

	const currentMonthKey = useMemo(
		() => MONTH_NAME_KEYS[currentWeekStart.getMonth()],
		[currentWeekStart]
	);
	const currentWeekNumber = useMemo(() => getISOWeek(currentWeekStart), [currentWeekStart]);
	const currentYear = useMemo(() => currentWeekStart.getFullYear(), [currentWeekStart]);

	// Fetch Planning from standard API
	const fetchPersonnelPlanning = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const startDateStr = format(currentWeekStart, "yyyy-MM-dd");
			const endDateStr = format(addDays(currentWeekStart, 6), "yyyy-MM-dd");

			const query: PlanningQuery = {
				startDate: startDateStr,
				endDate: endDateStr,
				search: searchQuery.trim() || undefined,
				status: selectedStatus !== "all" ? (selectedStatus as PlanningStatus) : undefined,
				assigneeId: selectedAssignee !== "all" ? selectedAssignee : undefined,
				projectId: selectedProject !== "all" ? selectedProject : undefined,
			};

			const res = await getPlanning(query);
			setApiData(res);

			// If API returns orders with tasks, map them to schedule items
			if (res.orders && res.orders.length > 0) {
				const allTasks = res.orders.flatMap((order) =>
					order.tasks.map((task) => ({
						id: task.id,
						employeeId: task.assignees?.[0]?.id || "emp-1",
						employeeName: task.assignees?.[0]?.name || "Anställd",
						employeeInitials: task.assignees?.[0]?.initials || "AN",
						employeeAvatarUrl: task.assignees?.[0]?.avatarUrl,
						title: task.orderName || task.name || order.orderName,
						orderNumber: task.orderNumber || order.orderNumber,
						dayStart: task.startDayIndex ?? 0,
						daySpan: task.durationDays ?? 1,
						colorTheme: "blue" as const,
						status: task.status,
						timeRange: task.startTime && task.endTime
							? `${task.startTime} - ${task.endTime}`
							: undefined,
						dateText: task.startDate,
						assignees: task.assignees,
					}))
				);
				if (allTasks.length > 0) {
					setScheduleItems(allTasks);
				}
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to load personnel planning";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, [currentWeekStart, searchQuery, selectedStatus, selectedAssignee, selectedProject]);

	useEffect(() => {
		fetchPersonnelPlanning();
	}, [fetchPersonnelPlanning]);

	// Handlers for Week Navigation
	const handlePrevWeek = useCallback(() => {
		setCurrentWeekStart((prev) => subWeeks(prev, 1));
	}, []);

	const handleNextWeek = useCallback(() => {
		setCurrentWeekStart((prev) => addWeeks(prev, 1));
	}, []);

	// Reset all active filters
	const handleResetFilters = useCallback(() => {
		setSearchQuery("");
		setSelectedStatus("all");
		setSelectedAssignee("all");
		setSelectedProject("all");
	}, []);

	// Create new task with API integration
	const handleCreateTask = useCallback(
		async (data: {
			title: string;
			dayStart: number;
			daySpan: number;
			colorTheme: "yellow" | "blue" | "purple" | "pink" | "green" | "light-purple" | "light-yellow" | "red";
			status: PlanningStatus;
			timeRange: string;
			dateText: string;
			assigneeIds: string[];
		}) => {
			setIsSaving(true);
			setError(null);

			const emp = MOCK_PERSONNEL_EMPLOYEES.find((e) => e.id === data.assigneeIds[0]) || MOCK_PERSONNEL_EMPLOYEES[0];
			const newId = `task-${Date.now()}`;

			const newAssignees = data.assigneeIds.map((id) => {
				const found = MOCK_PERSONNEL_EMPLOYEES.find((e) => e.id === id);
				return {
					id,
					name: found?.name || "Anställd",
					initials: found?.initials || "AN",
					hours: 8,
				};
			});

			const newScheduleItem: PersonnelScheduleItem = {
				id: newId,
				employeeId: emp.id,
				employeeName: emp.name,
				employeeInitials: emp.initials,
				title: data.title,
				dayStart: data.dayStart,
				daySpan: data.daySpan,
				colorTheme: data.colorTheme,
				status: data.status,
				timeRange: data.timeRange,
				dateText: data.dateText,
				assignees: newAssignees,
			};

			const newGridTask: GridTaskItem = {
				id: newId,
				dayIndex: 0,
				topMinutes: 0,
				durationMinutes: 60,
				title: data.title,
				colorTheme: data.colorTheme,
				status: data.status,
				timeRange: data.timeRange,
				dateText: data.dateText,
				assignees: newAssignees,
			};

			// Optimistic update
			setScheduleItems((prev) => [newScheduleItem, ...prev]);
			setTasks((prev) => [newGridTask, ...prev]);

			try {
				const created = await createPlanningTask({
					orderId: "order-5000",
					orderNumber: "Order 5000",
					orderName: data.title,
					name: data.title,
					startDate: data.dateText || "",
					endDate: data.dateText || "",
					color: "#3B82F6",
					status: data.status,
					assignees: newAssignees,
				});

				// Replace temp ID with real API ID
				const realId = created.id;
				if (realId && realId !== newId) {
					setScheduleItems((prev) =>
						prev.map((item) => (item.id === newId ? { ...item, id: realId } : item))
					);
					setTasks((prev) =>
						prev.map((t) => (t.id === newId ? { ...t, id: realId } : t))
					);
				}

				setIsCreateModalOpen(false);
			} catch (err) {
				// Rollback optimistic update on failure
				setScheduleItems((prev) => prev.filter((item) => item.id !== newId));
				setTasks((prev) => prev.filter((t) => t.id !== newId));
				const message = err instanceof Error ? err.message : "Failed to create task";
				setError(message);
				showToast("error", message);
			} finally {
				setIsSaving(false);
			}
		},
		[]
	);

	// Update existing task with API integration
	const handleUpdateTask = useCallback(
		async (data: {
			id: string;
			title: string;
			dayStart: number;
			daySpan: number;
			colorTheme: "yellow" | "blue" | "purple" | "pink" | "green" | "light-purple" | "light-yellow" | "red";
			status: PlanningStatus;
			timeRange: string;
			dateText: string;
			assigneeIds: string[];
		}) => {
			setIsSaving(true);
			setError(null);

			// Store previous state for rollback
			const prevScheduleItems = scheduleItems;
			const prevTasks = tasks;

			// Optimistic update
			setScheduleItems((prev) =>
				prev.map((item) => {
					if (item.id === data.id) {
						return {
							...item,
							title: data.title,
							dayStart: data.dayStart,
							daySpan: data.daySpan,
							colorTheme: data.colorTheme,
							status: data.status,
							timeRange: data.timeRange,
							dateText: data.dateText,
						};
					}
					return item;
				})
			);

			setTasks((prev) =>
				prev.map((t) => {
					if (t.id === data.id) {
						return {
							...t,
							title: data.title,
							colorTheme: data.colorTheme === "light-purple" ? "purple" : data.colorTheme === "light-yellow" ? "yellow" : data.colorTheme,
							status: data.status,
							timeRange: data.timeRange,
							dateText: data.dateText,
						};
					}
					return t;
				})
			);

			try {
				await updatePlanningTask({
					taskId: data.id,
					payload: {
						name: data.title,
						status: data.status,
					},
				});

				setEditingItem(null);
			} catch (err) {
				// Rollback on failure
				setScheduleItems(prevScheduleItems);
				setTasks(prevTasks);
				const message = err instanceof Error ? err.message : "Failed to update task";
				setError(message);
				showToast("error", message);
			} finally {
				setIsSaving(false);
			}
		},
		[scheduleItems, tasks]
	);

	// Delete task with API integration
	const handleDeleteTask = useCallback(
		async (taskId: string) => {
			setError(null);

			// Store previous state for rollback
			const prevScheduleItems = scheduleItems;
			const prevTasks = tasks;

			// Optimistic update
			setTasks((prev) => prev.filter((t) => t.id !== taskId));
			setScheduleItems((prev) => prev.filter((t) => t.id !== taskId));
			setActivePopoverId(null);

			try {
				await deletePlanningTask(taskId);
			} catch (err) {
				// Rollback on failure
				setScheduleItems(prevScheduleItems);
				setTasks(prevTasks);
				const message = err instanceof Error ? err.message : "Failed to delete task";
				setError(message);
				showToast("error", message);
			}
		},
		[scheduleItems, tasks]
	);

	// Add assignee with optimistic update
	const handleAddAssignee = useCallback(
		(item: PersonnelScheduleItem, newAssignee: PlanningAssignee) => {
			setTasks((prev) =>
				prev.map((t) => {
					if (t.id === item.id) {
						const current = t.assignees || [];
						if (current.some((a: PlanningAssignee) => a.id === newAssignee.id)) return t;
						return {
							...t,
							assignees: [newAssignee, ...current],
						};
					}
					return t;
				})
			);
		},
		[]
	);

	return {
		tasks,
		setTasks,
		scheduleItems,
		apiData,
		isLoading,
		isSaving,
		error,
		employeesList: MOCK_PERSONNEL_EMPLOYEES,
		// Filters
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
		// Modals & Navigation
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
		// Actions
		handleCreateTask,
		handleUpdateTask,
		handleDeleteTask,
		handleAddAssignee,
	};
}
