"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { VehicleDriveData } from "../../types/vehicleDashboard.types";

interface VehicleDriveWidgetContentProps {
	data?: VehicleDriveData;
	onOpenMap?: () => void;
	onApproveLogbooks?: () => void;
}

export const VehicleDriveWidgetContent: React.FC<
	VehicleDriveWidgetContentProps
> = ({ data, onOpenMap, onApproveLogbooks }) => {
	if (!data) return null;

	return (
		<div className="space-y-1 py-1 font-sans font-normal text-sm leading-5 tracking-normal text-zinc-500 dark:text-zinc-400">
			<div
				className="flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer align-middle py-0.5"
				onClick={onOpenMap}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") onOpenMap?.();
				}}
			>
				<span>
					<Translate
						text={localizationConstants.vehicleDriveActiveVehiclesLabel}
					/>
					: {data.activeVehiclesCount}{" "}
					<Translate
						text={localizationConstants.vehicleDriveActiveVehiclesSuffix}
					/>
				</span>
			</div>
			<div
				className="flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer align-middle py-0.5"
				onClick={onOpenMap}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") onOpenMap?.();
				}}
			>
				<span>
					{data.noGpsCount}{" "}
					<Translate text={localizationConstants.vehicleDriveNoGpsSuffix} />
				</span>
			</div>
			<div
				className="flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer align-middle py-0.5"
				onClick={onApproveLogbooks}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") onApproveLogbooks?.();
				}}
			>
				<span>
					{data.unapprovedLogbooksCount}{" "}
					<Translate
						text={localizationConstants.vehicleDriveUnapprovedLogbooksSuffix}
					/>
				</span>
			</div>
		</div>
	);
};
