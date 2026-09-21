"use client";

import { CalendarDays } from "lucide-react";
import { useWatch } from "react-hook-form";

import localizationConstants from "@/utils/translation/constants";
import { RecordCollapsibleCard } from "../../components/RecordCollapsibleCard";
import { MeetingMomentFields } from "../form/fields/MeetingMomentFields";
import type { EditSectionProps } from "./editSections";

/** Tid: Start tid and Slut tid, each a day and a time. */
export function EditTimeSection({ form, translateError, open, onOpenChange }: EditSectionProps) {
	const { control } = form;
	const startDate = useWatch({ control, name: "startDate" });

	return (
		<RecordCollapsibleCard
			titleKey={localizationConstants.protocolSectionTime}
			icon={CalendarDays}
			open={open}
			onOpenChange={onOpenChange}
			contentClassName="grid gap-4"
		>
			<MeetingMomentFields
				control={control}
				dateName="startDate"
				timeName="startTime"
				legendKey={localizationConstants.protocolFieldStartTime}
				required
				translateError={translateError}
			/>
			<MeetingMomentFields
				control={control}
				dateName="endDate"
				timeName="endTime"
				legendKey={localizationConstants.protocolFieldEndTime}
				required
				minDate={startDate}
				translateError={translateError}
			/>
		</RecordCollapsibleCard>
	);
}

export default EditTimeSection;
