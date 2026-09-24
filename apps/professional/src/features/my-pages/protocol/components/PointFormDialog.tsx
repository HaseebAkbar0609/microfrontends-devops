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
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	MeetingPoint,
	ProtocolType,
} from "../constants/data";
import { PointValues, pointSchema } from "../schemas/protocol.schema";
import { useParticipants } from "../../shared/api";
import { MyPagesQueryState } from "../../shared/feedback";

const EMPTY_VALUES: PointValues = {
	nr: "",
	responsible: "",
	title: "",
	description: "",
	decision: "",
};

const TYPE_SUBTITLE_KEY: Record<ProtocolType, string> = {
	standard: localizationConstants.protocolCreateStandard,
	action: localizationConstants.protocolCreateAction,
};

interface PointFormDialogProps {
	open: boolean;
	type: ProtocolType;
	editingPoint: MeetingPoint | null;
	onClose: () => void;
	onSave: (values: PointValues) => Promise<boolean>;
}

const PointFormDialog = ({
	open,
	type,
	editingPoint,
	onClose,
	onSave,
}: PointFormDialogProps) => {
	const t = useTranslate();
	const participantQuery = useParticipants();
	const PROTOCOL_PARTICIPANTS = participantQuery.data ?? [];
	const form = useForm<PointValues>({
		resolver: zodResolver(pointSchema),
		defaultValues: EMPTY_VALUES,
	});

	useEffect(() => {
		if (open)
			form.reset(
				editingPoint
					? {
							nr: editingPoint.nr,
							responsible: editingPoint.responsible,
							title: editingPoint.subject,
							description: editingPoint.description,
							decision: editingPoint.decision,
						}
					: EMPTY_VALUES,
			);
	}, [open, editingPoint, form]);

	const handleSave = form.handleSubmit(async (values) => {
		if (await onSave(values)) onClose();
	});

	return (
		<Dialog open={open} onOpenChange={(value) => !value && !form.formState.isSubmitting && onClose()}>
			<DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-lg bg-white p-6">
				<MyPagesQueryState query={participantQuery} />
				<div>
					<DialogTitle className="text-lg font-bold text-slate-900">
						<Translate
							text={
								editingPoint
									? localizationConstants.protocolEditPointTitle
									: localizationConstants.protocolNewPointTitle
							}
						/>
					</DialogTitle>
					<p className="mt-1 text-sm text-slate-500">
						<Translate text={TYPE_SUBTITLE_KEY[type]} />
					</p>
				</div>
				<Form {...form}>
					<form onSubmit={handleSave} className="flex flex-col gap-4">
						<FormField
							control={form.control}
							name="nr"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.protocolPointColNr
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
							name="responsible"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.protocolFieldResponsible
											}
										/>
									</FormLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
									>
										<FormControl>
											<SelectTrigger className="h-10 w-full border-slate-200 text-sm">
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{PROTOCOL_PARTICIPANTS.map(
												(participant) => (
													<SelectItem
														key={participant.id}
														value={participant.name}
													>
														{participant.name}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.protocolFieldTitle
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
											rows={3}
											className="border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="decision"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.protocolPointColDecision
											}
										/>
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={3}
											className="border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-3 pt-1">
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
								<Translate text={localizationConstants.save} />
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default PointFormDialog;
