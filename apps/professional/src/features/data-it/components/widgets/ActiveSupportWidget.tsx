"use client";

import React from "react";
import { AlertTriangle, Clock, Inbox } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { ActiveSupportTicketItem } from "../../types/dataIt.types";

interface ActiveSupportWidgetProps {
	tickets: ActiveSupportTicketItem[];
}

export function ActiveSupportWidget({ tickets }: ActiveSupportWidgetProps) {
	if (tickets.length === 0) {
		return (
			<div className="flex h-32 flex-col items-center justify-center text-center text-slate-500">
				<Inbox className="mb-1 h-6 w-6 text-slate-400" />
				<p className="text-xs font-medium">
					<Translate text={localizationConstants.dataItEmptySupportTitle} />
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-2 pt-2">
			{tickets.map((ticket) => (
				<div
					key={ticket.id}
					className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs"
				>
					<div className="min-w-0 pr-2">
						<div className="flex items-center gap-1.5">
							<span className="text-[11px] font-bold text-slate-900">
								{ticket.ticketNumber}
							</span>
							<span className="text-[10px] text-slate-400">· {ticket.createdTime}</span>
						</div>
						<p className="truncate text-xs text-slate-700">
							{ticket.subject}
						</p>
						<p className="truncate text-[11px] text-slate-500">
							{ticket.requester}
						</p>
					</div>

					<div className="shrink-0">
						{ticket.priority === "HIGH" ? (
							<span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
								<AlertTriangle className="h-2.5 w-2.5" />
								<Translate text={localizationConstants.dataItHighPriority} />
							</span>
						) : (
							<span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
								<Clock className="h-2.5 w-2.5" />
								<Translate text={localizationConstants.dataItNormalPriority} />
							</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export default ActiveSupportWidget;
