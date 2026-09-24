import {
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	ScrollText,
	ShieldAlert,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

export const KMA_CONTROL_WIDGETS: Record<string, WidgetProps> = {
	kmaSecureCheck: {
		title: localizationConstants.kmaWidgetSecureTitle,
		icon: CheckCircle2,
	},

	kmaSafetyRounds: {
		title: localizationConstants.kmaWidgetRoundsTitle,
		icon: ShieldAlert,
	},

	kmaControlPlan: {
		title: localizationConstants.kmaWidgetControlTitle,
		icon: ClipboardList,
	},

	kmaCalendar: {
		title: localizationConstants.kmaWidgetCalendarTitle,
		icon: CalendarDays,
	},

	kmaCertificates: {
		title: localizationConstants.kmaWidgetCertificatesTitle,
		icon: ScrollText,
	},
};
