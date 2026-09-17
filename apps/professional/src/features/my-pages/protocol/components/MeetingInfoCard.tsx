"use client";

import { LucideIcon } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	MeetingDetails,
} from "../constants/data";
import SectionCard from "./SectionCard";
import { useParticipants } from "../../shared/api";

interface MeetingInfoCardProps {
	icon: LucideIcon;
	titleKey: string;
	details: MeetingDetails;
}

const Field = ({ labelKey, value }: { labelKey: string; value: string }) => (
	<div className="flex flex-col gap-0.5">
		<span className="text-sm font-medium text-slate-500">
			<Translate text={labelKey} />
		</span>
		<span className="text-sm text-slate-700">{value || "-"}</span>
	</div>
);

const timeDisplay = (time: string, date: string) =>
	time && date ? `${time} | ${date}` : "-";

const MeetingInfoCard = ({
	icon,
	titleKey,
	details,
}: MeetingInfoCardProps) => {
	const participantQuery = useParticipants();
	const PROTOCOL_PARTICIPANTS = participantQuery.data ?? [];
	const participants = PROTOCOL_PARTICIPANTS.filter((participant) =>
		details.participantIds.includes(participant.id),
	)
		.map((participant) => participant.name)
		.join(", ");

	return (
		<SectionCard icon={icon} titleKey={titleKey}>
			<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
				<Field
					labelKey={localizationConstants.protocolFieldHost}
					value={details.host}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldStartTime}
					value={timeDisplay(details.startTime, details.startDate)}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldEndTime}
					value={timeDisplay(details.endTime, details.endDate)}
				/>
				<Field
					labelKey={localizationConstants.itSupportSubjectLabel}
					value={details.subject}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldNumber}
					value={details.protocolNumber}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldParticipants}
					value={participants}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldTitle}
					value={details.title}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldCategory}
					value={details.category}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldLocation}
					value={details.location}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldAddress}
					value={details.address}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldPostalCode}
					value={details.postalCode}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldCity}
					value={details.city}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldInformation}
					value={details.information}
				/>
				<Field
					labelKey={localizationConstants.protocolFieldComment}
					value={details.comment}
				/>
			</div>
		</SectionCard>
	);
};

export default MeetingInfoCard;
