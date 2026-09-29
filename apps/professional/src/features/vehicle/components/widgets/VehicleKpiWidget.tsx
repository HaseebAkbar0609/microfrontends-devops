"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { VehicleKpiData } from "../../types/vehicleDashboard.types";

interface VehicleKpiWidgetContentProps {
	data?: VehicleKpiData;
	onDrillDown?: () => void;
}

export const VehicleKpiWidgetContent: React.FC<VehicleKpiWidgetContentProps> = ({
	data,
	onDrillDown,
}) => {
	if (!data) return null;

	const items = [
		{
			labelKey: localizationConstants.vehicleKpiInOperationLabel,
			value: data.inOperation,
		},
		{
			labelKey: localizationConstants.vehicleKpiServicePendingLabel,
			value: data.servicePending,
		},
		{
			labelKey: localizationConstants.vehicleKpiOutOfServiceLabel,
			value: data.outOfService,
		},
		{
			labelKey: localizationConstants.vehicleKpiUpcomingServiceLabel,
			value: data.upcomingService,
		},
		{
			labelKey: localizationConstants.vehicleKpiLogbookNotCompletedLabel,
			value: data.logbookNotCompleted,
		},
	];

	return (
		<div
			className="space-y-1 py-1 font-sans font-normal text-sm leading-5 tracking-normal text-zinc-500 dark:text-zinc-400"
			onClick={onDrillDown}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onDrillDown?.();
				}
			}}
		>
			{items.map((item, idx) => (
				<div
					key={idx}
					className="flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors align-middle py-0.5"
				>
					<span>
						<Translate text={item.labelKey} />: {item.value}
					</span>
				</div>
			))}
		</div>
	);
};
