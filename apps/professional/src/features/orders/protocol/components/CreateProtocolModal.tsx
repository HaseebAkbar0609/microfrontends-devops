"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
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
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS, type ProtocolTemplateType } from "../constants/protocol.constants";
import type { CreateProtocolPayload } from "../types/protocol.types";
import {
	createProtocolSchema,
	type CreateProtocolFormData,
} from "../validation/protocol.validation";
import { MeetingProjectInfo } from "./create-meeting/MeetingProjectInfo";
import { MeetingGeneralFields } from "./create-meeting/MeetingGeneralFields";
import { MeetingParticipantsField } from "./create-meeting/MeetingParticipantsField";
import { MeetingDateTimeFields } from "./create-meeting/MeetingDateTimeFields";

export type { CreateProtocolFormData };

export interface CreateProtocolModalProps {
	isOpen: boolean;
	templateType: ProtocolTemplateType;
	orderId?: string;
	projectNumber?: string;
	projectName?: string;
	onClose: () => void;
	onSave: (data: CreateProtocolPayload) => Promise<void> | void;
}

export function CreateProtocolModal({
	isOpen,
	templateType,
	orderId = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	projectNumber = PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NUMBER,
	projectName = PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NAME,
	onClose,
	onSave,
}: CreateProtocolModalProps) {
	const t = useTranslate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [participants, setParticipants] = useState<string[]>([
		...PROTOCOL_CONSTANTS.DEFAULT_PARTICIPANTS,
	]);

	const schema = useMemo(
		() =>
			createProtocolSchema(
				t(localizationConstants.validationProtocolDateRequired),
				t(localizationConstants.validationProtocolTypeRequired),
				t(localizationConstants.validationProtocolSubjectRequired)
			),
		[t]
	);

	const form = useForm<CreateProtocolFormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			responsible: PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE,
			rubrik: "",
			type: PROTOCOL_CONSTANTS.UPLOAD_PROTOCOL_TYPES[0],
			category: PROTOCOL_CONSTANTS.CATEGORIES[0],
			address: "",
			postalCode: PROTOCOL_CONSTANTS.DEFAULT_POSTAL_CODE,
			city: PROTOCOL_CONSTANTS.DEFAULT_CITY,
			location: PROTOCOL_CONSTANTS.DEFAULT_LOCATION,
			startDate: PROTOCOL_CONSTANTS.DEFAULT_UPLOAD_DATE,
			startTime: PROTOCOL_CONSTANTS.DEFAULT_START_TIME,
			endDate: PROTOCOL_CONSTANTS.DEFAULT_UPLOAD_DATE,
			endTime: PROTOCOL_CONSTANTS.DEFAULT_END_TIME,
			notes: "",
		},
	});

	useEffect(() => {
		if (!isOpen) {
			form.reset();
			setParticipants([...PROTOCOL_CONSTANTS.DEFAULT_PARTICIPANTS]);
		}
	}, [isOpen, form]);

	const handleRemoveParticipant = (name: string) => {
		setParticipants((prev) => prev.filter((p) => p !== name));
	};

	const handleAddParticipant = (name: string) => {
		if (!participants.includes(name)) {
			setParticipants((prev) => [...prev, name]);
		}
	};

	const onSubmit = async (values: CreateProtocolFormData) => {
		try {
			setIsSubmitting(true);
			await onSave({
				orderId,
				projectNumber,
				projectName,
				date: values.startDate,
				type: values.type,
				category: values.category,
				address: values.address,
				postalCode: values.postalCode,
				city: values.city,
				participants,
				location: values.location,
				startTime: values.startTime,
				endTime: values.endTime,
				protocolName: values.rubrik,
				documentName: `${values.rubrik}.pdf`,
				responsible: values.responsible,
				templateType,
				notes: values.notes,
			});
			onClose();
		} catch (error) {
			console.error("[CreateProtocolModal] Submission error:", error);
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSubmitting(false);
		}
	};

	const subtitleKey =
		templateType === PROTOCOL_CONSTANTS.TEMPLATE_TYPES.ACTION
			? localizationConstants.protocolAction
			: localizationConstants.protocolStandard;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[calc(100vw-2rem)] sm:w-[620px] sm:max-w-[620px] rounded-2xl bg-white p-6 sm:p-7 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto"
			>
				{/* Modal Header */}
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
					<div>
						<DialogTitle className="font-sans font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
							<Translate text={localizationConstants.protocolNewMeetingTitle} />
						</DialogTitle>
						<p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
							<Translate text={subtitleKey} />
						</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-8 w-8 p-1 text-zinc-500 hover:text-zinc-900 hover:bg-slate-100 rounded-md cursor-pointer shrink-0"
						aria-label={t(localizationConstants.ariaLabelCloseModal)}
					>
						<X className="h-5 w-5 text-zinc-500" />
					</Button>
				</DialogHeader>

				{/* Modal Form */}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
						{/* Row 1: Projekt nr & Projekt namn */}
						<MeetingProjectInfo projectNumber={projectNumber} projectName={projectName} />

						{/* Rows 2-5: Ansvarig, Rubrik, Typ, Kategori, Adress, Post nr, Ort */}
						<MeetingGeneralFields form={form} />

						{/* Row 6: Lägg till deltagare & Plats */}
						<MeetingParticipantsField
							participants={participants}
							onAddParticipant={handleAddParticipant}
							onRemoveParticipant={handleRemoveParticipant}
							form={form}
						/>

						{/* Rows 7-8: Start tid & Slut tid */}
						<MeetingDateTimeFields form={form} />

						{/* Row 9: Notes textarea */}
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolMeetingInfoLabel} />
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder={t(localizationConstants.protocolMeetingInfoPlaceholder)}
											className="min-h-[85px] rounded-lg border-slate-200 bg-white text-slate-900 text-sm p-3 shadow-none focus-visible:ring-slate-900 resize-y"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Footer Buttons */}
						<div className="flex items-center justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-10 px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-sm font-normal cursor-pointer shadow-none"
							>
								<Translate text={localizationConstants.closeButton} />
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="h-10 px-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium cursor-pointer shadow-none flex items-center gap-2"
							>
								{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
								<span>
									<Translate text={localizationConstants.protocolNextButton} />
								</span>
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default CreateProtocolModal;
