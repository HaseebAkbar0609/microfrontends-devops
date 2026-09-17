"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { TimeRow } from "../constants/data";
import { TimeRowValues, timeRowSchema } from "../schemas/time.schema";
import TimeEntryFormFields from "./TimeEntryFormFields";

interface EditTimeRowDialogProps {
	open: boolean;
	date: string;
	editingRow: TimeRow | null;
	onClose: () => void;
	onSave: (values: TimeRowValues) => boolean;
}

const EditTimeRowDialog = ({
	open,
	date,
	editingRow,
	onClose,
	onSave,
}: EditTimeRowDialogProps) => {
	const form = useForm<TimeRowValues>({
		resolver: zodResolver(timeRowSchema),
	});

	useEffect(() => {
		if (open && editingRow)
			form.reset({
				date,
				start: editingRow.start,
				end: editingRow.end,
				type: editingRow.type,
				refNr: editingRow.refNr,
				ata: editingRow.ata,
				ataNr: editingRow.ataNr,
				travelUnit: editingRow.travelUnit,
				travelValue: editingRow.travelValue,
				allowance: editingRow.allowance,
				title: editingRow.title,
				description: editingRow.description,
			});
	}, [open, editingRow, date, form]);

	const handleSave = form.handleSubmit((values) => {
		if (onSave(values)) onClose();
		else form.setError("start", { message: localizationConstants.myPagesInvalid });
	});

	return (
		<Dialog open={open} onOpenChange={(value) => !value && onClose()}>
			<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-lg bg-white p-7">
				<DialogTitle className="text-xl font-bold text-slate-900">
					<Translate
						text={localizationConstants.timeEditDialogTitle}
					/>
				</DialogTitle>
				<Form {...form}>
					<form onSubmit={handleSave} className="flex flex-col gap-4">
						<TimeEntryFormFields form={form} />
						<div className="flex justify-end gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-10 rounded-md border-slate-200 bg-white px-6 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button
								type="submit"
								className="h-10 gap-2 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90"
							>
								<Save className="h-4 w-4" />
								<Translate text={localizationConstants.save} />
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditTimeRowDialog;
