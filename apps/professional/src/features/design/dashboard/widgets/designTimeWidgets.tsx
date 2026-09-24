
import {
	Bot,
	Clock,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import localizationConstants from "@/utils/translation/constants";

import { DesignModalType } from "../components/DesignDashboardModals";

export const getDesignTimeWidgets = (
	_onOpenModal: (type: DesignModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 4. Design Time
	designTime: {
		title: localizationConstants.designWidgetTimeTitle,
		icon: Clock,
	},

	// 5. AI Design Assistant
	designAiAssistant: {
		title: localizationConstants.designWidgetAiTitle,
		icon: Bot,
	},
});
