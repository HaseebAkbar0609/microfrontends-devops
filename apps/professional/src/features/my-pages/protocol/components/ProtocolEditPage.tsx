"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useMyPagesQuery, useParticipants } from "../../shared/api";
import { MyPagesQueryState, useMyPagesAction } from "../../shared/feedback";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	MeetingDetails,
	Protocol,
	ProtocolType,
} from "../constants/data";
import {
	EditProtocolValues,
	editProtocolSchema,
} from "../schemas/protocol.schema";
import { getProtocol, updateProtocol } from "../services/protocolService";
import ParticipantSelect from "./ParticipantSelect";
import SectionCard from "./SectionCard";
import EditNextMeetingSection from "./edit/EditNextMeetingSection";
import EditOtherInfoSection from "./edit/EditOtherInfoSection";
import { EditSelectField, EditTextField } from "./edit/EditFields";

const TYPE_SUBTITLE_KEY: Record<ProtocolType, string> = {
	standard: localizationConstants.protocolCreateStandard,
	action: localizationConstants.protocolCreateAction,
};

const LIST_ROUTE = "/tools/my-pages/protocol";

const toFormValues = (protocol: Protocol): EditProtocolValues => ({
	startDate: protocol.meeting.startDate,
	startTime: protocol.meeting.startTime,
	endDate: protocol.meeting.endDate,
	endTime: protocol.meeting.endTime,
	host: protocol.meeting.host,
	participantIds: protocol.meeting.participantIds,
	protocolNumber: protocol.meeting.protocolNumber,
	subject: protocol.meeting.subject,
	title: protocol.meeting.title,
	category: protocol.meeting.category,
	location: protocol.meeting.location,
	address: protocol.meeting.address,
	postalCode: protocol.meeting.postalCode,
	city: protocol.meeting.city,
	information: protocol.meeting.information,
	comment: protocol.meeting.comment,
	next: {
		responsible: protocol.nextMeeting.host,
		title: protocol.nextMeeting.title,
		category: protocol.nextMeeting.category,
		address: protocol.nextMeeting.address,
		postalCode: protocol.nextMeeting.postalCode,
		city: protocol.nextMeeting.city,
		participantIds: protocol.nextMeeting.participantIds,
		location: protocol.nextMeeting.location,
		startDate: protocol.nextMeeting.startDate,
		startTime: protocol.nextMeeting.startTime,
		endDate: protocol.nextMeeting.endDate,
		endTime: protocol.nextMeeting.endTime,
		information: protocol.nextMeeting.information,
	},
});

const toMeeting = (values: EditProtocolValues): MeetingDetails => ({
	host: values.host,
	startDate: values.startDate,
	startTime: values.startTime,
	endDate: values.endDate,
	endTime: values.endTime,
	subject: values.subject,
	protocolNumber: values.protocolNumber,
	participantIds: values.participantIds,
	title: values.title,
	category: values.category,
	location: values.location,
	address: values.address,
	postalCode: values.postalCode,
	city: values.city,
	information: values.information,
	comment: values.comment,
});

const toNextMeeting = (values: EditProtocolValues): MeetingDetails => ({
	host: values.next.responsible,
	startDate: values.next.startDate,
	startTime: values.next.startTime,
	endDate: values.next.endDate,
	endTime: values.next.endTime,
	subject: "",
	protocolNumber: "",
	participantIds: values.next.participantIds,
	title: values.next.title,
	category: values.next.category,
	location: values.next.location,
	address: values.next.address,
	postalCode: values.next.postalCode,
	city: values.next.city,
	information: values.next.information,
	comment: "",
});

const ProtocolEditPage = ({ protocolId }: { protocolId: string }) => {
	const router = useRouter();
	const queryResult = useMyPagesQuery(["protocol", protocolId], () => getProtocol(protocolId));
	const protocol = queryResult.data;
	const participants = useParticipants();
	const PARTICIPANT_NAMES = [...new Set((participants.data ?? []).map((participant) => participant.name))];
	const action = useMyPagesAction();
	const loaded = useRef<string | null>(null);
	const baseline = useRef<Protocol | null>(null);
	const form = useForm<EditProtocolValues>({
		resolver: zodResolver(editProtocolSchema),
		defaultValues: protocol ? toFormValues(protocol) : undefined,
	});

	useEffect(() => {
		if (protocol && loaded.current !== protocol.id) {
			form.reset(toFormValues(protocol));
			loaded.current = protocol.id;
			baseline.current = protocol;
		}
	}, [protocol, form]);

	if (!protocol) return <MyPagesQueryState query={queryResult} />;
	if (!protocol.canEdit) return <p><Translate text={localizationConstants.myPagesReadOnly} /></p>;

	const viewRoute = `${LIST_ROUTE}/${protocol.id}`;

	const handleSave = form.handleSubmit(async (values) => {
		const saved = await action.run(() => updateProtocol(baseline.current ?? protocol, {
			date: values.startDate,
			title: values.title,
			department: values.category,
			meeting: toMeeting(values),
			nextMeeting: toNextMeeting(values),
		}), localizationConstants.protocolSavedToast);
		if (saved) router.push(viewRoute);
	});

	return (
		<Form {...form}>
			<form onSubmit={handleSave} className="flex flex-col gap-5">
				<div className="flex items-start gap-3">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => router.push(viewRoute)}
						className="mt-0.5 h-8 w-8 rounded-md text-slate-700"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h2 className="text-2xl font-bold text-slate-900">
							<Translate
								text={localizationConstants.protocolEditTitle}
							/>
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							<Translate
								text={TYPE_SUBTITLE_KEY[protocol.type]}
							/>
						</p>
					</div>
				</div>

				<SectionCard
					icon={Calendar}
					titleKey={localizationConstants.protocolSectionTime}
				>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<span className="text-sm font-medium text-slate-900">
								<Translate
									text={
										localizationConstants.protocolFieldStartTime
									}
								/>
							</span>
							<div className="grid grid-cols-2 gap-4">
								<EditTextField
									control={form.control}
									name="startDate"
									type="date"
								/>
								<EditTextField
									control={form.control}
									name="startTime"
									type="time"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-sm font-medium text-slate-900">
								<Translate
									text={
										localizationConstants.protocolFieldEndTime
									}
								/>
							</span>
							<div className="grid grid-cols-2 gap-4">
								<EditTextField
									control={form.control}
									name="endDate"
									type="date"
								/>
								<EditTextField
									control={form.control}
									name="endTime"
									type="time"
								/>
							</div>
						</div>
					</div>
				</SectionCard>

				<SectionCard
					icon={Users}
					titleKey={localizationConstants.protocolFieldParticipants}
				>
					<div className="flex flex-col gap-4">
						<EditSelectField
							control={form.control}
							name="host"
							labelKey={localizationConstants.protocolFieldHost}
							options={PARTICIPANT_NAMES}
						/>
						<div className="flex flex-col gap-1.5">
							<span className="text-sm font-medium text-slate-900">
								<Translate
									text={
										localizationConstants.protocolFieldParticipants
									}
								/>
							</span>
							<Controller
								control={form.control}
								name="participantIds"
								render={({ field }) => (
									<ParticipantSelect
										value={field.value}
										onChange={field.onChange}
										showHandles
									/>
								)}
							/>
						</div>
					</div>
				</SectionCard>

				<EditOtherInfoSection control={form.control} />
				<EditNextMeetingSection control={form.control} />

				<div className="flex items-center justify-end gap-3">
					<Button
						type="button"
						variant="secondary"
						onClick={() => router.push(viewRoute)}
						className="h-11 rounded-md bg-slate-100 px-6 text-sm font-medium text-slate-900 hover:bg-slate-200"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="submit"
						className="h-11 gap-2 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90"
					>
						<Save className="h-4 w-4" />
						<Translate text={localizationConstants.save} />
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ProtocolEditPage;
