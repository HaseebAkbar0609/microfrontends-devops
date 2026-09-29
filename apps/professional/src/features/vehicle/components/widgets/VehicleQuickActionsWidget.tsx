"use client";

import React from "react";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export const VehicleQuickActionsWidgetContent: React.FC = () => {
	const actions: Array<{
		labelKey: TranslationKeys;
	}> = [
		{
			labelKey: localizationConstants.vehicleActionAddMachine,
		},
		{
			labelKey: localizationConstants.vehicleActionRegisterService,
		},
		{
			labelKey: localizationConstants.vehicleActionAddVehicle,
		},
		{
			labelKey: localizationConstants.vehicleActionVehicleMap,
		},
		{
			labelKey: localizationConstants.vehicleActionLogbook,
		},
		{
			labelKey: localizationConstants.vehicleActionNewKey,
		},
	];

	return (
		<div className="space-y-1 py-1 font-sans font-normal text-sm leading-5 tracking-normal text-zinc-500 dark:text-zinc-400">
			{actions.map((action, idx) => (
				<div
					key={idx}
					className="flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-normal transition-colors cursor-default select-none align-middle py-0.5"
				>
					<span>
						<Translate text={action.labelKey} />
					</span>
				</div>
			))}
		</div>
	);
};
