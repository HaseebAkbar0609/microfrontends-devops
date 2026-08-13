"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PlanningGanttRow } from "../types/planning.types";

const COLOR_OPTIONS = [
	{ labelKey: localizationConstants.colorYellow, value: "#EAB308" },
	{ labelKey: localizationConstants.colorGreen, value: "#22C55E" },
	{ labelKey: localizationConstants.colorRed, value: "#EF4444" },
	{ labelKey: localizationConstants.colorBlue, value: "#0284C7" },
	{ labelKey: localizationConstants.colorOrange, value: "#D97706" },
	{ labelKey: localizationConstants.colorPurple, value: "#A855F7" },
];

// Zod Schema defined outside component body with no 28-day restriction
const createPlanningTaskSchema = (isSv: boolean) =>
	z.object({
		taskName: z.string().min(1, isSv ? "Aktivitetsnamn krävs" : "Activity name is required"),
		startDate: z.string().min(1, isSv ? "Startdatum krävs" : "Start date is required"),
		duration: z.coerce
			.number()
			.min(1, isSv ? "Minst 1 dag" : "Min 1 day")
			.max(365, isSv ? "Max 365 dagar" : "Max 365 days"),
		startDayIndex: z.coerce
			.number()
			.min(0, isSv ? "Minst index 0" : "Min index 0")
			.max(365, isSv ? "Max index 365" : "Max index 365"),
		color: z.string().min(1, isSv ? "Färg krävs" : "Color is required"),
	});

export type PlanningTaskFormData = z.infer<ReturnType<typeof createPlanningTaskSchema>>;

export interface CreatePlanningTaskModalProps {
	isOpen: boolean;
	parentRow: PlanningGanttRow | null;
	onClose: () => void;
	onSave: (data: PlanningTaskFormData) => void;
}

export function CreatePlanningTaskModal({
	isOpen,
	parentRow,
	onClose,
	onSave,
}: CreatePlanningTaskModalProps) {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const isSv = i18n.language === "sv";

	const taskSchema = useMemo(() => createPlanningTaskSchema(isSv), [isSv]);

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<PlanningTaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			taskName: "",
			startDate: parentRow?.startDate || "2024/01/01",
			duration: 14,
			startDayIndex: parentRow?.startDayIndex || 0,
			color: parentRow?.color && parentRow.color !== "transparent" ? parentRow.color : "#EAB308",
		},
	});

	// Reset form values when modal opens or parentRow changes
	useEffect(() => {
		if (isOpen && parentRow) {
			reset({
				taskName: "",
				startDate: parentRow.startDate || "2024/01/01",
				duration: parentRow.durationDays || 14,
				startDayIndex: parentRow.startDayIndex || 0,
				color: parentRow.color && parentRow.color !== "transparent" ? parentRow.color : "#EAB308",
			});
		}
	}, [isOpen, parentRow, reset]);

	if (!isOpen || !parentRow) return null;

	const onSubmit = (data: PlanningTaskFormData) => {
		onSave(data);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
			<div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
				{/* Modal Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.addTaskModalTitle} />
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-slate-400 hover:text-slate-700 rounded-md p-1 cursor-pointer transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				{/* Modal Form */}
				<form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-xs">
					<div className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
						<Translate text={localizationConstants.subActivityFor} />{" "}
						<strong className="text-slate-900">{parentRow.name}</strong>
					</div>

					{/* Task Name */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.taskNameLabel} />
						</Label>
						<Input
							type="text"
							{...register("taskName")}
							placeholder={t(localizationConstants.taskNamePlaceholder)}
							className={`h-9 text-xs bg-white ${errors.taskName ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"}`}
						/>
						{errors.taskName && (
							<span className="text-[11px] font-medium text-red-500">{errors.taskName.message}</span>
						)}
					</div>

					{/* Start Date & Duration */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.taskStartDateLabel} />
							</Label>
							<Input
								type="text"
								{...register("startDate")}
								className={`h-9 text-xs bg-white ${errors.startDate ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"}`}
							/>
							{errors.startDate && (
								<span className="text-[11px] font-medium text-red-500">{errors.startDate.message}</span>
							)}
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.taskDurationLabel} />
							</Label>
							<Input
								type="number"
								min={1}
								max={365}
								{...register("duration")}
								className={`h-9 text-xs bg-white ${errors.duration ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"}`}
							/>
							{errors.duration && (
								<span className="text-[11px] font-medium text-red-500">{errors.duration.message}</span>
							)}
						</div>
					</div>

					{/* Start Day Index & Color Picker */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.taskStartDayIndexLabel} />
							</Label>
							<Input
								type="number"
								min={0}
								max={365}
								{...register("startDayIndex")}
								className={`h-9 text-xs bg-white ${errors.startDayIndex ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"}`}
							/>
							{errors.startDayIndex && (
								<span className="text-[11px] font-medium text-red-500">{errors.startDayIndex.message}</span>
							)}
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.taskColorLabel} />
							</Label>
							<Controller
								name="color"
								control={control}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-xs font-medium text-slate-700 cursor-pointer">
											<SelectValue placeholder={t(localizationConstants.taskColorLabel)} />
										</SelectTrigger>
										<SelectContent className="bg-white">
											{COLOR_OPTIONS.map((c) => (
												<SelectItem key={c.value} value={c.value} className="cursor-pointer text-xs">
													<div className="flex items-center gap-2">
														<span
															className="h-3 w-3 rounded-full shrink-0 border border-slate-300"
															style={{ backgroundColor: c.value }}
														/>
														<span>{t(c.labelKey)}</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.color && (
								<span className="text-[11px] font-medium text-red-500">{errors.color.message}</span>
							)}
						</div>
					</div>

					{/* Footer Buttons */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 px-6 py-4 mt-6">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="h-9 px-4 text-xs font-medium border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.cancelButton} />
						</Button>
						<Button
							type="submit"
							className="h-9 px-5 gap-1.5 text-xs font-medium bg-[#111721] text-white hover:bg-slate-800 cursor-pointer"
						>
							<Check className="h-3.5 w-3.5" />
							<span><Translate text={localizationConstants.addTaskButton} /></span>
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
