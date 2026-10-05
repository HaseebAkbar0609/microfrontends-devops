"use client";

import { useCallback } from "react";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	SUPPORT_MODULE_HREF,
	SUPPORT_MODULE_TABS,
	SUPPORT_MODULE_TITLE_KEY,
} from "../../constants/supportNav";
import { useSupportTickets } from "../../hooks/useSupportTickets";
import type { TicketStatus } from "../../types";
import { TicketNotFound } from "./TicketNotFound";
import { TicketActionLog } from "./TicketActionLog";
import { TicketHandlingCard } from "./TicketHandlingCard";
import { TicketMetaCard } from "./TicketMetaCard";
import { TicketRequesterCard } from "./TicketRequesterCard";

type TicketDetailPageProps = {
	ticketId: string;
};

export default function TicketDetailPage({ ticketId }: TicketDetailPageProps) {
	const {
		getTicket,
		agents,
		setTicketStatus,
		assignTicket,
		addComment,
	} = useSupportTickets();

	const ticket = getTicket(ticketId);

	const handleStatus = useCallback(
		(status: TicketStatus) => setTicketStatus(ticketId, status),
		[ticketId, setTicketStatus],
	);
	const handleAssignee = useCallback(
		(agentId: string | null) => assignTicket(ticketId, agentId),
		[ticketId, assignTicket],
	);
	const handleComment = useCallback(
		(text: string) => addComment(ticketId, text),
		[ticketId, addComment],
	);

	if (!ticket) return <TicketNotFound />;

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				title={SUPPORT_MODULE_TITLE_KEY}
				tabs={SUPPORT_MODULE_TABS}
				record={{
					title: ticket.subject,
					description: `${ticket.id} · ${ticket.customer}`,
					backHref: SUPPORT_MODULE_HREF,
				}}
			/>

			<div className="grid gap-5 px-5 py-5 @4xl:grid-cols-[minmax(0,1fr)_360px]">
				<div className="flex flex-col gap-5">
					<TicketMetaCard ticket={ticket} />
					<TicketActionLog
						ticket={ticket}
						agents={agents}
						onAddComment={handleComment}
					/>
				</div>

				<aside className="flex flex-col gap-5">
					<TicketHandlingCard
						ticket={ticket}
						agents={agents}
						onStatusChange={handleStatus}
						onAssigneeChange={handleAssignee}
					/>
					<TicketRequesterCard ticket={ticket} />
				</aside>
			</div>
		</div>
	);
}
