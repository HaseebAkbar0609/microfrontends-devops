"use client";

import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import {
	OFFER_INITIAL_WIDGETS,
	OFFER_SIDEBAR_WIDGET_MAP,
} from "./OfferDashboardConfig";
import { OFFER_SIDEBAR_ITEMS } from "../constants/dashboardSidebarItems";

const OfferDashboard = () => (
	<ModuleWidgetDashboard
		widgetMap={OFFER_SIDEBAR_WIDGET_MAP}
		initialWidgets={OFFER_INITIAL_WIDGETS}
		sidebarItems={OFFER_SIDEBAR_ITEMS}
	/>
);

export default OfferDashboard;
