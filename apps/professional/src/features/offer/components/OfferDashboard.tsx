"use client";

import WidgetBoard from "@/features/widgetdashboard/components/board/WidgetBoard";
import {
	OFFER_BOARD_LIBRARY_ITEMS,
	OFFER_STANDARD_WIDGET_IDS,
} from "../constants/offerWidgetBoard";
import { OFFER_SIDEBAR_WIDGET_MAP } from "./OfferDashboardConfig";

const OfferDashboard = () => (
	<WidgetBoard
		widgetMap={OFFER_SIDEBAR_WIDGET_MAP}
		items={OFFER_BOARD_LIBRARY_ITEMS}
		standardWidgetIds={OFFER_STANDARD_WIDGET_IDS}
		persistenceLocation="offer_dashboard"
	/>
);

export default OfferDashboard;
