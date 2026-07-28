"use client";

import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import {
	CALCULATION_INITIAL_WIDGETS,
	CALCULATION_SIDEBAR_WIDGET_MAP,
} from "./CalculationDashboardConfig";
import { CALCULATION_SIDEBAR_ITEMS } from "../constants";

const CalculationDashboard = () => (
	<ModuleWidgetDashboard
		widgetMap={CALCULATION_SIDEBAR_WIDGET_MAP}
		initialWidgets={CALCULATION_INITIAL_WIDGETS}
		sidebarItems={CALCULATION_SIDEBAR_ITEMS}
	/>
);

export default CalculationDashboard;
