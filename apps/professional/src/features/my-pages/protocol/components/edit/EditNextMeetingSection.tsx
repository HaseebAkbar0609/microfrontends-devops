"use client";

import { Control, Controller } from "react-hook-form";
import { Video } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PROTOCOL_CATEGORIES } from "../../constants/mockData";
import { EditProtocolValues } from "../../schemas/protocol.schema";
import ParticipantSelect from "../ParticipantSelect";
import SectionCard from "../SectionCard";
import {
	EditSelectField,
	EditTextField,
	EditTextareaField,
} from "./EditFields";

const EditNextMeetingSection = ({
	control,
}: {
	control: Control<EditProtocolValues>;
}) => (
	<SectionCard
		icon={Video}
		titleKey={localizationConstants.protocolNextMeeting}
	>
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<EditTextField
					control={control}
					name="next.responsible"
					labelKey={localizationConstants.protocolFieldResponsible}
				/>
				<EditTextField
					control={control}
					name="next.title"
					labelKey={localizationConstants.protocolFieldTitle}
				/>
				<EditSelectField
					control={control}
					name="next.category"
					labelKey={localizationConstants.protocolFieldCategory}
					options={PROTOCOL_CATEGORIES}
				/>
				<EditTextField
					control={control}
					name="next.address"
					labelKey={localizationConstants.protocolFieldAddress}
					placeholderKey={localizationConstants.protocolFieldAddress}
				/>
				<EditTextField
					control={control}
					name="next.postalCode"
					labelKey={localizationConstants.protocolFieldPostalCode}
				/>
				<EditTextField
					control={control}
					name="next.city"
					labelKey={localizationConstants.protocolFieldCity}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<span className="text-sm font-medium text-slate-900">
					<Translate
						text={localizationConstants.protocolFieldAddParticipants}
					/>
				</span>
				<Controller
					control={control}
					name="next.participantIds"
					render={({ field }) => (
						<ParticipantSelect
							value={field.value}
							onChange={field.onChange}
						/>
					)}
				/>
			</div>

			<EditTextField
				control={control}
				name="next.location"
				labelKey={localizationConstants.protocolFieldLocation}
				placeholderKey={localizationConstants.protocolFieldLocation}
			/>

			<div className="flex flex-col gap-1.5">
				<span className="text-sm font-medium text-slate-900">
					<Translate
						text={localizationConstants.protocolFieldStartTime}
					/>
				</span>
				<div className="grid grid-cols-2 gap-4">
					<EditTextField
						control={control}
						name="next.startDate"
						type="date"
					/>
					<EditTextField
						control={control}
						name="next.startTime"
						type="time"
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<span className="text-sm font-medium text-slate-900">
					<Translate
						text={localizationConstants.protocolFieldEndTime}
					/>
				</span>
				<div className="grid grid-cols-2 gap-4">
					<EditTextField
						control={control}
						name="next.endDate"
						type="date"
					/>
					<EditTextField
						control={control}
						name="next.endTime"
						type="time"
					/>
				</div>
			</div>

			<EditTextareaField
				control={control}
				name="next.information"
				labelKey={localizationConstants.protocolFieldMeetingInfo}
			/>
		</div>
	</SectionCard>
);

export default EditNextMeetingSection;
