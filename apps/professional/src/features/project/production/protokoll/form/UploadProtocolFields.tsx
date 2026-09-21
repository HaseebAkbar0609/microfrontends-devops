"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import { FormInput, FormSelect } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { RecordFileField, type RecordFileFieldValues } from "../../components/RecordFileField";
import type { ProjectPerson } from "../../hooks/useProjectPeople";
import {
	PROTOCOL_FIELD_MAX_LENGTH,
	PROTOCOL_FILE_ACCEPT,
	PROTOCOL_FILE_RULES,
	PROTOCOL_NAME_MAX_LENGTH,
	PROTOCOL_NOTE_MAX_LENGTH,
	PROTOCOL_POSTAL_CODE_MAX_LENGTH,
} from "../projectProtocol.config";
import { MeetingMomentFields } from "./fields/MeetingMomentFields";
import { MeetingParticipantsField } from "./fields/MeetingParticipantsField";
import { TYPE_OPTIONS } from "./protocolOptions";
import type { UploadFormValues } from "./uploadSchema";

const M = localizationConstants;
const WIDE = "sm:col-span-2";

export interface UploadProtocolFieldsProps {
	form: UseFormReturn<UploadFormValues>;
	people: ProjectPerson[];
	translateError: (message: string) => string;
}

/**
 * Nytt protokoll's fields in the frame's grid: Typ | Rubrik, Adress, Post nr |
 * Ort, the participants, Plats, the two moments, the information and the file
 * — one column on a phone. The frame labels Rubrik "Date"; its sample value is
 * a Rubrik, and the start's day is the protocol's date. The file row, which
 * the frame labels "Underskrift", holds the protocol itself.
 */
export function UploadProtocolFields({ form, people, translateError }: UploadProtocolFieldsProps) {
	const { control } = form;
	const startDate = useWatch({ control, name: "startDate" });

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<FormSelect
				control={control}
				name="type"
				label={M.projectProtocolColType}
				placeholder={M.projectProtocolTypePlaceholder}
				options={TYPE_OPTIONS}
				required
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="name"
				label={M.protocolFieldTitle}
				required
				inputProps={{ maxLength: PROTOCOL_NAME_MAX_LENGTH }}
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
			<div className={WIDE}>
				{/* This form carries the row's three names — `name` is Rubrik — beside
				    its other fields, which react-hook-form's types cannot express as
				    "at least these". */}
				<RecordFileField
					form={form as unknown as UseFormReturn<RecordFileFieldValues>}
					labelKey={M.projectProtocolFileLabel}
					hintKey={M.projectProtocolAllowedFiles}
					typeErrorKey={M.projectProtocolFileTypeError}
					sizeErrorKey={M.projectProtocolFileSizeError}
					uploadKey={M.projectProtocolUpload}
					removeKey={M.projectProtocolRemoveFile}
					rules={PROTOCOL_FILE_RULES}
					accept={PROTOCOL_FILE_ACCEPT}
					nameMaxLength={PROTOCOL_NAME_MAX_LENGTH}
					required
				/>
			</div>
		</div>
	);
}

export default UploadProtocolFields;
