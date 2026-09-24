
import {
	Activity,
	CalendarDays,
	Image as ImageIcon,
	Newspaper,
	PenTool,
	Users,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import localizationConstants from "@/utils/translation/constants";

import { DesignModalType } from "../components/DesignDashboardModals";

export const getDesignOverviewWidgets = (
	_onOpenModal: (type: DesignModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 1. Design Overview
	designOverview: {
		title: localizationConstants.designWidgetOverviewTitle,
		icon: PenTool,
	},

	// 2. Design Meetings
	designMeetings: {
		title: localizationConstants.designWidgetMeetingsTitle,
		icon: Users,
	},

	// 3. Latest Activities
	designActivities: {
		title: localizationConstants.designWidgetActivitiesTitle,
		icon: Activity,
	},

	// 6. Calendar
	designCalendar: {
		title: localizationConstants.designWidgetCalendarTitle,
		icon: CalendarDays,
	},

	// 7. Image / Model
	designImage: {
		title: localizationConstants.designWidgetImageTitle,
		icon: ImageIcon,
	},

	// 8. News
	designNews: {
		title: localizationConstants.designWidgetNewsTitle,
		icon: Newspaper,
	},
});
