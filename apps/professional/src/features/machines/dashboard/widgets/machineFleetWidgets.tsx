

import {
	Activity,
	Building2,
	Radio,
	Truck,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import localizationConstants from "@/utils/translation/constants";

import { MachineModalType } from "../components/MachineDashboardModals";

export const getMachineFleetWidgets = (
	_onOpenModal: (type: MachineModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 1. Machine Health Score 🟢🟡🔴
	machineHealth: {
		title: localizationConstants.machineWidgetHealthTitle,
		icon: Activity,
	},

	// 2. Machine Overview (Maskinöversikt) 🚜
	machineOverview: {
		title: localizationConstants.machineWidgetOverviewTitle,
		icon: Truck,
	},

	// 3. Machine Status (Maskinstatus) 🚦
	machineStatus: {
		title: localizationConstants.machineWidgetStatusTitle,
		icon: Radio,
	},

	// 4. Machine Fleet (Maskinpark) 💰
	machineFleet: {
		title: localizationConstants.machineWidgetFleetTitle,
		icon: Building2,
	},
});
