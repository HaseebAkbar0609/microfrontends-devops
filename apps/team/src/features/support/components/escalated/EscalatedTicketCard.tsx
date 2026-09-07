"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getTicketHref } from "../../constants/supportNav";
import type { SupportAgent, SupportTicket } from "../../types";
import { findAgent } from "../../utils/supportFormatters";
import { SlaIndicator } from "../SlaIndicator";
import {
	ChannelLabel,
	SupportLineBadge,
	TicketPriorityBadge,
} from "../SupportBadges";

type EscalatedTicketCardProps = {
	ticket: SupportTicket;
	agents: SupportAgent[];
};

export function EscalatedTicketCard({
	ticket,
	agents,
}: EscalatedTicketCardProps) {
	const assignee = findAgent(agents, ticket.assigneeId);

	return (
		<article className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="flex items-center gap-2 font-medium text-slate-900">
						<ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
						<span className="truncate">{ticket.subject}</span>
					</h3>
					<p className="mt-1 text-xs text-slate-500">
						{ticket.id} · {ticket.customer} · {ticket.country} ·{" "}
						<Translate text={localizationConstants.supportResponsibleLabel} />
						{": "}
						{assignee?.name ?? (
							<Translate text={localizationConstants.supportUnassigned} />
						)}
					</p>
				</div>
				<Button asChild size="sm" className="cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90">
					<Link href={getTicketHref(ticket.id)}>
						<Translate text={localizationConstants.supportOpenTicketButton} />
					</Link>
				</Button>
			</div>

			<div className="mt-3 flex flex-wrap items-center gap-2">
				<TicketPriorityBadge priority={ticket.priority} />
				<SupportLineBadge line={ticket.line} />
				<ChannelLabel channel={ticket.channel} />
				<SlaIndicator
					ticket={ticket}
					verbose
					className="ml-auto text-xs font-medium"
				/>
			</div>
		</article>
	);
}
