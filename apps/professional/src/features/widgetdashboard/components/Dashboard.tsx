"use client";

import { Card } from "@/components/ui/card";
import { AvailableProjectsCard } from "./AvailableProjectsCard";
import { DashboardHeader } from "./DashboardHeader";
import { ModuleWidgetDashboard } from "./ModuleWidgetDashboard";
import { ModulesSection } from "./ModulesSection";
import { SidebarActions } from "./SidebarActions";
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
		panelHeader={
			<Card className="p-6 shadow-none gap-3">
				<SidebarActions />
				<AvailableProjectsCard />
			</Card>
		}
	/>
);

export default Dashboard;
