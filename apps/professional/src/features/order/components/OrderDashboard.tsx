"use client";

import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import {
	ORDER_INITIAL_WIDGETS,
	ORDER_SIDEBAR_WIDGET_MAP,
} from "./OrderDashboardConfig";
import { ORDER_SIDEBAR_ITEMS } from "../constants";

const OrderDashboard = () => (
	<ModuleWidgetDashboard
		sourceLocation="order_dashboard"
		widgetMap={ORDER_SIDEBAR_WIDGET_MAP}
		initialWidgets={ORDER_INITIAL_WIDGETS}
		sidebarItems={ORDER_SIDEBAR_ITEMS}
	/>
);

export default OrderDashboard;
