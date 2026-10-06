"use client";

import React from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface SecurityItem {
	labelKey: string;
	valueKey: string;
	status: "ok" | "warn";
}

const SECURITY_ITEMS: SecurityItem[] = [
	{
		labelKey: localizationConstants.dataItMfaCompliance,
		valueKey: "98.4%",
		status: "ok",
	},
	{
		labelKey: localizationConstants.dataItDailyBackup,
		valueKey: localizationConstants.dataItCompleted,
		status: "ok",
	},
	{
		labelKey: localizationConstants.dataItAntivirusStatus,
		valueKey: localizationConstants.dataItUpToDate,
		status: "ok",
	},
	{
		labelKey: localizationConstants.dataItPendingPatches,
		valueKey: localizationConstants.dataItOperational,
		status: "warn",
	},
];

export function SecurityStatusWidget() {
	return (
		<div className="space-y-2 pt-2">
			{SECURITY_ITEMS.map((item) => (
				<div
					key={item.labelKey}
					className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs"
				>
					<div className="flex items-center gap-2">
						{item.status === "ok" ? (
							<CheckCircle2 className="h-4 w-4 text-emerald-600" />
						) : (
							<ShieldAlert className="h-4 w-4 text-amber-600" />
						)}
						<span className="text-xs font-medium text-slate-800">
							<Translate text={item.labelKey} />
						</span>
					</div>
					<span className="text-xs font-semibold text-slate-600">
						{item.valueKey.includes("%") ? (
							item.valueKey
						) : (
							<Translate text={item.valueKey} />
						)}
					</span>
				</div>
			))}
		</div>
	);
}

export default SecurityStatusWidget;
