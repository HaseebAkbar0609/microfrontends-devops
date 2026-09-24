"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { useOrderOpened } from "@/features/orders/opened/hooks/useOrderOpened";
import { TIMEPLAN_CONSTANTS } from "../constants/timeplan.constants";
import type {
	OrderTimeplan,
	OrderTimeplanFormData,
	OrderTimeplanTask,
} from "../types/timeplan.types";
import {
	getOrderTimeplanDetailAction,
	getOrderTimeplanTasksAction,
	addOrderTimeplanTaskAction,
	createOrderTimeplanAction,
} from "@/api-actions/orders/timeplan";

import { MOCK_GANTT_TASKS_FIGMA } from "../data/timeplan.mock";

export interface UseOrderTimeplanDetailProps {
	orderId?: string;
	planId?: string | null;
	initialPlan?: OrderTimeplan | null;
}

export function useOrderTimeplanDetail({
	orderId = TIMEPLAN_CONSTANTS.DEFAULT_ORDER_ID,
	planId,
	initialPlan,
}: UseOrderTimeplanDetailProps) {
	const t = useTranslate();
	const { orderData } = useOrderOpened(orderId);

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [plan, setPlan] = useState<OrderTimeplan | null>(initialPlan || null);
	const [tasks, setTasks] = useState<OrderTimeplanTask[]>(MOCK_GANTT_TASKS_FIGMA);

	const todayDate = new Date().toISOString().slice(0, 10);
	const defaultEndDate = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

	const initialCustomer =
		initialPlan?.customer ||
		orderData?.customerInfo?.customerName ||
		orderData?.orderDetails?.orderName ||
		"";

	const initialOrderNr =
		orderData?.orderDetails?.serialNo ||
		orderId;

	const [formData, setFormData] = useState<OrderTimeplanFormData>({
		planName: initialPlan?.name || TIMEPLAN_CONSTANTS.KINDS.MAIN,
		type: initialPlan?.kind || TIMEPLAN_CONSTANTS.DEFAULT_TYPE,
		startDate: initialPlan?.startDate || todayDate,
		endDate: initialPlan?.endDate || defaultEndDate,
		orderNr: initialOrderNr,
		customer: initialCustomer,
		createdBy: initialPlan?.createdBy || TIMEPLAN_CONSTANTS.AUTHORS[0].name,
		date: initialPlan?.date || todayDate,
		revisedDate: initialPlan?.revisedDate || todayDate,
		description: initialPlan?.description || "",
	});

	// Load plan details and tasks asynchronously from API with mock fallback
	const loadDetail = useCallback(async () => {
		setIsLoading(true);
		try {
			if (planId) {
				const planRes = await getOrderTimeplanDetailAction(orderId, planId);
				if (planRes.success && planRes.data) {
					setPlan(planRes.data);
					setFormData({
						planName: planRes.data.name || TIMEPLAN_CONSTANTS.KINDS.MAIN,
						type: planRes.data.kind || TIMEPLAN_CONSTANTS.DEFAULT_TYPE,
						startDate: planRes.data.startDate || todayDate,
						endDate: planRes.data.endDate || defaultEndDate,
						orderNr: orderData?.orderDetails?.serialNo || orderId,
						customer: planRes.data.customer || orderData?.customerInfo?.customerName || "",
						createdBy: planRes.data.createdBy || TIMEPLAN_CONSTANTS.AUTHORS[0].name,
						date: planRes.data.date || todayDate,
						revisedDate: planRes.data.revisedDate || todayDate,
						description: planRes.data.description || "",
					});
				}
			}

			const tasksRes = await getOrderTimeplanTasksAction(orderId, planId || undefined);
			if (tasksRes.success && tasksRes.data) {
				setTasks(tasksRes.data);
			}
		} catch {
			// Handled gracefully in API actions
		} finally {
			setIsLoading(false);
		}
	}, [orderId, planId, orderData, todayDate, defaultEndDate]);

	useEffect(() => {
		loadDetail();
	}, [loadDetail]);

	// Sync order customer and serial number dynamically from API once loaded
	useEffect(() => {
		if (orderData) {
			setFormData((prev) => ({
				...prev,
				orderNr: orderData.orderDetails?.serialNo || prev.orderNr || orderId,
				customer:
					prev.customer ||
					orderData.customerInfo?.customerName ||
					orderData.orderDetails?.orderName ||
					"",
			}));
		}
	}, [orderData, orderId]);

	const handleFormChange = (field: keyof OrderTimeplanFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddTask = async (newTaskData: Partial<OrderTimeplanTask>, parentId?: string) => {
		const parentIndex = parentId ? tasks.findIndex((t) => t.id === parentId) : -1;
		const parentTask = parentIndex !== -1 ? tasks[parentIndex] : null;

		const baseStart = new Date(formData.startDate || todayDate).getTime();
		const taskStart = newTaskData.startDate ? new Date(newTaskData.startDate).getTime() : baseStart;
		const taskEnd = newTaskData.endDate ? new Date(newTaskData.endDate).getTime() : taskStart + 86400000 * 3;
		const startDayIndex = Math.max(0, Math.min(27, Math.floor((taskStart - baseStart) / 86400000) || 0));
		const durationDays = Math.max(1, Math.min(28 - startDayIndex, Math.ceil((taskEnd - taskStart) / 86400000) || 3));

		const newTaskPayload: Partial<OrderTimeplanTask> = {
			parentId,
			name: newTaskData.name || t(localizationConstants.orderTimeplanNewTaskFallback),
			startDate: newTaskData.startDate ? newTaskData.startDate.replace(/-/g, "/") : todayDate.replace(/-/g, "/"),
			endDate: newTaskData.endDate ? newTaskData.endDate.replace(/-/g, "/") : todayDate.replace(/-/g, "/"),
			level: parentTask ? 2 : 1,
			hasChildren: false,
			durationDays,
			startDayIndex,
			color: newTaskData.color || (parentTask?.color && !parentTask.color.includes("transparent") ? parentTask.color : "bg-cyan-500"),
			tag: newTaskData.name || t(localizationConstants.orderTimeplanNewTaskFallback),
			kind: newTaskData.kind || "subtask",
			expanded: true,
			children: [],
		};

		// Call API action
		const res = await addOrderTimeplanTaskAction(orderId, planId || "default", newTaskPayload);
		const createdTask = res.data || (newTaskPayload as OrderTimeplanTask);

		if (parentIndex !== -1) {
			setTasks((prev) => {
				const nextList = [...prev];
				nextList[parentIndex] = { ...nextList[parentIndex], hasChildren: true, expanded: true };
				nextList.splice(parentIndex + 1, 0, createdTask);
				return nextList;
			});
		} else {
			setTasks((prev) => [...prev, createdTask]);
		}
	};

	const handleSave = async (onSuccess?: (savedPlan: OrderTimeplan) => void) => {
		setIsSubmitting(true);
		const newPlanPayload: Partial<OrderTimeplan> = {
			id: planId || plan?.id || `plan-${Date.now()}`,
			name: formData.planName,
			kind: (formData.type as "Huvudtidsplan" | "Deltidsplan") || TIMEPLAN_CONSTANTS.KINDS.MAIN,
			date: formData.date ? formData.date.replace(/-/g, "/") : todayDate.replace(/-/g, "/"),
			createdBy: formData.createdBy,
			customer: formData.customer,
			startDate: formData.startDate,
			endDate: formData.endDate,
			revisedDate: formData.revisedDate,
			description: formData.description,
		};

		try {
			const result = await createOrderTimeplanAction(orderId, newPlanPayload);
			setIsSubmitting(false);
			if (result.success && result.data) {
				showToast("success", t(localizationConstants.orderTimeplanSaveSuccess));
				onSuccess?.(result.data);
				return result.data;
			}
			showToast("error", result.error || t(localizationConstants.orderTimeplanSaveError));
			return null;
		} catch {
			setIsSubmitting(false);
			showToast("error", t(localizationConstants.orderTimeplanSaveError));
			return null;
		}
	};

	return {
		isLoading,
		isSubmitting,
		plan,
		tasks,
		formData,
		handleFormChange,
		handleAddTask,
		handleSave,
		refresh: loadDetail,
	};
}
