import { CircleCheck, Coins, ShoppingCart } from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import localizationConstants from "@/utils/translation/constants";

/** Purchasing overview, purchasing value and delivery control. */
export const PURCHASE_OVERVIEW_WIDGETS: Record<string, WidgetProps> = {
	purchaseOverview: {
		title: localizationConstants.purchaseWidgetOverviewTitle,
		icon: ShoppingCart,
	},

	purchaseValue: {
		title: localizationConstants.purchaseWidgetValueTitle,
		icon: Coins,
	},

	purchaseDeliveryControl: {
		title: localizationConstants.purchaseWidgetControlTitle,
		icon: CircleCheck,
	},
};
