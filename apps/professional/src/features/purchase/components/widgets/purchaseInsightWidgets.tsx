import { Bot, Leaf, Zap } from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import localizationConstants from "@/utils/translation/constants";

/** Latest activities, the AI assistant and sustainability. */
export const PURCHASE_INSIGHT_WIDGETS: Record<string, WidgetProps> = {
	purchaseActivity: {
		title: localizationConstants.purchaseWidgetActivityTitle,
		icon: Zap,
	},

	purchaseAiAssistant: {
		title: localizationConstants.purchaseWidgetAiTitle,
		icon: Bot,
	},

	purchaseEnvironment: {
		title: localizationConstants.purchaseWidgetEnvTitle,
		icon: Leaf,
	},
};
