"use client";

import React, { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderTimeplanTask } from "../../types/timeplan.types";
import {
	orderTimeplanAddTaskSchema,
	type OrderTimeplanAddTaskFormData,
} from "../../validation/timeplan.validation";

interface OrderTimeplanAddTaskModalProps {
	isOpen: boolean;
	parentTask: OrderTimeplanTask | null;
	onClose: () => void;
	onAdd: (newTask: Partial<OrderTimeplanTask>, parentId?: string) => void;
}

export function OrderTimeplanAddTaskModal({
	isOpen,
	parentTask,
	onClose,
	onAdd,
}: OrderTimeplanAddTaskModalProps) {
	const t = useTranslate();
	const todayStr = new Date().toISOString().slice(0, 10);

	const defaultStartDate = parentTask?.startDate
		? parentTask.startDate.replace(/\//g, "-")
		: todayStr;
	const defaultEndDate = parentTask?.endDate
		? parentTask.endDate.replace(/\//g, "-")
		: todayStr;

	const form = useForm<OrderTimeplanAddTaskFormData>({
		resolver: zodResolver(orderTimeplanAddTaskSchema) as Resolver<OrderTimeplanAddTaskFormData>,
		defaultValues: {
			name: "",
			kind: "subtask",
			startDate: defaultStartDate,
			endDate: defaultEndDate,
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (isOpen) {
			form.reset({
				name: "",
				kind: "subtask",
				startDate: parentTask?.startDate
					? parentTask.startDate.replace(/\//g, "-")
					: todayStr,
				endDate: parentTask?.endDate
					? parentTask.endDate.replace(/\//g, "-")
					: todayStr,
			});
		}
	}, [isOpen, parentTask, todayStr, form]);

	const onSubmit = (values: OrderTimeplanAddTaskFormData) => {
		onAdd(
			{
				name: values.name.trim(),
				kind: values.kind,
				startDate: values.startDate,
				endDate: values.endDate,
				color:
					parentTask?.color && !parentTask.color.includes("transparent")
						? parentTask.color
						: "bg-cyan-500",
			},
			parentTask?.id
		);

		form.reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md bg-white p-6 rounded-xl font-sans border-slate-200">
				<DialogHeader>
					<DialogTitle className="text-base font-semibold text-slate-900 font-sans">
						<Translate text={localizationConstants.orderTimeplanAddTaskModalTitle} />
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2 font-sans">
						{/* Task Name */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="font-sans text-xs font-medium text-slate-700">
										<Translate text={localizationConstants.orderTimeplanAddTaskName} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(localizationConstants.orderTimeplanAddTaskName)}
											className="h-10 border-slate-200 text-sm font-sans rounded-lg focus-visible:ring-1 focus-visible:ring-slate-900 shadow-none"
										/>
									</FormControl>
									<FormMessage className="text-xs text-rose-500 font-sans" />
								</FormItem>
							)}
						/>

						{/* Task Kind */}
						<FormField
							control={form.control}
							name="kind"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="font-sans text-xs font-medium text-slate-700">
										<Translate text={localizationConstants.orderTimeplanAddTaskCategory} />
									</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className="h-10 border-slate-200 text-sm bg-white font-sans rounded-lg shadow-none focus-visible:ring-1 focus-visible:ring-slate-900">
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-white font-sans">
											<SelectItem value="subtask">
												<Translate text={localizationConstants.orderTimeplanSubtask} />
											</SelectItem>
											<SelectItem value="milestone">
												<Translate text={localizationConstants.orderTimeplanMilestone} />
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage className="text-xs text-rose-500 font-sans" />
								</FormItem>
							)}
						/>

						{/* Start Date & End Date */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="font-sans text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.orderTimeplanFieldStartDate} />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="date"
												className="h-10 border-slate-200 text-sm font-sans rounded-lg shadow-none focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-rose-500 font-sans" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="font-sans text-xs font-medium text-slate-700">
											<Translate text={localizationConstants.orderTimeplanFieldEndDate} />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="date"
												className="h-10 border-slate-200 text-sm font-sans rounded-lg shadow-none focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-rose-500 font-sans" />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className="pt-3 flex items-center justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-9 px-4 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 font-sans text-sm font-medium cursor-pointer shadow-none"
							>
								<Translate text={localizationConstants.orderTimeplanBtnCancel} />
							</Button>
							<Button
								type="submit"
								className="h-9 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-sans text-sm font-medium cursor-pointer shadow-none"
							>
								<Translate text={localizationConstants.orderTimeplanAddTaskBtn} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
