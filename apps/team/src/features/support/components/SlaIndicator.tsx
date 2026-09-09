"use client";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SupportTicket } from "../types";
import {
	EMPTY_VALUE_PLACEHOLDER,
	SLA_TONE_CLASS,
	getSlaState,
} from "../utils/supportFormatters";

type SlaIndicatorProps = {
	ticket: SupportTicket;
	/** The escalation list spells out "of SLA"; the table keeps it short. */
	verbose?: boolean;
	className?: string;
};

/** "42 min kvar" / "14 min över", coloured by how close the deadline is. */
export function SlaIndicator({
	ticket,
	verbose = false,
	className,
}: SlaIndicatorProps) {
	const { tone, minutes } = getSlaState(ticket);

	if (tone === "none") {
		return (
			<span className={cn(SLA_TONE_CLASS.none, className)}>
				{EMPTY_VALUE_PLACEHOLDER}
			</span>
		);
	}

	const isOverdue = tone === "overdue";
	const suffixKey = verbose
		? isOverdue
			? localizationConstants.supportSlaMinutesOverSla
			: localizationConstants.supportSlaMinutesLeftOfSla
		: isOverdue
			? localizationConstants.supportSlaMinutesOver
			: localizationConstants.supportSlaMinutesLeft;

	return (
		<span className={cn(SLA_TONE_CLASS[tone], className)}>
			{minutes} <Translate text={suffixKey} />
		</span>
	);
}
