"use client";

import { useCallback, useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import type {
	PlanningQuery,
	PlanningResponse,
	PlanningStatus,
	PlanningTab,
	PlanningTask,
} from "../types/planning.types";
import {
	getPlanning,
	createPlanningTask,
	updatePlanningTask,
	deletePlanningTask,
} from "../api/planning.api";
import { MOCK_PLANNING_RESPONSE } from "../data/planning.mock";

export interface UsePlanningOptions {
	initialStartDate?: string;
	initialEndDate?: string;
	initialTab?: PlanningTab;
}

export function usePlanning(options?: UsePlanningOptions) {
	const [activeTab, setActiveTab] = useState<PlanningTab>(options?.initialTab || "overview");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<PlanningStatus | "all">("all");
	const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<PlanningResponse>(MOCK_PLANNING_RESPONSE);

	// Dynamic startDate and endDate defaulting to current month or provided initial bounds
	const [startDate, setStartDate] = useState<string>(() => {
		if (options?.initialStartDate) return options.initialStartDate;
		return format(startOfMonth(new Date()), "yyyy-MM-dd");
	});

	const [endDate, setEndDate] = useState<string>(() => {
		if (options?.initialEndDate) return options.initialEndDate;
		return format(endOfMonth(new Date()), "yyyy-MM-dd");
	});

	const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);

	const setDateRange = useCallback((newStart: string, newEnd: string) => {
		setStartDate(newStart);
		setEndDate(newEnd);
	}, []);

	const fetchPlanningData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const query: PlanningQuery = {
				startDate,
				endDate,
				search: searchQuery.trim() || undefined,
				status: statusFilter !== "all" ? statusFilter : undefined,
				assigneeId: assigneeFilter !== "all" ? assigneeFilter : undefined,
			};
			const res = await getPlanning(query);
			setData(res);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to load planning data";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, [startDate, endDate, searchQuery, statusFilter, assigneeFilter]);

	useEffect(() => {
		fetchPlanningData();
	}, [fetchPlanningData]);

	// Navigate weeks (prev/next)
	const navigateWeek = useCallback((direction: "prev" | "next") => {
		setCurrentWeekOffset((prev) => {
			const newOffset = direction === "next" ? prev + 1 : prev - 1;
			const baseDate = new Date("2024-03-01");
			baseDate.setDate(baseDate.getDate() + newOffset * 7);

			const newStart = new Date(baseDate);
			const newEnd = new Date(baseDate);
			newEnd.setDate(newEnd.getDate() + 6);

			setStartDate(newStart.toISOString().split("T")[0]);
			setEndDate(newEnd.toISOString().split("T")[0]);

			return newOffset;
		});
	}, []);

	// Jump to current week
	const goToCurrentWeek = useCallback(() => {
		setCurrentWeekOffset(0);
		setStartDate("2024-03-01");
		setEndDate("2024-03-28");
	}, []);

	// Create new task
	const createTask = useCallback(async (payload: Omit<PlanningTask, "id">) => {
		setIsLoading(true);
		setError(null);
		try {
			const newTask = await createPlanningTask(payload);
			setData((prev) => {
				const targetOrderIndex = prev.orders.findIndex(
					(o) => o.id === payload.orderId || o.orderNumber === payload.orderNumber
				);
				if (targetOrderIndex === -1) {
					return {
						...prev,
						orders: [
							...prev.orders,
							{
								id: payload.orderId || `order-${Date.now()}`,
								orderNumber: payload.orderNumber,
								orderName: payload.orderName,
								tasks: [newTask],
							},
						],
					};
				}
				const updatedOrders = [...prev.orders];
				updatedOrders[targetOrderIndex] = {
					...updatedOrders[targetOrderIndex],
					tasks: [...updatedOrders[targetOrderIndex].tasks, newTask],
				};
				return { ...prev, orders: updatedOrders };
			});
			return newTask;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create task");
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Update existing task
	const updateTask = useCallback(async (taskId: string, payload: Partial<PlanningTask>) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedTask = await updatePlanningTask({ taskId, payload });
			setData((prev) => {
				const updatedOrders = prev.orders.map((order) => ({
					...order,
					tasks: order.tasks.map((task) =>
						task.id === taskId ? { ...task, ...updatedTask } : task
					),
				}));
				return { ...prev, orders: updatedOrders };
			});
			return updatedTask;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update task");
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Delete task
	const removeTask = useCallback(async (taskId: string) => {
		setIsLoading(true);
		setError(null);
		try {
			await deletePlanningTask(taskId);
			setData((prev) => {
				const updatedOrders = prev.orders.map((order) => ({
					...order,
					tasks: order.tasks.filter((task) => task.id !== taskId),
				}));
				return { ...prev, orders: updatedOrders };
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete task");
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Add assignee to a task
	const addAssignee = useCallback(async (
		taskId: string,
		assignee: { id: string; name: string; initials: string; hours: number; avatarUrl?: string }
	) => {
		setError(null);
		try {
			setData((prev) => {
				const updatedOrders = prev.orders.map((order) => ({
					...order,
					tasks: order.tasks.map((task) =>
						task.id === taskId
							? { ...task, assignees: [...task.assignees, assignee] }
							: task
					),
				}));
				return { ...prev, orders: updatedOrders };
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to add assignee");
			throw err;
		}
	}, []);

	// Remove assignee from a task
	const removeAssignee = useCallback(async (taskId: string, assigneeId: string) => {
		setError(null);
		try {
			setData((prev) => {
				const updatedOrders = prev.orders.map((order) => ({
					...order,
					tasks: order.tasks.map((task) =>
						task.id === taskId
							? {
								...task,
								assignees: task.assignees.filter((a) => a.id !== assigneeId),
							}
							: task
					),
				}));
				return { ...prev, orders: updatedOrders };
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to remove assignee");
			throw err;
		}
	}, []);

	// Update task status
	const updateTaskStatus = useCallback(async (taskId: string, status: PlanningStatus) => {
		return updateTask(taskId, { status });
	}, [updateTask]);

	// Get all tasks from all orders
	const allTasks = data.orders.flatMap((order) => order.tasks);

	// Get all unique assignees
	const allAssignees = data.resources;

	return {
		// Tab state
		activeTab,
		setActiveTab,
		// Filter state
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		assigneeFilter,
		setAssigneeFilter,
		// Date range state
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		setDateRange,
		// Data state
		isLoading,
		error,
		data,
		allTasks,
		allAssignees,
		// Date/Week navigation
		currentWeekOffset,
		navigateWeek,
		goToCurrentWeek,
		// CRUD operations
		createTask,
		updateTask,
		removeTask,
		addAssignee,
		removeAssignee,
		updateTaskStatus,
		// Refetch
		refetch: fetchPlanningData,
	};
}

export default usePlanning;
