"use client";

import { DashboardHeader } from "./DashboardHeader";
import { ModuleWidgetDashboard } from "./ModuleWidgetDashboard";
import { ModulesSection } from "./ModulesSection";
import { INITIAL_WIDGETS, SIDEBAR_WIDGET_MAP } from "./DashboardConfig";
import { SIDEBAR_ITEMS } from "../constants";

const Dashboard = () => (
	<ModuleWidgetDashboard
		widgetMap={SIDEBAR_WIDGET_MAP}
		initialWidgets={INITIAL_WIDGETS}
		sidebarItems={SIDEBAR_ITEMS}
		className="p-4"
		gridHeader={<DashboardHeader title="Karles Bygg AB" />}
		belowGrid={<ModulesSection />}
	/>
);

export default Dashboard;
