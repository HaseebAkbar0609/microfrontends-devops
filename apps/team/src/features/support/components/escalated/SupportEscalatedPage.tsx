"use client";

import { useMemo } from "react";
import { ShieldAlert, TimerOff, TriangleAlert } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useSupportMetrics } from "../../hooks/useSupportMetrics";
import { useSupportTickets } from "../../hooks/useSupportTickets";
import { SupportModuleShell } from "../SupportModuleShell";
import { SupportStatCard } from "../SupportStatCard";
import { EscalatedTicketCard } from "./EscalatedTicketCard";

export default function SupportEscalatedPage() {
	const { tickets, agents } = useSupportTickets();
	const metrics = useSupportMetrics(tickets, agents);

	/** Most overdue first, so the worst breach is at the top. */
	const escalated = useMemo(
		() =>
			tickets
				.filter((ticket) => ticket.status === "escalated")
				.sort((a, b) => a.slaMinutesLeft - b.slaMinutesLeft),
		[tickets],
	);

	return (
		<SupportModuleShell>
			<div className="grid grid-cols-1 gap-2.5 @2xl:grid-cols-3">
				<SupportStatCard
					labelKey={localizationConstants.supportEscalatedTotal}
					value={metrics.escalatedCount}
					icon={ShieldAlert}
				/>
				<SupportStatCard
					labelKey={localizationConstants.supportEscalatedOverSla}
					value={metrics.overSlaCount}
					icon={TimerOff}
					valueClassName={metrics.overSlaCount > 0 ? "text-red-600" : undefined}
				/>
				<SupportStatCard
					labelKey={localizationConstants.supportEscalatedCritical}
					value={metrics.criticalCount}
					icon={TriangleAlert}
					valueClassName={
						metrics.criticalCount > 0 ? "text-amber-700" : undefined
					}
				/>
			</div>

			{escalated.length === 0 ? (
				<p className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-2xs">
					<Translate text={localizationConstants.supportEscalatedEmpty} />
				</p>
			) : (
				<div className="flex flex-col gap-3">
					{escalated.map((ticket) => (
						<EscalatedTicketCard
							key={ticket.id}
							ticket={ticket}
							agents={agents}
						/>
					))}
				</div>
			)}
		</SupportModuleShell>
	);
}
