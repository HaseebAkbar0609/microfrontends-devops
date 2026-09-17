"use client";

import { Control, Controller } from "react-hook-form";
import { Video } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EditProtocolValues } from "../../schemas/protocol.schema";
import ParticipantSelect from "../ParticipantSelect";
import { useParticipants } from "../../../shared/api";
import { MyPagesQueryState } from "../../../shared/feedback";
import SectionCard from "../SectionCard";
import {
	EditTextField,
	EditSelectField,
	EditTextareaField,
} from "./EditFields";

const EditNextMeetingSection = ({
	control,
}: {
	control: Control<EditProtocolValues>;
}) => {
 const people = useParticipants();
 return (
	<SectionCard
		icon={Video}
		titleKey={localizationConstants.protocolNextMeeting}
	>
		<div className="flex flex-col gap-4">
   <MyPagesQueryState query={people} />
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<EditSelectField
					options={[...new Set((people.data ?? []).map(person => person.name))]}
					control={control}
					name="next.responsible"
					labelKey={localizationConstants.protocolFieldResponsible}
				/>
				<EditTextField
					control={control}
					name="next.title"
					labelKey={localizationConstants.protocolFieldTitle}
				/>
				<EditTextField
					control={control}
					name="next.category"
					labelKey={localizationConstants.protocolFieldCategory}
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
};

export default EditNextMeetingSection;
