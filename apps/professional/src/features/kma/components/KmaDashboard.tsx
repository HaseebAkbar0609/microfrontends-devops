"use client";

import { useMemo } from "react";
import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import {
	KMA_INITIAL_WIDGETS,
	KMA_SIDEBAR_WIDGET_MAP,
} from "./KmaDashboardConfig";
import { KMA_SIDEBAR_ITEMS } from "../constants";

const KmaDashboard = () => {
	const initialWidgets = useMemo(() => KMA_INITIAL_WIDGETS, []);

	return (
		<ModuleWidgetDashboard
			sourceLocation="kma_dashboard"
			widgetMap={KMA_SIDEBAR_WIDGET_MAP}
			initialWidgets={initialWidgets}
			sidebarItems={KMA_SIDEBAR_ITEMS}
		/>
	);
};

export default KmaDashboard;
