"use client";

import { Badge } from "@/components/ui/badge";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RISK_CLIENT_STATUS_LABELS } from "../../../../constants/forecastRisk.constants";
import type { RiskClient } from "../../../../types/forecastRisk.types";

export interface RiskClientCardProps {
	client: RiskClient;
}

/** Who the client is: the name, how the account stands, and its number. */
export function RiskClientCard({ client }: RiskClientCardProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
			<div className="flex min-w-0 flex-col gap-3">
				<h2 className="truncate text-2xl font-bold tracking-tight text-slate-900">{client.name}</h2>
				<Badge variant="info" className="w-fit">
					{t(RISK_CLIENT_STATUS_LABELS[client.status])}
				</Badge>
			</div>

			<div className="flex flex-col items-end gap-1 text-right">
				<span className="text-xs font-medium text-slate-500">
					<Translate text={localizationConstants.forecastRiskClientIdLabel} />
				</span>
				<span className="font-mono text-lg font-bold text-slate-900">{client.clientNo}</span>
			</div>
		</div>
	);
}

export default RiskClientCard;
