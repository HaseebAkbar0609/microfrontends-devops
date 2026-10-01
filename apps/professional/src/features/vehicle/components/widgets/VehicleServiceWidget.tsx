"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { VehicleServiceItem } from "../../types/vehicleDashboard.types";

interface VehicleServiceWidgetContentProps {
	services?: VehicleServiceItem[];
	maxItems?: number;
	onSelectService?: (service: VehicleServiceItem) => void;
}

export const VehicleServiceWidgetContent: React.FC<
	VehicleServiceWidgetContentProps
> = ({ services = [], maxItems = 3, onSelectService }) => {
	const displayServices = services.slice(0, maxItems);

	if (displayServices.length === 0) {
		return (
			<div className="py-4 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.vehicleEmptyServicesTitle} />
			</div>
		);
	}

	return (
		<div className="space-y-1 py-1 font-sans font-normal text-sm leading-5 tracking-normal text-zinc-500 dark:text-zinc-400">
			{displayServices.map((service) => (
				<div
					key={service.id}
					className="flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer align-middle py-0.5"
					onClick={() => onSelectService?.(service)}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							onSelectService?.(service);
						}
					}}
				>
					<span className="truncate">
						<Translate text={localizationConstants.vehicleServicePrefix} />{" "}
						{service.vehicleNumber} – {service.title}
					</span>
				</div>
			))}
		</div>
	);
};
