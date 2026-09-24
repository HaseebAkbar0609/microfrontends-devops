"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/components/ui/form";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS, type ProtocolTemplateType } from "../constants/protocol.constants";
import { getProtocolFullDetailAction, updateProtocolFullAction } from "@/api-actions/orders/protocols";
import type { ProtocolDetailData } from "../types/protocol.types";
import {
	MOCK_MEETING_INFO,
	MOCK_NEXT_MEETING,
} from "../data/protocol.mock";
import {
	editProtocolSchema,
	type EditProtocolFormData,
} from "../validation/protocol.validation";
import { EditProtocolTimeSection } from "./edit-protocol/EditProtocolTimeSection";
import { EditProtocolParticipantsSection } from "./edit-protocol/EditProtocolParticipantsSection";
import { EditProtocolOtherInfoSection } from "./edit-protocol/EditProtocolOtherInfoSection";
import { EditProtocolNextMeetingSection } from "./edit-protocol/EditProtocolNextMeetingSection";
import { ProjectInfoCard } from "./ProtocolSharedComponents";

/* -------------------------------------------------------------------------- */
/* Main Component: EditProtocolView                                           */
/* -------------------------------------------------------------------------- */
export interface EditProtocolViewProps {
	protocolId: string;
	orderId?: string;
	templateType?: ProtocolTemplateType;
	onBack: () => void;
	onSaved?: (updated: ProtocolDetailData) => void;
}

export function EditProtocolView({
	protocolId,
	orderId = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	templateType = PROTOCOL_CONSTANTS.TEMPLATE_TYPES.STANDARD,
	onBack,
	onSaved,
}: EditProtocolViewProps) {
	const t = useTranslate();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [detailData, setDetailData] = useState<ProtocolDetailData | null>(null);

	const isAction = templateType === PROTOCOL_CONSTANTS.TEMPLATE_TYPES.ACTION;

	const requiredMsg = t(localizationConstants.protocolValRequired);
	const schema = useMemo(() => editProtocolSchema(requiredMsg), [requiredMsg]);

	const form = useForm<EditProtocolFormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			startDate: MOCK_MEETING_INFO.startDate,
			startTime: MOCK_MEETING_INFO.startTime,
			endDate: MOCK_MEETING_INFO.endDate,
			endTime: MOCK_MEETING_INFO.endTime,
			host: MOCK_MEETING_INFO.host,
			participants: [...MOCK_MEETING_INFO.participants],
			protocolNumber: MOCK_MEETING_INFO.protocolNumber,
			topic: MOCK_MEETING_INFO.topic,
			rubrik: MOCK_MEETING_INFO.rubrik,
			category: MOCK_MEETING_INFO.category,
			location: MOCK_MEETING_INFO.location,
			address: MOCK_MEETING_INFO.address,
			postalCode: MOCK_MEETING_INFO.postalCode,
			city: MOCK_MEETING_INFO.city,
			information: MOCK_MEETING_INFO.information,
			comment: MOCK_MEETING_INFO.comment,
			nextMeetingResponsible: MOCK_NEXT_MEETING.host,
			nextMeetingRubrik: MOCK_NEXT_MEETING.rubrik,
			nextMeetingCategory: MOCK_NEXT_MEETING.category,
			nextMeetingAddress: MOCK_NEXT_MEETING.address,
			nextMeetingPostalCode: MOCK_NEXT_MEETING.postalCode,
			nextMeetingCity: MOCK_NEXT_MEETING.city,
			nextMeetingParticipants: [...MOCK_NEXT_MEETING.participants],
			nextMeetingLocation: MOCK_NEXT_MEETING.location,
			nextMeetingStartDate: MOCK_NEXT_MEETING.startDate,
			nextMeetingStartTime: MOCK_NEXT_MEETING.startTime,
			nextMeetingEndDate: MOCK_NEXT_MEETING.endDate,
			nextMeetingEndTime: MOCK_NEXT_MEETING.endTime,
			nextMeetingInfo: MOCK_NEXT_MEETING.information,
		},
	});

	useEffect(() => {
		let isMounted = true;
		const loadDetail = async () => {
			setIsLoading(true);
			const result = await getProtocolFullDetailAction(orderId, protocolId);
			if (isMounted) {
				if (result.success && result.data) {
					setDetailData(result.data);
					const data = result.data;
					const protocol = data.protocol || ({} as Partial<ProtocolDetailData["protocol"]>);
					const meetingInfo = data.meetingInfo || ({} as Partial<ProtocolDetailData["meetingInfo"]>);
					const nextMeeting = data.nextMeeting || ({} as Partial<ProtocolDetailData["nextMeeting"]>);
					form.reset({
						startDate: meetingInfo.startDate || protocol.date || MOCK_MEETING_INFO.startDate,
						startTime: meetingInfo.startTime || protocol.startTime || MOCK_MEETING_INFO.startTime,
						endDate: meetingInfo.endDate || protocol.date || MOCK_MEETING_INFO.endDate,
						endTime: meetingInfo.endTime || protocol.endTime || MOCK_MEETING_INFO.endTime,
						host: meetingInfo.host || protocol.responsible || MOCK_MEETING_INFO.host,
						participants: meetingInfo.participants || protocol.participants || [...MOCK_MEETING_INFO.participants],
						protocolNumber: meetingInfo.protocolNumber || MOCK_MEETING_INFO.protocolNumber,
						topic: meetingInfo.topic ?? MOCK_MEETING_INFO.topic,
						rubrik: meetingInfo.rubrik || protocol.protocolName || MOCK_MEETING_INFO.rubrik,
						category: meetingInfo.category || protocol.category || MOCK_MEETING_INFO.category,
						location: meetingInfo.location || protocol.location || MOCK_MEETING_INFO.location,
						address: meetingInfo.address || protocol.address || MOCK_MEETING_INFO.address,
						postalCode: meetingInfo.postalCode || protocol.postalCode || MOCK_MEETING_INFO.postalCode,
						city: meetingInfo.city || protocol.city || MOCK_MEETING_INFO.city,
						information: meetingInfo.information || protocol.notes || MOCK_MEETING_INFO.information,
						comment: meetingInfo.comment ?? MOCK_MEETING_INFO.comment,
						nextMeetingResponsible: nextMeeting?.host || MOCK_NEXT_MEETING.host,
						nextMeetingRubrik: nextMeeting?.rubrik || MOCK_NEXT_MEETING.rubrik,
						nextMeetingCategory: nextMeeting?.category || MOCK_NEXT_MEETING.category,
						nextMeetingAddress: nextMeeting?.address || MOCK_NEXT_MEETING.address,
						nextMeetingPostalCode: nextMeeting?.postalCode || MOCK_NEXT_MEETING.postalCode,
						nextMeetingCity: nextMeeting?.city || MOCK_NEXT_MEETING.city,
						nextMeetingParticipants: nextMeeting?.participants || [...MOCK_NEXT_MEETING.participants],
						nextMeetingLocation: nextMeeting?.location || MOCK_NEXT_MEETING.location,
						nextMeetingStartDate: nextMeeting?.startDate || MOCK_NEXT_MEETING.startDate,
						nextMeetingStartTime: nextMeeting?.startTime || MOCK_NEXT_MEETING.startTime,
						nextMeetingEndDate: nextMeeting?.endDate || MOCK_NEXT_MEETING.endDate,
						nextMeetingEndTime: nextMeeting?.endTime || MOCK_NEXT_MEETING.endTime,
						nextMeetingInfo: nextMeeting?.information || MOCK_NEXT_MEETING.information,
					});
				} else {
					showToast("error", t(localizationConstants.genericError));
				}
				setIsLoading(false);
			}
		};

		loadDetail();
		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [protocolId, orderId]);

	const onSubmit = async (values: EditProtocolFormData) => {
		setIsSubmitting(true);
		const result = await updateProtocolFullAction(orderId, protocolId, {
			startDate: values.startDate,
			startTime: values.startTime,
			endDate: values.endDate,
			endTime: values.endTime,
			host: values.host,
			participants: values.participants,
			protocolNumber: values.protocolNumber,
			topic: values.topic,
			rubrik: values.rubrik,
			category: values.category,
			location: values.location,
			address: values.address,
			postalCode: values.postalCode,
			city: values.city,
			information: values.information,
			comment: values.comment,
			nextMeeting: {
				host: values.nextMeetingResponsible,
				rubrik: values.nextMeetingRubrik,
				category: values.nextMeetingCategory,
				address: values.nextMeetingAddress,
				postalCode: values.nextMeetingPostalCode,
				city: values.nextMeetingCity,
				participants: values.nextMeetingParticipants,
				location: values.nextMeetingLocation,
				startDate: values.nextMeetingStartDate,
				startTime: values.nextMeetingStartTime,
				endDate: values.nextMeetingEndDate,
				endTime: values.nextMeetingEndTime,
				information: values.nextMeetingInfo,
			},
		});
		if (result.success && result.data) {
			showToast("success", t(localizationConstants.protocolSavedToast));
			onSaved?.(result.data);
			onBack();
		} else {
			showToast("error", t(localizationConstants.genericError));
		}
		setIsSubmitting(false);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50">
				<div className="flex items-center gap-2 pb-1 animate-pulse">
					<Skeleton className="size-7 rounded-md" />
					<div className="space-y-1">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
				<div className="space-y-4 w-full pl-0 sm:pl-7 pt-4">
					<div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
						<div className="order-2 lg:order-1 flex-1 min-w-0 space-y-4 sm:space-y-6">
							<Skeleton className="h-48 w-full rounded-lg" />
							<Skeleton className="h-48 w-full rounded-lg" />
							<Skeleton className="h-64 w-full rounded-lg" />
							<Skeleton className="h-64 w-full rounded-lg" />
						</div>
						<div className="order-1 lg:order-2 w-full lg:w-[333px] shrink-0">
							<Skeleton className="h-48 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px -mb-4 px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 space-y-4 w-full">
					{/* Header: Back arrow, Title & Subtitle */}
					<div className="flex items-start gap-2.5 pb-1">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={onBack}
							className="size-7 shrink-0 rounded-md text-slate-900 hover:bg-slate-100 cursor-pointer flex items-center justify-center p-0 mt-0.5 shadow-none"
							aria-label={t(localizationConstants.goBackButton)}
						>
							<ArrowLeft className="size-5 text-slate-900" aria-hidden="true" />
						</Button>
						<div className="flex flex-col">
							<h1 className="font-sans text-lg sm:text-xl md:text-2xl font-semibold leading-tight tracking-[-0.6px] text-slate-900">
								<Translate text={isAction ? localizationConstants.protocolEditActionTitle : localizationConstants.protocolEditTitle} />
							</h1>
							<p className="font-sans text-xs text-slate-500 font-normal mt-0.5">
								<Translate text={isAction ? localizationConstants.protocolCreateAction : localizationConstants.protocolCreateStandard} />
							</p>
						</div>
					</div>

					{/* Main Grid Container */}
					<div className="space-y-4 w-full pl-0 sm:pl-7">
						<div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
							{/* Left Column (4 Accordion Sections) */}
							<div className="order-2 lg:order-1 flex-1 min-w-0 space-y-4 sm:space-y-6">
								{/* 1. Tid */}
								<EditProtocolTimeSection form={form} />

								{/* 2. Deltagare */}
								<EditProtocolParticipantsSection form={form} />

								{/* 3. Övrig information */}
								<EditProtocolOtherInfoSection form={form} />

								{/* 4. Nästa möte */}
								<EditProtocolNextMeetingSection form={form} />
							</div>

							{/* Right Sidebar: Project information */}
							<div className="order-1 lg:order-2 w-full lg:w-[333px] shrink-0 lg:mt-[56px]">
								<ProjectInfoCard
									projectNumber={detailData?.protocol?.projectNumber || PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NUMBER}
									projectName={detailData?.protocol?.projectName || PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NAME}
								/>
							</div>
						</div>
					</div>

					{/* Sticky Bottom Action Bar */}
					<div className="mt-auto sticky -bottom-4 -mx-3 sm:-mx-6 -mb-4 px-4 sm:px-6 py-3 bg-white border-t border-slate-200 z-30 flex items-center justify-end gap-3 shadow-md">
						<Button
							type="button"
							variant="ghost"
							onClick={onBack}
							className="min-w-[120px] h-10 px-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-slate-900 text-sm font-medium border-0 cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.protocolCancelAction} />
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="min-w-[120px] h-10 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium border-0 gap-2 cursor-pointer shadow-none flex items-center justify-center"
						>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin text-white" />
							) : (
								<Save className="h-4 w-4 shrink-0 text-white" />
							)}
							<Translate text={localizationConstants.protocolSaveAction} />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

export default EditProtocolView;
