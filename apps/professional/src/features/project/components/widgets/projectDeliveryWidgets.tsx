import {
	Award,
	CircleDollarSign,
	HardHat,
	Plus,
	ShieldCheck,
	Timer,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

export const PROJECT_DELIVERY_WIDGETS: Record<string, WidgetProps> = {
	projectResources: {
		title: localizationConstants.projWidgetResourcesTitle,
		icon: HardHat,
	},

	projectTimeReporting: {
		title: localizationConstants.projWidgetTimeTitle,
		icon: Timer,
	},

	projectValue: {
		title: localizationConstants.projWidgetValueTitle,
		icon: CircleDollarSign,
	},

	projectAta: {
		title: localizationConstants.projWidgetAtaTitle,
		icon: Plus,
	},

	projectKma: {
		title: localizationConstants.projWidgetKmaTitle,
		icon: HardHat,
	},

	projectSecureCheck: {
		title: localizationConstants.projWidgetSecureTitle,
		icon: ShieldCheck,
	},

	projectInspection: {
		title: localizationConstants.projWidgetInspectionTitle,
		icon: Award,
	},
};
