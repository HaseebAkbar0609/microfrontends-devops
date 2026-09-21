"use client";

import { Video } from "lucide-react";
import { useWatch } from "react-hook-form";

import { FormInput, FormSelect } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { RecordCollapsibleCard } from "../../components/RecordCollapsibleCard";
import { MeetingMomentFields } from "../form/fields/MeetingMomentFields";
import { MeetingParticipantsField } from "../form/fields/MeetingParticipantsField";
import { MeetingPersonSelect } from "../form/fields/MeetingPersonSelect";
import { CATEGORY_OPTIONS } from "../form/protocolOptions";
import {
	PROTOCOL_FIELD_MAX_LENGTH,
	PROTOCOL_NAME_MAX_LENGTH,
	PROTOCOL_NOTE_MAX_LENGTH,
	PROTOCOL_POSTAL_CODE_MAX_LENGTH,
} from "../projectProtocol.config";
import type { EditSectionProps } from "./editSections";

const M = localizationConstants;
const WIDE = "sm:col-span-2";

/**
 * Nästa möte, in the frame's grid: Ansvarig | Rubrik, Kategori | Adress, Post
 * nr | Ort, the participants, Plats, the two moments and the information.
 * Nothing here is required — a next meeting may not be planned yet.
 */
export function EditNextMeetingSection({ form, people, translateError, open, onOpenChange }: EditSectionProps) {
	const { control } = form;
	const startDate = useWatch({ control, name: "next.startDate" });

	return (
		<RecordCollapsibleCard
			titleKey={M.protocolNextMeeting}
			icon={Video}
			open={open}
			onOpenChange={onOpenChange}
			contentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2"
		>
			<MeetingPersonSelect
				control={control}
				name="next.host"
				labelKey={M.protocolFieldResponsible}
				people={people}
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="next.title"
				label={M.protocolFieldTitle}
				inputProps={{ maxLength: PROTOCOL_NAME_MAX_LENGTH }}
				translateError={translateError}
			/>
			<FormSelect
				control={control}
				name="next.category"
				label={M.protocolFieldCategory}
				placeholder={M.projectProtocolCategoryPlaceholder}
				options={CATEGORY_OPTIONS}
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="next.address"
				label={M.protocolFieldAddress}
				inputProps={{ maxLength: PROTOCOL_FIELD_MAX_LENGTH, autoComplete: "street-address" }}
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="next.postalCode"
				label={M.protocolFieldPostalCode}
				inputProps={{ maxLength: PROTOCOL_POSTAL_CODE_MAX_LENGTH, autoComplete: "postal-code" }}
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="next.city"
				label={M.protocolFieldCity}
				inputProps={{ maxLength: PROTOCOL_FIELD_MAX_LENGTH, autoComplete: "address-level2" }}
				translateError={translateError}
			/>
			<MeetingParticipantsField
				control={control}
				name="next.participants"
				labelKey={M.protocolFieldAddParticipants}
				people={people}
				className={WIDE}
			/>
			<FormInput
				control={control}
				name="next.location"
				label={M.protocolFieldLocation}
				placeholder={M.protocolLocationPlaceholder}
				className={WIDE}
				inputProps={{ maxLength: PROTOCOL_FIELD_MAX_LENGTH }}
				translateError={translateError}
			/>
			<MeetingMomentFields
				control={control}
				dateName="next.startDate"
				timeName="next.startTime"
				legendKey={M.protocolFieldStartTime}
				translateError={translateError}
				className={WIDE}
			/>
			<MeetingMomentFields
				control={control}
				dateName="next.endDate"
				timeName="next.endTime"
				legendKey={M.protocolFieldEndTime}
				minDate={startDate}
				translateError={translateError}
				className={WIDE}
			/>
			<FormInput
				control={control}
				name="next.information"
				type="textarea"
				label={M.protocolFieldMeetingInfo}
				placeholder={M.protocolMeetingInfoPlaceholder}
				className={WIDE}
				inputClassName="min-h-20 resize-y"
				inputProps={{ maxLength: PROTOCOL_NOTE_MAX_LENGTH }}
				translateError={translateError}
			/>
		</RecordCollapsibleCard>
	);
}

export default EditNextMeetingSection;
