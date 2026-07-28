"use client";

import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import {
	PROJECT_INITIAL_WIDGETS,
	PROJECT_SIDEBAR_WIDGET_MAP,
} from "./ProjectDashboardConfig";
import { PROJECT_SIDEBAR_ITEMS } from "../constants";

const ProjectDashboard = () => (
	<ModuleWidgetDashboard
		widgetMap={PROJECT_SIDEBAR_WIDGET_MAP}
		initialWidgets={PROJECT_INITIAL_WIDGETS}
		sidebarItems={PROJECT_SIDEBAR_ITEMS}
	/>
);

export default ProjectDashboard;
