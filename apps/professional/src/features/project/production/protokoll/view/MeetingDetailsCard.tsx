"use client";

import type { LucideIcon } from "lucide-react";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import type { TranslationKeys } from "@/utils/translation/constants";
import { RecordCollapsibleCard } from "../../components/RecordCollapsibleCard";
import type { DetailField } from "./meetingDetailFields";

export interface MeetingDetailsCardProps {
	titleKey: TranslationKeys;
	icon: LucideIcon;
	fields: DetailField[];
}

/**
 * Mötesinformation or Nästa möte: label over value, three to a row as drawn. An
 * empty field shows the missing-value mark; a long one keeps its line breaks.
 */
export function MeetingDetailsCard({ titleKey, icon, fields }: MeetingDetailsCardProps) {
	return (
		<RecordCollapsibleCard titleKey={titleKey} icon={icon}>
			<dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
				{fields.map((field) => (
					<InfoField key={field.labelKey} labelKey={field.labelKey} value={field.value}>
						{field.value.trim() ? <span className="break-words whitespace-pre-line">{field.value}</span> : undefined}
					</InfoField>
				))}
			</dl>
		</RecordCollapsibleCard>
	);
}

export default MeetingDetailsCard;
