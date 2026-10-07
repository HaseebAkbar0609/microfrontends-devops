"use client";

import React from "react";
import { Laptop, Monitor, Ticket, ShieldCheck } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { DataItKpiData } from "../../types/dataIt.types";

interface KpiDataItWidgetProps {
	kpi: DataItKpiData;
}

export function KpiDataItWidget({ kpi }: KpiDataItWidgetProps) {
	return (
		<div className="grid grid-cols-2 gap-3 pt-2">
			<div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white p-3 shadow-2xs">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-900">
					<Laptop className="h-5 w-5" />
				</div>
				<div>
					<p className="text-xl font-bold tracking-tight text-slate-950">
						{kpi.totalDevices}
					</p>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.dataItTotalDevices} />
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white p-3 shadow-2xs">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-900">
					<Monitor className="h-5 w-5" />
				</div>
				<div>
					<p className="text-xl font-bold tracking-tight text-slate-950">
						{kpi.activeSystems}
					</p>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.dataItActiveSystems} />
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white p-3 shadow-2xs">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-900">
					<Ticket className="h-5 w-5" />
				</div>
				<div>
					<p className="text-xl font-bold tracking-tight text-slate-950">
						{kpi.openTickets}
					</p>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.dataItOpenTickets} />
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white p-3 shadow-2xs">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
					<ShieldCheck className="h-5 w-5" />
				</div>
				<div>
					<p className="text-xl font-bold tracking-tight text-slate-950">
						{kpi.securityScore}%
					</p>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.dataItSecurityScore} />
					</p>
				</div>
			</div>
		</div>
	);
}

export default KpiDataItWidget;
