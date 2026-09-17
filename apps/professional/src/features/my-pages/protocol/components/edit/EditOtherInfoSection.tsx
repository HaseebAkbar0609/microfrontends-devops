"use client";

import { Control } from "react-hook-form";
import { Info } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { EditProtocolValues } from "../../schemas/protocol.schema";
import SectionCard from "../SectionCard";
import {
	EditTextField,
	EditTextareaField,
} from "./EditFields";

const EditOtherInfoSection = ({
	control,
}: {
	control: Control<EditProtocolValues>;
}) => (
	<SectionCard
		icon={Info}
		titleKey={localizationConstants.protocolSectionOtherInfo}
	>
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<EditTextField
				control={control}
				name="protocolNumber"
				labelKey={localizationConstants.protocolFieldNumber}
			/>
			<EditTextField
				control={control}
				name="subject"
				labelKey={localizationConstants.itSupportSubjectLabel}
			/>
			<EditTextField
				control={control}
				name="title"
				labelKey={localizationConstants.protocolFieldTitle}
			/>
			<EditTextField
				control={control}
				name="category"
				labelKey={localizationConstants.protocolFieldCategory}
			/>
			<EditTextField
				control={control}
				name="location"
				labelKey={localizationConstants.protocolFieldLocation}
				placeholderKey={localizationConstants.protocolFieldLocation}
			/>
			<EditTextField
				control={control}
				name="address"
				labelKey={localizationConstants.protocolFieldAddress}
				placeholderKey={localizationConstants.protocolFieldAddress}
			/>
			<EditTextField
				control={control}
				name="postalCode"
				labelKey={localizationConstants.protocolFieldPostalCode}
			/>
			<EditTextField
				control={control}
				name="city"
				labelKey={localizationConstants.protocolFieldCity}
			/>
			<div className="sm:col-span-2">
				<EditTextareaField
					control={control}
					name="information"
					labelKey={localizationConstants.protocolFieldInformation}
				/>
			</div>
			<div className="sm:col-span-2">
				<EditTextareaField
					control={control}
					name="comment"
					labelKey={localizationConstants.protocolFieldComment}
				/>
			</div>
		</div>
	</SectionCard>
);

export default EditOtherInfoSection;
