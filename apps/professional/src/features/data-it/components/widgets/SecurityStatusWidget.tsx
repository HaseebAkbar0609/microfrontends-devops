"use client";

import React from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import type { DataItSecurityItem } from "../../types/dataIt.types";

interface SecurityStatusWidgetProps {
	items: DataItSecurityItem[];
}

export function SecurityStatusWidget({ items }: SecurityStatusWidgetProps) {
	return (
		<div className="space-y-2 pt-2">
			{items.map((item) => (
				<div
					key={item.id}
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
						{item.percentage !== undefined && `${item.percentage}%`}
						{item.count !== undefined && item.valueKey && (
							<span>
								{item.count} <Translate text={item.valueKey} />
							</span>
						)}
						{item.percentage === undefined &&
							item.count === undefined &&
							item.valueKey && <Translate text={item.valueKey} />}
					</span>
				</div>
			))}
		</div>
	);
}

export default SecurityStatusWidget;

