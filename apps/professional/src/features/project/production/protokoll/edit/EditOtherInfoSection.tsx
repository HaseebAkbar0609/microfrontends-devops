"use client";

import { Info } from "lucide-react";

import { FormInput, FormSelect } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { RecordCollapsibleCard } from "../../components/RecordCollapsibleCard";
import { CATEGORY_OPTIONS, TYPE_OPTIONS } from "../form/protocolOptions";
import {
	PROTOCOL_FIELD_MAX_LENGTH,
	PROTOCOL_NAME_MAX_LENGTH,
	PROTOCOL_NOTE_MAX_LENGTH,
	PROTOCOL_NUMBER_MAX_LENGTH,
	PROTOCOL_POSTAL_CODE_MAX_LENGTH,
} from "../projectProtocol.config";
import type { EditSectionProps } from "./editSections";

const M = localizationConstants;
const WIDE = "sm:col-span-2";

/**
 * Övrig information, in the frame's grid: Protokoll nr | Ämne, Rubrik |
 * Kategori, Typ | Plats, Adress, Post nr | Ort, Information and Kommentar.
 */
export function EditOtherInfoSection({ form, translateError, open, onOpenChange }: EditSectionProps) {
	const { control } = form;

	return (
		<RecordCollapsibleCard
			titleKey={M.protocolSectionOtherInfo}
			icon={Info}
			open={open}
			onOpenChange={onOpenChange}
			contentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2"
		>
			<FormInput
				control={control}
				name="number"
				label={M.protocolFieldNumber}
				required
				inputProps={{ maxLength: PROTOCOL_NUMBER_MAX_LENGTH }}
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="subject"
				label={M.protocolPointSubject}
				inputProps={{ maxLength: PROTOCOL_FIELD_MAX_LENGTH }}
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
				name="category"
				label={M.protocolFieldCategory}
				placeholder={M.projectProtocolCategoryPlaceholder}
				options={CATEGORY_OPTIONS}
				required
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
			<FormInput
				control={control}
				name="location"
				label={M.protocolFieldLocation}
				placeholder={M.protocolLocationPlaceholder}
				inputProps={{ maxLength: PROTOCOL_FIELD_MAX_LENGTH }}
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
			<FormInput
				control={control}
				name="information"
				type="textarea"
				label={M.protocolFieldInformation}
				placeholder={M.protocolMeetingInfoPlaceholder}
				className={WIDE}
				inputClassName="min-h-20 resize-y"
				inputProps={{ maxLength: PROTOCOL_NOTE_MAX_LENGTH }}
				translateError={translateError}
			/>
			<FormInput
				control={control}
				name="comment"
				type="textarea"
				label={M.protocolFieldComment}
				className={WIDE}
				inputClassName="min-h-20 resize-y"
				inputProps={{ maxLength: PROTOCOL_NOTE_MAX_LENGTH }}
				translateError={translateError}
			/>
		</RecordCollapsibleCard>
	);
}

export default EditOtherInfoSection;
