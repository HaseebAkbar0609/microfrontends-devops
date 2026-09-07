"use client";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { TICKET_STATUSES } from "../../constants/supportStatuses";
import { NO_SELECTION } from "../../schemas/supportTicket.schema";
import type { SupportAgent, SupportTicket, TicketStatus } from "../../types";

type TicketHandlingCardProps = {
	ticket: SupportTicket;
	agents: SupportAgent[];
	onStatusChange: (status: TicketStatus) => void;
	onAssigneeChange: (agentId: string | null) => void;
};

export function TicketHandlingCard({
	ticket,
	agents,
	onStatusChange,
	onAssigneeChange,
}: TicketHandlingCardProps) {
	const t = useTranslate();

	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.supportHandlingTitle} />
			</h2>

			<div className="mt-4 space-y-4">
				<div className="space-y-1.5">
					<Label htmlFor="ticket-status">
						<Translate text={localizationConstants.supportColumnStatus} />
					</Label>
					<Select
						value={ticket.status}
						onValueChange={(value) => {
							onStatusChange(value as TicketStatus);
							showToast(
								"success",
								t(localizationConstants.supportStatusUpdatedToast),
							);
						}}
					>
						<SelectTrigger id="ticket-status" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{TICKET_STATUSES.map((status) => (
								<SelectItem key={status.id} value={status.id}>
									<Translate text={status.labelKey} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="ticket-assignee">
						<Translate text={localizationConstants.supportFieldAssignee} />
					</Label>
					<Select
						value={ticket.assigneeId ?? NO_SELECTION}
						onValueChange={(value) => {
							onAssigneeChange(value === NO_SELECTION ? null : value);
							showToast(
								"success",
								t(localizationConstants.supportAssigneeUpdatedToast),
							);
						}}
					>
						<SelectTrigger id="ticket-assignee" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={NO_SELECTION}>
								<Translate text={localizationConstants.supportUnassigned} />
							</SelectItem>
							{agents.map((agent) => (
								<SelectItem key={agent.id} value={agent.id}>
									{agent.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</section>
	);
}
