import {
	BarChart3,
	Bell,
	Bot,
	Image as ImageIcon,
	Newspaper,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

export const PROJECT_INSIGHT_WIDGETS: Record<string, WidgetProps> = {
	projectRequiresAction: {
		title: localizationConstants.projWidgetActionTitle,
		icon: Bell,
	},

	projectAiAssistant: {
		title: localizationConstants.projWidgetAiTitle,
		icon: Bot,
	},

	projectActivity: {
		title: localizationConstants.projWidgetActivityTitle,
		icon: Zap,
	},

	projectStatistics: {
		title: localizationConstants.projWidgetStatsTitle,
		icon: BarChart3,
	},

	projectNews: {
		title: localizationConstants.projWidgetNewsTitle,
		icon: Newspaper,
	},

	image: {
		title: localizationConstants.projWidgetImageTitle,
		icon: ImageIcon,
	},
};
