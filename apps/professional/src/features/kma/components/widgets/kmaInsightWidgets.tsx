import {
	BarChart3,
	Bot,
	Leaf,
	Newspaper,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

export const KMA_INSIGHT_WIDGETS: Record<string, WidgetProps> = {
	kmaEnvironment: {
		title: localizationConstants.kmaWidgetEnvironmentTitle,
		icon: Leaf,
	},

	kmaAiAssistant: {
		title: localizationConstants.kmaWidgetAiTitle,
		icon: Bot,
	},

	kmaActivity: {
		title: localizationConstants.kmaWidgetActivityTitle,
		icon: Zap,
	},

	kmaStatistics: {
		title: localizationConstants.kmaWidgetStatsTitle,
		icon: BarChart3,
	},

	kmaNews: {
		title: localizationConstants.kmaWidgetNewsTitle,
		icon: Newspaper,
	},
};
