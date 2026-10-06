"use client";

import React from "react";
import { Server, Activity } from "lucide-react";

export function SystemStatusWidget() {
	const systems = [
		{ name: "ERP Visma Enterprise", uptime: "99.98%", status: "Operational" },
		{ name: "Microsoft 365 / Entra ID", uptime: "100.0%", status: "Operational" },
		{ name: "Fortnox API Sync", uptime: "99.95%", status: "Operational" },
		{ name: "TFS Local File Gateway", uptime: "100.0%", status: "Operational" },
	];

	return (
		<div className="space-y-2 pt-2">
			{systems.map((sys) => (
				<div
					key={sys.name}
					className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs"
				>
					<div className="flex items-center gap-2">
						<Server className="h-4 w-4 text-slate-700" />
						<div>
							<p className="text-xs font-semibold text-slate-900">{sys.name}</p>
							<p className="text-[10px] text-slate-500">Uptime: {sys.uptime}</p>
						</div>
					</div>
					<div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
						<Activity className="h-2.5 w-2.5" />
						<span>{sys.status}</span>
					</div>
				</div>
			))}
		</div>
	);
}

export default SystemStatusWidget;
