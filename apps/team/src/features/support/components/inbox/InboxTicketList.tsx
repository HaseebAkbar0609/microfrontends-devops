"use client";

import Link from "next/link";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getTicketHref } from "../../constants/supportNav";
import type { SupportTicket } from "../../types";
import { formatDateTime } from "../../utils/supportFormatters";
import { SlaIndicator } from "../SlaIndicator";
import {
	ChannelLabel,
	CustomerTypeBadge,
	SupportLineBadge,
	TicketPriorityBadge,
	TicketStatusBadge,
} from "../SupportBadges";

type InboxTicketListProps = {
	tickets: SupportTicket[];
};

/** The inbox reads as a divided list of links rather than a table. */
export function InboxTicketList({ tickets }: InboxTicketListProps) {
	if (tickets.length === 0) {
		return (
			<p className="px-5 py-10 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.supportInboxEmpty} />
			</p>
		);
	}

	return (
		<ul className="divide-y divide-slate-200">
			{tickets.map((ticket) => (
				<li key={ticket.id}>
					<Link
						href={getTicketHref(ticket.id)}
						className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70 @3xl:flex-row @3xl:items-center"
					>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium text-slate-900">
								{ticket.subject}
							</p>
							<p className="truncate text-xs text-slate-500">
								{ticket.id} · {ticket.customer} · {ticket.country} ·{" "}
								{formatDateTime(ticket.createdAt)}
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<CustomerTypeBadge type={ticket.customerType} />
							<ChannelLabel channel={ticket.channel} />
							<SupportLineBadge line={ticket.line} />
							<TicketPriorityBadge priority={ticket.priority} />
							<TicketStatusBadge status={ticket.status} />
						</div>
						<SlaIndicator
							ticket={ticket}
							className="shrink-0 text-xs font-medium @3xl:w-28 @3xl:text-right"
						/>
					</Link>
				</li>
			))}
		</ul>
	);
}
