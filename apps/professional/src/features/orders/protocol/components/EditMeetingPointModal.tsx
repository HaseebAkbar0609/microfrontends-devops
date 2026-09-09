"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import type { ProtocolMeetingPoint } from "../types/protocol.types";
import {
	meetingPointSchema,
	type MeetingPointFormData,
} from "../validation/protocol.validation";

interface EditMeetingPointModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (point: ProtocolMeetingPoint) => void;
	point?: ProtocolMeetingPoint | null;
}

export const EditMeetingPointModal: React.FC<EditMeetingPointModalProps> = ({
	open,
	onClose,
	onSave,
	point,
}) => {
	const t = useTranslate();
	const requiredMsg = t(localizationConstants.protocolValRequired) || "Detta fält är obligatoriskt";

	const form = useForm<MeetingPointFormData>({
		resolver: zodResolver(meetingPointSchema(requiredMsg)),
		defaultValues: {
			nr: point?.nr || PROTOCOL_CONSTANTS.DEFAULT_POINT_NR,
			responsible: point?.responsible || PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE,
			subject: point?.subject || PROTOCOL_CONSTANTS.DEFAULT_POINT_SUBJECT,
			description: point?.description || "",
			decision: point?.decision || "",
		},
	});

	useEffect(() => {
		if (open && point) {
			form.reset({
				nr: point.nr || PROTOCOL_CONSTANTS.DEFAULT_POINT_NR,
				responsible: point.responsible || PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE,
				subject: point.subject || PROTOCOL_CONSTANTS.DEFAULT_POINT_SUBJECT,
				description: point.description || "",
				decision: point.decision || "",
			});
		}
	}, [open, point, form]);

	const handleSubmit = (values: MeetingPointFormData) => {
		if (!point) return;
		const updatedPoint: ProtocolMeetingPoint = {
			...point,
			nr: values.nr,
			subject: values.subject,
			description: values.description || "",
			decision: values.decision || "",
			responsible: values.responsible || PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE,
		};
		onSave(updatedPoint);
		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={(val) => !val && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[calc(100vw-2rem)] max-w-[480px] p-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col"
			>
				{/* Modal Header */}
				<DialogHeader className="flex flex-row items-start justify-between px-6 pt-5 pb-2 shrink-0">
					<div>
						<DialogTitle className="text-lg font-bold text-slate-900 leading-tight">
							<Translate text={localizationConstants.protocolEditPointTitle} />
						</DialogTitle>
						<p className="text-xs text-slate-500 font-normal mt-0.5">
							<Translate text={localizationConstants.protocolCreateStandard} />
						</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-7 w-7 p-0 text-slate-900 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
						aria-label="Close"
					>
						<X className="w-4 h-4 text-slate-900" />
					</Button>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 pb-6 pt-2 space-y-3.5 overflow-y-auto flex-1">
						{/* Nr */}
						<FormField
							control={form.control}
							name="nr"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolPointColNr} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="008"
											className="h-10 bg-white border-slate-200 text-xs rounded-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 shadow-none"
										/>
									</FormControl>
									<FormMessage className="text-[11px] text-red-500 font-normal" />
								</FormItem>
							)}
						/>

						{/* Ansvarig */}
						<FormField
							control={form.control}
							name="responsible"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldResponsible} />
									</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="w-full h-10 bg-white border-slate-200 text-xs rounded-lg text-slate-900 shadow-none [&>svg]:text-slate-900">
												<SelectValue placeholder={t(localizationConstants.protocolFieldResponsible)} />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="w-[var(--radix-select-trigger-width)] bg-white border-slate-200 text-xs rounded-lg shadow-lg">
											{PROTOCOL_CONSTANTS.AVAILABLE_RESPONSIBLE.map((name) => (
												<SelectItem key={name} value={name} className="text-xs cursor-pointer">
													{name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage className="text-[11px] text-red-500 font-normal" />
								</FormItem>
							)}
						/>

						{/* Rubrik */}
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldTitle} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(localizationConstants.protocolFieldTitle)}
											className="h-10 bg-white border-slate-200 text-xs rounded-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 shadow-none"
										/>
									</FormControl>
									<FormMessage className="text-[11px] text-red-500 font-normal" />
								</FormItem>
							)}
						/>

						{/* Beskrivning */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolPointDescription} />
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={3}
											placeholder={t(localizationConstants.protocolPointDescription)}
											className="min-h-[72px] bg-white border-slate-200 text-xs rounded-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 resize-y shadow-none"
										/>
									</FormControl>
									<FormMessage className="text-[11px] text-red-500 font-normal" />
								</FormItem>
							)}
						/>

						{/* Beslut */}
						<FormField
							control={form.control}
							name="decision"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolPointColDecision} />
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={3}
											placeholder={t(localizationConstants.protocolPointColDecision)}
											className="min-h-[72px] bg-white border-slate-200 text-xs rounded-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 resize-y shadow-none"
										/>
									</FormControl>
									<FormMessage className="text-[11px] text-red-500 font-normal" />
								</FormItem>
							)}
						/>

						{/* Footer buttons */}
						<div className="flex items-center justify-end gap-2.5 pt-3">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-9 px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium cursor-pointer shadow-none"
							>
								<Translate text={localizationConstants.protocolCancelAction} />
							</Button>
							<Button
								type="submit"
								className="h-9 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer shadow-none border-0"
							>
								<Translate text={localizationConstants.protocolSaveAction} />
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditMeetingPointModal;
