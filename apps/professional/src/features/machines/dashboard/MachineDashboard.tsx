"use client";

import { useMemo, useState } from "react";

import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	MachineDashboardModals,
	type MachineModalType,
} from "./components/MachineDashboardModals";
import {
	getMachineInitialWidgets,
	getMachineWidgetMap,
	MACHINE_SIDEBAR_ITEMS,
} from "./MachineDashboardConfig";

export const MachineDashboard = () => {
	const t = useTranslate();
	const [isRearranging, setIsRearranging] = useState(false);
	const [activeModal, setActiveModal] = useState<MachineModalType>(null);
	const [initialAiPrompt, setInitialAiPrompt] = useState<string | undefined>(undefined);

	const handleOpenModal = (type: MachineModalType, prompt?: string) => {
		setInitialAiPrompt(prompt);
		setActiveModal(type);
	};

	const handleCloseModal = () => {
		setActiveModal(null);
		setInitialAiPrompt(undefined);
	};

	const widgetMap = useMemo(
		() => getMachineWidgetMap(handleOpenModal),
		[],
	);

	const initialWidgets = useMemo(
		() => getMachineInitialWidgets(widgetMap),
		[widgetMap],
	);

	return (
		<div className="relative flex flex-1 flex-col min-h-0">
			<ModuleWidgetDashboard
				widgetMap={widgetMap}
				initialWidgets={initialWidgets}
				sidebarItems={MACHINE_SIDEBAR_ITEMS}
				rail={({ selectedItem, onSelectItem, placedItemIds }) => (
					<DashboardRearrangeRail
						items={MACHINE_SIDEBAR_ITEMS}
						selectedItem={selectedItem}
						onSelectItem={onSelectItem}
						placedItemIds={placedItemIds}
						isRearranging={isRearranging}
						onToggleRearrange={() =>
							setIsRearranging((previous) => !previous)
						}
						onSave={() =>
							showToast(
								"success",
								t(localizationConstants.widgetBoardLayoutSaved),
							)
						}
						onDiscard={() => {
							setIsRearranging(false);
							showToast(
								"info",
								t(localizationConstants.widgetRailDiscard),
							);
						}}
					/>
				)}
			/>

			{/* Interactive Modals */}
			<MachineDashboardModals
				activeModal={activeModal}
				initialAiPrompt={initialAiPrompt}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

export default MachineDashboard;
