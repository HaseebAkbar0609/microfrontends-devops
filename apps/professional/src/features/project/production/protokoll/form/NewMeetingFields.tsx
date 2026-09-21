"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import { FormInput, FormSelect } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import type { ProjectPerson } from "../../hooks/useProjectPeople";
import {
	PROTOCOL_FIELD_MAX_LENGTH,
	PROTOCOL_NAME_MAX_LENGTH,
	PROTOCOL_NOTE_MAX_LENGTH,
	PROTOCOL_POSTAL_CODE_MAX_LENGTH,
} from "../projectProtocol.config";
import { MeetingMomentFields } from "./fields/MeetingMomentFields";
import { MeetingParticipantsField } from "./fields/MeetingParticipantsField";
import { MeetingPersonSelect } from "./fields/MeetingPersonSelect";
import type { NewMeetingValues } from "./meetingSchema";
import { CATEGORY_OPTIONS, TYPE_OPTIONS } from "./protocolOptions";

const M = localizationConstants;
const WIDE = "sm:col-span-2";

export interface NewMeetingFieldsProps {
	form: UseFormReturn<NewMeetingValues>;
	people: ProjectPerson[];
	translateError: (message: string) => string;
}

/**
 * Nytt möte's fields in the frame's grid: Ansvarig | Rubrik, Typ | Kategori,
 * Adress, Post nr | Ort, the participants, Plats, the two moments and the
 * information — one column on a phone.
 */
export function NewMeetingFields({ form, people, translateError }: NewMeetingFieldsProps) {
	const { control } = form;
	const startDate = useWatch({ control, name: "startDate" });

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<MeetingPersonSelect
				control={control}
				name="host"
				labelKey={M.protocolFieldResponsible}
				people={people}
				required
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="title"
				label={M.protocolFieldTitle}
				required
				inputProps={{ maxLength: PROTOCOL_NAME_MAX_LENGTH }}
				translateError={translateError}
			/>
			<FormSelect
				control={control}
				name="type"
				label={M.projectProtocolColType}
				placeholder={M.projectProtocolTypePlaceholder}
				options={TYPE_OPTIONS}
				required
				translateError={translateError}
			/>
			<FormSelect
				control={control}
				name="category"
				label={M.protocolFieldCategory}
				placeholder={M.projectProtocolCategoryPlaceholder}
				options={CATEGORY_OPTIONS}
				required
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="address"
				label={M.protocolFieldAddress}
				className={WIDE}
				inputProps={{ maxLength: PROTOCOL_FIELD_MAX_LENGTH, autoComplete: "street-address" }}
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="postalCode"
				label={M.protocolFieldPostalCode}
				inputProps={{ maxLength: PROTOCOL_POSTAL_CODE_MAX_LENGTH, autoComplete: "postal-code" }}
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="city"
				label={M.protocolFieldCity}
				inputProps={{ maxLength: PROTOCOL_FIELD_MAX_LENGTH, autoComplete: "address-level2" }}
				translateError={translateError}
			/>
			<MeetingParticipantsField
				control={control}
				name="participants"
				labelKey={M.protocolFieldAddParticipants}
				people={people}
				className={WIDE}
			/>
			<FormInput
				control={control}
				name="location"
				label={M.protocolFieldLocation}
				placeholder={M.protocolLocationPlaceholder}
				className={WIDE}
				inputProps={{ maxLength: PROTOCOL_FIELD_MAX_LENGTH }}
				translateError={translateError}
			/>
			<MeetingMomentFields
				control={control}
				dateName="startDate"
				timeName="startTime"
				legendKey={M.protocolFieldStartTime}
				required
				translateError={translateError}
				className={WIDE}
			/>
			<MeetingMomentFields
				control={control}
				dateName="endDate"
				timeName="endTime"
				legendKey={M.protocolFieldEndTime}
				required
				minDate={startDate}
				translateError={translateError}
				className={WIDE}
			/>
			<FormInput
				control={control}
				name="information"
				type="textarea"
				label={M.protocolFieldMeetingInfo}
				placeholder={M.protocolMeetingInfoPlaceholder}
				className={WIDE}
				inputClassName="min-h-20 resize-y"
				inputProps={{ maxLength: PROTOCOL_NOTE_MAX_LENGTH }}
				translateError={translateError}
			/>
		</div>
	);
}

export default NewMeetingFields;
