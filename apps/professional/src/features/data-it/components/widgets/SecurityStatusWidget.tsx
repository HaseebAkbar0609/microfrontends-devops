"use client";

import React from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export function SecurityStatusWidget() {
	const securityItems = [
		{ label: "MFA Compliance", value: "98.4%", status: "ok" },
		{ label: "Daily Cloud Backup", value: "Completed 03:00", status: "ok" },
		{ label: "Antivirus Definitions", value: "Up to date", status: "ok" },
		{ label: "Pending OS Patches", value: "2 devices", status: "warn" },
	];

	return (
		<div className="space-y-2 pt-2">
			{securityItems.map((item) => (
				<div
					key={item.label}
					className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs"
				>
					<div className="flex items-center gap-2">
						{item.status === "ok" ? (
							<CheckCircle2 className="h-4 w-4 text-emerald-600" />
						) : (
							<ShieldAlert className="h-4 w-4 text-amber-600" />
						)}
						<span className="text-xs font-medium text-slate-800">
							{item.label}
						</span>
					</div>
					<span className="text-xs font-semibold text-slate-600">
						{item.value}
					</span>
				</div>
			))}
		</div>
	);
}

export default SecurityStatusWidget;
