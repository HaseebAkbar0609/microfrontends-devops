"use client";

import { User } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { RecordCollapsibleCard } from "../../components/RecordCollapsibleCard";
import { MeetingParticipantsField } from "../form/fields/MeetingParticipantsField";
import { MeetingPersonSelect } from "../form/fields/MeetingPersonSelect";
import type { EditSectionProps } from "./editSections";

/** Deltagare: the Värd, and everyone taking part. */
export function EditPeopleSection({ form, people, translateError, open, onOpenChange }: EditSectionProps) {
	return (
		<RecordCollapsibleCard
			titleKey={localizationConstants.protocolFieldParticipants}
			icon={User}
			open={open}
			onOpenChange={onOpenChange}
			contentClassName="grid gap-4"
		>
			<MeetingPersonSelect
				control={form.control}
				name="host"
				labelKey={localizationConstants.protocolFieldHost}
				people={people}
				required
				translateError={translateError}
			/>
			<MeetingParticipantsField
				control={form.control}
				name="participants"
				labelKey={localizationConstants.protocolFieldParticipants}
				people={people}
			/>
		</RecordCollapsibleCard>
	);
}

export default EditPeopleSection;
