"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getTicketHref } from "../constants/supportNav";
import type { SupportAgent, SupportTicket } from "../types";
import { findAgent } from "../utils/supportFormatters";
import { SlaIndicator } from "./SlaIndicator";
import {
	ChannelLabel,
	CustomerTypeBadge,
	SupportLineBadge,
	TicketPriorityBadge,
	TicketStatusBadge,
} from "./SupportBadges";

type TicketTableRowProps = {
	ticket: SupportTicket;
	agents: SupportAgent[];
};

export function TicketTableRow({ ticket, agents }: TicketTableRowProps) {
	const assignee = findAgent(agents, ticket.assigneeId);
	const href = getTicketHref(ticket.id);

	return (
		<TableRow className="hover:bg-slate-50/70">
			<TableCell className="max-w-70">
				<Link
					href={href}
					className="block truncate font-medium text-slate-900 hover:underline"
				>
					{ticket.subject}
				</Link>
				<span className="block text-xs text-slate-500">
					{ticket.id} · {ticket.country}
				</span>
			</TableCell>
			<TableCell>
				<span className="block text-slate-900">{ticket.customer}</span>
				<span className="mt-1 block">
					<CustomerTypeBadge type={ticket.customerType} />
				</span>
			</TableCell>
			<TableCell>
				<ChannelLabel channel={ticket.channel} />
			</TableCell>
			<TableCell>
				<SupportLineBadge line={ticket.line} />
			</TableCell>
			<TableCell>
				<TicketPriorityBadge priority={ticket.priority} />
			</TableCell>
			<TableCell>
				<TicketStatusBadge status={ticket.status} />
			</TableCell>
			<TableCell>
				{assignee ? (
					<span className="text-slate-900">{assignee.name}</span>
				) : (
					<span className="text-slate-500">
						<Translate text={localizationConstants.supportUnassigned} />
					</span>
				)}
			</TableCell>
			<TableCell className="text-right">
				<SlaIndicator ticket={ticket} className="text-xs font-medium" />
			</TableCell>
			<TableCell className="text-right">
				<Button asChild variant="outline" size="sm" className="cursor-pointer">
					<Link href={href}>
						<Translate text={localizationConstants.supportOpenAction} />
					</Link>
				</Button>
			</TableCell>
		</TableRow>
	);
}
