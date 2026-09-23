"use client";

import { useMemo } from "react";
import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import {
	PROJECT_INITIAL_WIDGETS,
	PROJECT_SIDEBAR_WIDGET_MAP,
} from "./ProjectDashboardConfig";
import { PROJECT_SIDEBAR_ITEMS } from "../constants";

const ProjectDashboard = () => {
	const initialWidgets = useMemo(() => PROJECT_INITIAL_WIDGETS, []);

	return (
		<ModuleWidgetDashboard
			sourceLocation="project_dashboard"
			widgetMap={PROJECT_SIDEBAR_WIDGET_MAP}
			initialWidgets={initialWidgets}
			sidebarItems={PROJECT_SIDEBAR_ITEMS}
		/>
	);
};

export default ProjectDashboard;
