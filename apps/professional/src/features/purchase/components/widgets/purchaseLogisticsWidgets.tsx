import { CalendarDays, Image as ImageIcon, Truck } from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import localizationConstants from "@/utils/translation/constants";

/** Swedish weekday initials, matching PROJECT_WEEK_DAYS. */

/** July 2026 starts on a Wednesday, so the grid opens with two blank cells. */

/** Jul 28 delivery, Jul 30 order deadline. */

/** Deliveries, purchasing calendar and the image placeholder. */
export const PURCHASE_LOGISTICS_WIDGETS: Record<string, WidgetProps> = {
	purchaseDeliveries: {
		title: localizationConstants.purchaseWidgetDeliveriesTitle,
		icon: Truck,
	},

	purchaseCalendar: {
		title: localizationConstants.purchaseWidgetCalendarTitle,
		icon: CalendarDays,
	},

	purchaseImage: {
		title: localizationConstants.purchaseWidgetImageTitle,
		icon: ImageIcon,
	},
};
