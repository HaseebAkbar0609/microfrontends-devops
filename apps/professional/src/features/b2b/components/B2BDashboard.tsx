"use client";

import WidgetBoard from "@/features/widgetdashboard/components/board/WidgetBoard";
import {
	B2B_BOARD_LIBRARY_ITEMS,
	B2B_STANDARD_WIDGET_IDS,
} from "../constants/b2bWidgetBoard";
import { B2B_SIDEBAR_WIDGET_MAP } from "./B2BDashboardConfig";

const B2BDashboard = () => (
	<WidgetBoard
		widgetMap={B2B_SIDEBAR_WIDGET_MAP}
		items={B2B_BOARD_LIBRARY_ITEMS}
		standardWidgetIds={B2B_STANDARD_WIDGET_IDS}
	/>
);

export default B2BDashboard;
