"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm, type Resolver } from "react-hook-form";

import { Form, FormDatePicker } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { newDiarySchema, type NewDiaryValues } from "../form/diaryFormSchema";

export interface NewDiaryDialogProps {
	/** The day the dialog starts on — the one being shown, if any. */
	initialDate: string;
	/** Days that already have a diary; picking one is refused. */
	takenDates: ReadonlySet<string>;
	onCreate: (date: string) => void;
	onClose: () => void;
}

/**
 * Ny dagbok: pick the day, then Skapa opens an empty draft for it. A day that
 * already has a diary is refused here — and again in the store. Mounted only
 * while open.
 */
export function NewDiaryDialog({ initialDate, takenDates, onCreate, onClose }: NewDiaryDialogProps) {
	const t = useTranslate();
	const form = useForm<NewDiaryValues>({
		resolver: zodResolver(
			newDiarySchema.refine((values) => !takenDates.has(values.date), {
				path: ["date"],
				message: localizationConstants.projectDiaryDateTaken,
			}),
		) as Resolver<NewDiaryValues>,
		defaultValues: { date: takenDates.has(initialDate) ? "" : initialDate },
		mode: "onChange",
	});

	const submit = form.handleSubmit(({ date }) => {
		onCreate(date);
		onClose();
	});

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.projectDiaryNewDiary} />
					</DialogTitle>
					<DialogDescription>
						<Translate text={localizationConstants.projectDiaryNewDiaryDesc} />
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form noValidate onSubmit={submit} className="flex flex-col gap-4">
						<FormDatePicker
							control={form.control}
							name="date"
							label={localizationConstants.projectDiaryDate}
							iconPosition="start"
							translateError={(message) => t(message as TranslationKeys)}
						/>
						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button type="submit" className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800">
								<Plus className="h-4 w-4" aria-hidden />
								<Translate text={localizationConstants.projectDiaryCreate} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default NewDiaryDialog;
