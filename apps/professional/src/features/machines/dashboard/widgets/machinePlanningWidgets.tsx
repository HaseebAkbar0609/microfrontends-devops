
import {
	Bot,
	CalendarDays,
	Image as ImageIcon,
	Wrench,
} from "lucide-react";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import localizationConstants from "@/utils/translation/constants";

import { MachineModalType } from "../components/MachineDashboardModals";

export const getMachinePlanningWidgets = (
	_onOpenModal: (type: MachineModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	// 8. AI Machine Assistant (AI Maskinassistent) 🤖
	machineAiAssistant: {
		title: localizationConstants.machineWidgetAiTitle,
		icon: Bot,
	},

	// 9. Repairs (Reparationer) 🛠️
	machineRepairs: {
		title: localizationConstants.machineWidgetRepairsTitle,
		icon: Wrench,
	},

	// 10. Bookings (Bokningar) 📅
	machineBookings: {
		title: localizationConstants.machineWidgetBookingsTitle,
		icon: CalendarDays,
	},

	// 11. Image (Bild) 🖼️
	machineImage: {
		title: localizationConstants.machineWidgetImageTitle,
		icon: ImageIcon,
	},
});
