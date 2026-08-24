"use client";

import WidgetBoard from "@/features/widgetdashboard/components/board/WidgetBoard";
import {
	CALCULATION_BOARD_LIBRARY_ITEMS,
	CALCULATION_STANDARD_WIDGET_IDS,
} from "../constants/calculationWidgetBoard";
import { CALCULATION_SIDEBAR_WIDGET_MAP } from "./CalculationDashboardConfig";

const CalculationDashboard = () => (
	<WidgetBoard
		widgetMap={CALCULATION_SIDEBAR_WIDGET_MAP}
		items={CALCULATION_BOARD_LIBRARY_ITEMS}
		standardWidgetIds={CALCULATION_STANDARD_WIDGET_IDS}
	/>
);

export default CalculationDashboard;
