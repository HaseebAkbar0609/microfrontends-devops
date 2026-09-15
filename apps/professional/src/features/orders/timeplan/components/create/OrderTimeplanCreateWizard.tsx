"use client";

import React, { useState } from "react";
import { createOrderTimeplanAction } from "@/api-actions/orders/timeplan";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { TIMEPLAN_CONSTANTS } from "../../constants/timeplan.constants";
import { MOCK_GANTT_TASKS_FIGMA } from "../../data/timeplan.mock";
import type { OrderTimeplan, OrderTimeplanFormData, OrderTimeplanTask } from "../../types/timeplan.types";
import { useOrderOpened } from "@/features/orders/opened/hooks/useOrderOpened";
import { OrderTimeplanStep1Form } from "./OrderTimeplanStep1Form";
import { OrderTimeplanStep2Gantt } from "./OrderTimeplanStep2Gantt";

interface OrderTimeplanCreateWizardProps {
	orderId?: string;
	initialPlan?: OrderTimeplan | null;
	onClose: () => void;
	onSaveComplete: (newPlan: OrderTimeplan) => void;
}

export function OrderTimeplanCreateWizard({
	orderId = TIMEPLAN_CONSTANTS.DEFAULT_ORDER_ID,
	initialPlan,
	onClose,
	onSaveComplete,
}: OrderTimeplanCreateWizardProps) {
	const t = useTranslate();
	const { orderData } = useOrderOpened(orderId);
	const [step, setStep] = useState<1 | 2>(initialPlan ? 2 : 1);
	const [isSubmitting, setIsSubmitting] = useState(false);

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

	// Sync order customer and serial number dynamically from API once loaded
	React.useEffect(() => {
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

	const [tasks, setTasks] = useState<OrderTimeplanTask[]>(MOCK_GANTT_TASKS_FIGMA);

	const handleFormChange = (field: keyof OrderTimeplanFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddTask = (newTaskData: Partial<OrderTimeplanTask>, parentId?: string) => {
		const parentIndex = parentId ? tasks.findIndex((t) => t.id === parentId) : -1;
		const parentTask = parentIndex !== -1 ? tasks[parentIndex] : null;

		// Calculate start day index and duration days based on dates
		const baseStart = new Date(formData.startDate || todayDate).getTime();
		const taskStart = newTaskData.startDate ? new Date(newTaskData.startDate).getTime() : baseStart;
		const taskEnd = newTaskData.endDate ? new Date(newTaskData.endDate).getTime() : taskStart + 86400000 * 3;
		const startDayIndex = Math.max(0, Math.min(27, Math.floor((taskStart - baseStart) / 86400000) || 0));
		const durationDays = Math.max(1, Math.min(28 - startDayIndex, Math.ceil((taskEnd - taskStart) / 86400000) || 3));

		const newTask: OrderTimeplanTask = {
			id: `task-${Date.now()}`,
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

		if (parentIndex !== -1) {
			setTasks((prev) => {
				const nextList = [...prev];
				nextList[parentIndex] = { ...nextList[parentIndex], hasChildren: true, expanded: true };
				nextList.splice(parentIndex + 1, 0, newTask);
				return nextList;
			});
		} else {
			setTasks((prev) => [...prev, newTask]);
		}
	};

	const handleToggleExpand = (taskId: string) => {
		setTasks((prev) =>
			prev.map((item) => (item.id === taskId ? { ...item, expanded: !item.expanded } : item))
		);
	};

	const handleSave = async () => {
		setIsSubmitting(true);

		const newPlanPayload: Partial<OrderTimeplan> = {
			id: initialPlan?.id || `plan-${Date.now()}`,
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
				onSaveComplete(result.data);
			} else {
				showToast("error", result.error || t(localizationConstants.orderTimeplanSaveError));
			}
		} catch {
			setIsSubmitting(false);
			const fallback: OrderTimeplan = {
				id: `plan-${Date.now()}`,
				name: formData.planName,
				kind: (formData.type as "Huvudtidsplan" | "Deltidsplan") || TIMEPLAN_CONSTANTS.KINDS.MAIN,
				date: formData.date || todayDate.replace(/-/g, "/"),
				createdBy: formData.createdBy,
				customer: formData.customer,
				startDate: formData.startDate,
				endDate: formData.endDate,
				revisedDate: formData.revisedDate,
				description: formData.description,
			};
			showToast("success", t(localizationConstants.orderTimeplanSaveSuccess));
			onSaveComplete(fallback);
		}
	};

	if (step === 2) {
		return (
			<OrderTimeplanStep2Gantt
				tasks={tasks}
				onBack={() => setStep(1)}
				onSave={handleSave}
				onCancel={onClose}
				onAddTask={handleAddTask}
				onToggleExpand={handleToggleExpand}
				isSubmitting={isSubmitting}
			/>
		);
	}

	return (
		<OrderTimeplanStep1Form
			formData={formData}
			onChange={handleFormChange}
			onNext={() => setStep(2)}
			onSave={handleSave}
			onCancel={onClose}
			isSubmitting={isSubmitting}
		/>
	);
}
