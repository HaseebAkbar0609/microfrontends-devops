

import {
	BarChart3,
	MapPin,
	Zap,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import localizationConstants from "@/utils/translation/constants";

import { MachineModalType } from "../components/MachineDashboardModals";

export const getMachineOperationsWidgets = (
	_onOpenModal: (type: MachineModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 5. Machine Usage (Maskinanvändning) 📊
	machineUsage: {
		title: localizationConstants.machineWidgetUsageTitle,
		icon: BarChart3,
	},

	// 6. Latest Activities (Senaste aktiviteter) ⚡
	machineActivities: {
		title: localizationConstants.machineWidgetActivitiesTitle,
		icon: Zap,
	},

	// 7. GPS & Position 📍
	machineGps: {
		title: localizationConstants.machineWidgetGpsTitle,
		icon: MapPin,
	},
});
