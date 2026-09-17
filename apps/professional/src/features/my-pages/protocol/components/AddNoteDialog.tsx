"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProtocolNote } from "../constants/data";
import { NoteValues, noteSchema } from "../schemas/protocol.schema";

const EMPTY_VALUES: NoteValues = { description: "" };

interface AddNoteDialogProps {
	open: boolean;
	editingNote: ProtocolNote | null;
	onClose: () => void;
	onSend: (values: NoteValues) => Promise<boolean>;
}

const AddNoteDialog = ({
	open,
	editingNote,
	onClose,
	onSend,
}: AddNoteDialogProps) => {
	const t = useTranslate();
	const form = useForm<NoteValues>({
		resolver: zodResolver(noteSchema),
		defaultValues: EMPTY_VALUES,
	});

	useEffect(() => {
		if (open)
			form.reset(
				editingNote
					? { description: editingNote.description }
					: EMPTY_VALUES,
			);
	}, [open, editingNote, form]);

	const handleSend = form.handleSubmit(async (values) => {
		if (await onSend(values)) onClose();
	});

	return (
		<Dialog open={open} onOpenChange={(value) => !value && !form.formState.isSubmitting && onClose()}>
			<DialogContent className="max-w-md rounded-lg bg-white p-6">
				<DialogTitle className="text-lg font-bold text-slate-900">
					<Translate text={localizationConstants.protocolNoteTitle} />
				</DialogTitle>
				<Form {...form}>
					<form onSubmit={handleSend} className="flex flex-col gap-4">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.itSupportDescLabel
											}
										/>
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={4}
											placeholder={t(
												localizationConstants.protocolNotePlaceholder,
											)}
											className="border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>
						<div className="flex justify-between pt-1">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-10 rounded-md border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button
								type="submit"
 disabled={form.formState.isSubmitting}
								className="h-10 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
							>
								<Translate
									text={localizationConstants.protocolSend}
								/>
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default AddNoteDialog;
