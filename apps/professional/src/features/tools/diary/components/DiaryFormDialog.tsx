"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { DiaryEntry } from "../constants/mockData";
import { DiaryValues, diarySchema } from "../schemas/diary.schema";

const EMPTY_VALUES: DiaryValues = {
	title: "",
	projectName: "",
	date: "",
	description: "",
};

interface DiaryFormDialogProps {
	open: boolean;
	editingEntry: DiaryEntry | null;
	onClose: () => void;
	onSave: (values: DiaryValues) => void;
}

const DiaryFormDialog = ({
	open,
	editingEntry,
	onClose,
	onSave,
}: DiaryFormDialogProps) => {
	const t = useTranslate();
	const form = useForm<DiaryValues>({
		resolver: zodResolver(diarySchema),
		defaultValues: EMPTY_VALUES,
	});

	useEffect(() => {
		if (open)
			form.reset(
				editingEntry
					? {
							title: editingEntry.title,
							projectName: editingEntry.projectName,
							date: editingEntry.date,
							description: editingEntry.description,
						}
					: { ...EMPTY_VALUES, date: mockDate(0) },
			);
	}, [open, editingEntry, form]);

	const handleSave = form.handleSubmit((values) => {
		onSave(values);
		onClose();
	});

	return (
		<Dialog open={open} onOpenChange={(value) => !value && onClose()}>
			<DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-lg bg-white p-7">
				<DialogTitle className="text-xl font-bold text-slate-900">
					<Translate
						text={
							editingEntry
								? localizationConstants.diaryViewTitle
								: localizationConstants.diaryNewTitle
						}
					/>
				</DialogTitle>
				<Form {...form}>
					<form onSubmit={handleSave} className="flex flex-col gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.diaryFieldTitle
											}
										/>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="h-10 border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="projectName"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.diaryFieldProject
											}
										/>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="h-10 border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.diaryFieldDate
											}
										/>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="date"
											className="h-10 border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.diaryFieldBody
											}
										/>
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={4}
											placeholder={t(
												localizationConstants.diaryBodyPlaceholder,
											)}
											className="border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-10 rounded-md border-slate-200 bg-white px-6 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate
									text={
										editingEntry
											? localizationConstants.protocolClose
											: localizationConstants.cancel
									}
								/>
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

export default DiaryFormDialog;
