"use client";

import { useMemo, useState } from "react";

import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	PURCHASE_INITIAL_WIDGETS,
	PURCHASE_SIDEBAR_ITEMS,
	PURCHASE_WIDGET_MAP,
} from "./PurchaseDashboardConfig";

const PurchaseDashboard = () => {
	const t = useTranslate();
	const initialWidgets = useMemo(() => PURCHASE_INITIAL_WIDGETS, []);
	const [isRearranging, setIsRearranging] = useState(false);

	return (
		<ModuleWidgetDashboard
			widgetMap={PURCHASE_WIDGET_MAP}
			initialWidgets={initialWidgets}
			sidebarItems={PURCHASE_SIDEBAR_ITEMS}
			rail={({ selectedItem, onSelectItem, placedItemIds }) => (
				<DashboardRearrangeRail
					items={PURCHASE_SIDEBAR_ITEMS}
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
	);
};

export default PurchaseDashboard;
