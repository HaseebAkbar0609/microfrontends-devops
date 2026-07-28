"use client";

import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import {
	B2B_INITIAL_WIDGETS,
	B2B_SIDEBAR_WIDGET_MAP,
} from "./B2BDashboardConfig";
import { B2B_SIDEBAR_ITEMS } from "../constants";

const B2BDashboard = () => (
	<ModuleWidgetDashboard
		widgetMap={B2B_SIDEBAR_WIDGET_MAP}
		initialWidgets={B2B_INITIAL_WIDGETS}
		sidebarItems={B2B_SIDEBAR_ITEMS}
	/>
);

export default B2BDashboard;
