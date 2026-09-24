import {
	AlertTriangle,
	HardHat,
	Shield,
	Siren,
	Zap,
	Layers,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

export const KMA_COMPLIANCE_WIDGETS: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	kmaScore: {
		title: localizationConstants.kmaWidgetScoreTitle,
		icon: Shield,
	},

	kmaOverview: {
		title: localizationConstants.kmaWidgetOverviewTitle,
		icon: HardHat,
	},

	kmaDeviations: {
		title: localizationConstants.kmaWidgetDeviationsTitle,
		icon: Siren,
	},

	kmaIncidents: {
		title: localizationConstants.kmaWidgetIncidentsTitle,
		icon: Zap,
	},

	kmaRiskAssessments: {
		title: localizationConstants.kmaWidgetRisksTitle,
		icon: AlertTriangle,
	},
};
