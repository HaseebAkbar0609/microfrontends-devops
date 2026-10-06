"use client";

import React from "react";
import { AlertCircle, Calendar } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { WarrantyExpiryDevice } from "../../types/dataIt.types";

interface WarrantyExpiryWidgetProps {
	devices: WarrantyExpiryDevice[];
}

export function WarrantyExpiryWidget({ devices }: WarrantyExpiryWidgetProps) {
	if (devices.length === 0) {
		return (
			<div className="flex h-32 flex-col items-center justify-center text-center text-slate-500">
				<AlertCircle className="mb-1 h-6 w-6 text-slate-400" />
				<p className="text-xs font-medium">
					<Translate text={localizationConstants.dataItEmptyWarrantyTitle} />
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-2 pt-2">
			{devices.map((device) => (
				<div
					key={device.id}
					className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs"
				>
					<div className="min-w-0 pr-2">
						<p className="truncate text-xs font-semibold text-slate-900">
							{device.name}
						</p>
						<p className="truncate text-[11px] text-slate-500">
							{device.assignedTo} · {device.serialNumber}
						</p>
					</div>

					<div className="flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
						<Calendar className="h-3 w-3" />
						<span>
							{device.daysLeft}{" "}
							<Translate text={localizationConstants.dataItExpiringInDays} />
						</span>
					</div>
				</div>
			))}
		</div>
	);
}

export default WarrantyExpiryWidget;
