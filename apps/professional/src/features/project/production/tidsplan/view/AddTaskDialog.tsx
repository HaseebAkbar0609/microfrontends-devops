"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

import { Form, FormDatePicker, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

/** The longest task name accepted (rule 1: a named limit). */
export const TASK_NAME_MAX_LENGTH = 120;

const taskSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, localizationConstants.projectTimeplanTaskNameRequired)
			.max(TASK_NAME_MAX_LENGTH, localizationConstants.protocolValMaxLength),
		startDate: z.string().min(1, localizationConstants.planningValidationStartDateRequired),
		endDate: z.string().min(1, localizationConstants.planningValidationEndDateRequired),
	})
	.refine((v) => !v.startDate || !v.endDate || v.endDate >= v.startDate, {
		path: ["endDate"],
		message: localizationConstants.orderValidationDateRangeInvalid,
	});

export type NewTaskValues = z.infer<typeof taskSchema>;

export interface AddTaskDialogProps {
	open: boolean;
	/** Prefills the dates — the parent's span, or the plan's for a new phase. */
	defaultStart: string;
	defaultEnd: string;
	onClose: () => void;
	onAdd: (values: NewTaskValues) => void;
}

/**
 * "Lägg till ny aktivitet" — a name and a date range.
 *
 * No frame draws it; it exists so the row `+` and the header `+` do something.
 * The caller mounts it with a `key` per target, because RHF captures
 * `defaultValues` once: a dialog reused for a second parent would otherwise keep
 * the first parent's dates.
 */
export function AddTaskDialog({ open, defaultStart, defaultEnd, onClose, onAdd }: AddTaskDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);

	const form = useForm<NewTaskValues>({
		resolver: zodResolver(taskSchema) as Resolver<NewTaskValues>,
		defaultValues: { name: "", startDate: defaultStart, endDate: defaultEnd },
		mode: "onTouched",
	});
	const startDate = form.watch("startDate");

	return (
		<Dialog open={open} onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.addTaskModalTitle} />
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onAdd)}
						noValidate
						className="flex flex-col gap-4"
					>
						<FormInput
							control={form.control}
							name="name"
							label={localizationConstants.taskNameLabel}
							required
							inputProps={{ maxLength: TASK_NAME_MAX_LENGTH, autoFocus: true }}
							translateError={translateError}
						/>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<FormDatePicker
								control={form.control}
								name="startDate"
								label={localizationConstants.orderStartDatumLabel}
								placeholder={localizationConstants.pickDatePlaceholder}
								iconPosition="start"
								translateError={translateError}
							/>
							<FormDatePicker
								control={form.control}
								name="endDate"
								label={localizationConstants.orderSlutDatumLabel}
								placeholder={localizationConstants.pickDatePlaceholder}
								iconPosition="start"
								minDate={startDate}
								translateError={translateError}
							/>
						</div>

						<DialogFooter className="gap-2 sm:gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="cursor-pointer border-slate-200"
							>
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button
								type="submit"
								className="cursor-pointer bg-[#111721] text-white hover:bg-slate-800"
							>
								<Translate text={localizationConstants.addTaskButton} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default AddTaskDialog;
