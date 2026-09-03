"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type {
	PersonnelScheduleItem,
} from "../../types/planning.types";

const personnelTaskSchema = (isSv: boolean) =>
	z.object({
		title: z
			.string()
			.min(1, isSv ? "Order / Aktivitetsnamn krävs" : "Order / Activity name is required"),
		employeeId: z
			.string()
			.min(1, isSv ? "Personal / Anställd krävs" : "Personnel / Employee is required"),
		dayStart: z.coerce
			.number({
				invalid_type_error: isSv ? "Startdag måste vara ett nummer" : "Start day must be a number",
				required_error: isSv ? "Startdag krävs" : "Start day is required",
			})
			.int(isSv ? "Måste vara ett heltal" : "Must be an integer")
			.min(1, isSv ? "Minst dag 1" : "Min day 1")
			.max(31, isSv ? "Max dag 31" : "Max day 31"),
		daySpan: z.coerce
			.number({
				invalid_type_error: isSv ? "Varaktighet måste vara ett nummer" : "Duration must be a number",
				required_error: isSv ? "Varaktighet krävs" : "Duration is required",
			})
			.int(isSv ? "Måste vara ett heltal" : "Must be an integer")
			.min(1, isSv ? "Minst 1 dag" : "Min 1 day")
			.max(7, isSv ? "Max 7 dagar" : "Max 7 days"),
		colorTheme: z.enum([
			"blue",
			"yellow",
			"green",
			"purple",
			"pink",
			"light-purple",
			"light-yellow",
			"red",
		]),
		status: z.enum(["completed", "in_progress", "not_started", "waiting", "cancelled", "due"]),
	});

export type PersonnelTaskFormData = z.infer<ReturnType<typeof personnelTaskSchema>>;

interface PersonnelCreateTaskModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	editingItem: PersonnelScheduleItem | null;
	onSave: (data: PersonnelTaskFormData) => Promise<void>;
	isSaving: boolean;
	employeesList: { id: string; name: string; initials: string; avatarUrl?: string }[];
	daysHeader: { dayNumber: number; dayNameKey: string }[];
}

export function PersonnelCreateTaskModal({
	isOpen,
	onOpenChange,
	editingItem,
	onSave,
	isSaving,
	employeesList,
	daysHeader,
}: PersonnelCreateTaskModalProps) {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const isSv = i18n.language === "sv";

	const schema = useMemo(() => personnelTaskSchema(isSv), [isSv]);

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<PersonnelTaskFormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "Order 5000 - Badrum",
			employeeId: employeesList[0]?.id || "emp-1",
			dayStart: daysHeader[0]?.dayNumber || 10,
			daySpan: 1,
			colorTheme: "blue",
			status: "in_progress",
		},
	});

	useEffect(() => {
		if (isOpen) {
			if (editingItem) {
				reset({
					title: editingItem.title,
					employeeId: editingItem.employeeId,
					dayStart: editingItem.dayStart,
					daySpan: editingItem.daySpan,
					colorTheme: editingItem.colorTheme,
					status: editingItem.status,
				});
			} else {
				reset({
					title: "",
					employeeId: employeesList[0]?.id || "emp-1",
					dayStart: daysHeader[0]?.dayNumber || 10,
					daySpan: 1,
					colorTheme: "blue",
					status: "in_progress",
				});
			}
		}
	}, [isOpen, editingItem, reset, employeesList, daysHeader]);

	const onSubmit = async (data: PersonnelTaskFormData) => {
		await onSave(data);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="w-[calc(100vw-32px)] max-w-lg sm:max-w-md bg-white border border-slate-200 rounded-xl p-5 sm:p-6 font-sans max-h-[90vh] overflow-y-auto">
				<DialogHeader className="border-b border-slate-100 pb-3">
					<DialogTitle className="text-base font-semibold text-slate-900">
						{editingItem ? (
							<Translate text={localizationConstants.redigeraPlanering} />
						) : (
							<Translate text={localizationConstants.skapaNyPlanering} />
						)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs mt-3">
					{/* Title Field */}
					<div className="space-y-1.5 w-full">
						<Label className="font-semibold text-slate-700 text-xs">
							<Translate text={localizationConstants.orderAktivitetNamn} />
						</Label>
						<Input
							type="text"
							{...register("title")}
							placeholder={t(localizationConstants.planningSearchPlaceholder) || "Order / Task..."}
							className="h-9 w-full text-xs border-slate-200 focus-visible:ring-slate-400"
						/>
						{errors.title && (
							<p className="text-[11px] text-red-500 font-medium">{errors.title.message}</p>
						)}
					</div>

					{/* Employee Select */}
					<div className="space-y-1.5 w-full">
						<Label className="font-semibold text-slate-700 text-xs">
							<Translate text={localizationConstants.personalAnstalld} />
						</Label>
						<Controller
							name="employeeId"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="h-9 w-full text-xs border-slate-200 bg-white flex items-center justify-between">
										<SelectValue placeholder={t(localizationConstants.addUsers) || "Select..."} />
									</SelectTrigger>
									<SelectContent className="w-[calc(100vw-80px)] sm:w-[var(--radix-select-trigger-width)] max-h-60 overflow-y-auto z-50 bg-white">
										{employeesList.map((emp) => (
											<SelectItem key={emp.id} value={emp.id} className="text-xs">
												{emp.name} ({emp.initials})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						{errors.employeeId && (
							<p className="text-[11px] text-red-500 font-medium">{errors.employeeId.message}</p>
						)}
					</div>

					{/* Start Day & Duration (Responsive Grid) */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
						<div className="space-y-1.5 w-full">
							<Label className="font-semibold text-slate-700 text-xs">
								<Translate text={localizationConstants.startdag} />
							</Label>
							<Controller
								name="dayStart"
								control={control}
								render={({ field }) => (
									<Select
										value={String(field.value)}
										onValueChange={(val) => field.onChange(Number(val))}
									>
										<SelectTrigger className="h-9 w-full text-xs border-slate-200 bg-white flex items-center justify-between">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="w-[calc(100vw-80px)] sm:w-[var(--radix-select-trigger-width)] max-h-60 overflow-y-auto z-50 bg-white">
											{daysHeader.map((d) => (
												<SelectItem key={d.dayNumber} value={String(d.dayNumber)} className="text-xs">
													{d.dayNumber}{" "}
													{t(localizationConstants[d.dayNameKey as keyof typeof localizationConstants]) ||
														d.dayNameKey}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.dayStart && (
								<p className="text-[11px] text-red-500 font-medium">{errors.dayStart.message}</p>
							)}
						</div>

						<div className="space-y-1.5 w-full">
							<Label className="font-semibold text-slate-700 text-xs">
								<Translate text={localizationConstants.varaktighetDagar} />
							</Label>
							<Controller
								name="daySpan"
								control={control}
								render={({ field }) => (
									<Select
										value={String(field.value)}
										onValueChange={(val) => field.onChange(Number(val))}
									>
										<SelectTrigger className="h-9 w-full text-xs border-slate-200 bg-white flex items-center justify-between">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="w-[calc(100vw-80px)] sm:w-[var(--radix-select-trigger-width)] max-h-60 overflow-y-auto z-50 bg-white">
											{[1, 2, 3, 4, 5, 6, 7].map((num) => (
												<SelectItem key={num} value={String(num)} className="text-xs">
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.daySpan && (
								<p className="text-[11px] text-red-500 font-medium">{errors.daySpan.message}</p>
							)}
						</div>
					</div>

					{/* Color Theme & Status (Responsive Grid) */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
						<div className="space-y-1.5 w-full">
							<Label className="font-semibold text-slate-700 text-xs">
								<Translate text={localizationConstants.fargtema} />
							</Label>
							<Controller
								name="colorTheme"
								control={control}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="h-9 w-full text-xs border-slate-200 bg-white flex items-center justify-between">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="w-[calc(100vw-80px)] sm:w-[var(--radix-select-trigger-width)] max-h-60 overflow-y-auto z-50 bg-white">
											<SelectItem value="blue" className="text-xs">
												{t(localizationConstants.colorBlue) || "Blå"}
											</SelectItem>
											<SelectItem value="yellow" className="text-xs">
												{t(localizationConstants.colorYellow) || "Gul"}
											</SelectItem>
											<SelectItem value="green" className="text-xs">
												{t(localizationConstants.colorGreen) || "Grön"}
											</SelectItem>
											<SelectItem value="purple" className="text-xs">
												{t(localizationConstants.colorPurple) || "Lila"}
											</SelectItem>
											<SelectItem value="pink" className="text-xs">
												{t(localizationConstants.colorOrange) || "Rosa / Orange"}
											</SelectItem>
											<SelectItem value="light-purple" className="text-xs">
												{t(localizationConstants.colorPurple) || "Ljuslila"}
											</SelectItem>
											<SelectItem value="light-yellow" className="text-xs">
												{t(localizationConstants.colorYellow) || "Ljusgul"}
											</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.colorTheme && (
								<p className="text-[11px] text-red-500 font-medium">{errors.colorTheme.message}</p>
							)}
						</div>

						<div className="space-y-1.5 w-full">
							<Label className="font-semibold text-slate-700 text-xs">
								<Translate text={localizationConstants.status} />
							</Label>
							<Controller
								name="status"
								control={control}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="h-9 w-full text-xs border-slate-200 bg-white flex items-center justify-between">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="w-[calc(100vw-80px)] sm:w-[var(--radix-select-trigger-width)] max-h-60 overflow-y-auto z-50 bg-white">
											<SelectItem value="completed" className="text-xs">
												<Translate text={localizationConstants.planningCompleted} />
											</SelectItem>
											<SelectItem value="in_progress" className="text-xs">
												<Translate text={localizationConstants.planningInProgress} />
											</SelectItem>
											<SelectItem value="not_started" className="text-xs">
												<Translate text={localizationConstants.planningNotStarted} />
											</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.status && (
								<p className="text-[11px] text-red-500 font-medium">{errors.status.message}</p>
							)}
						</div>
					</div>

					{/* Action Buttons (Responsive) */}
					<div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-slate-100">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="w-full sm:w-auto px-4 h-9 rounded-lg border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
						>
							<Translate text={localizationConstants.avbryt} />
						</Button>
						<Button
							type="submit"
							disabled={isSaving}
							className="w-full sm:w-auto px-4 h-9 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
						>
							{isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
							<Translate text={localizationConstants.spara} />
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default PersonnelCreateTaskModal;
