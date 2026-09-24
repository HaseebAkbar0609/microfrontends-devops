import {
	CalendarDays,
	CalendarRange,
	Layers,
	Map as MapIcon,
	PieChart,
	Target,
	TrafficCone,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

export const PROJECT_OVERVIEW_WIDGETS: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	projectOverview: {
		title: localizationConstants.projWidgetOverviewTitle,
		icon: PieChart,
	},

	projectStatus: {
		title: localizationConstants.projWidgetStatusTitle,
		icon: TrafficCone,
	},

	projectOfMonth: {
		title: localizationConstants.projWidgetMonthTitle,
		icon: CalendarDays,
	},

	projectCalendar: {
		title: localizationConstants.projWidgetCalendarTitle,
		icon: CalendarRange,
	},

	projectMilestones: {
		title: localizationConstants.projWidgetMilestonesTitle,
		icon: Target,
	},

	projectMap: {
		title: localizationConstants.projWidgetMapTitle,
		icon: MapIcon,
	},
};
