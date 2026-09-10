"use client";

import WidgetBoard from "./board/WidgetBoard";
import { DashboardHeader } from "./DashboardHeader";
import { ModulesSection } from "./ModulesSection";
import { SIDEBAR_WIDGET_MAP } from "./DashboardConfig";
import {
	HOME_BOARD_LIBRARY_ITEMS,
	HOME_STANDARD_WIDGET_IDS,
} from "../constants/homeWidgetBoard";

const Dashboard = () => (
	<div className="p-4">
		<WidgetBoard
			widgetMap={SIDEBAR_WIDGET_MAP}
			items={HOME_BOARD_LIBRARY_ITEMS}
			standardWidgetIds={HOME_STANDARD_WIDGET_IDS}
			persistenceLocation="dashboard"
			header={<DashboardHeader title="Karles Bygg AB" />}
			belowGrid={<ModulesSection />}
		/>
	</div>
);

export default Dashboard;
