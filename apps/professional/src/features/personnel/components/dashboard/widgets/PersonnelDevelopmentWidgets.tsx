"use client";

import {
	BookOpen,
	FileCheck,
	ImageIcon,
	Newspaper,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { PersonnelDashboardState } from "../../../types/personnelDashboard.types";

export function createPersonnelDevelopmentWidgets(
	_state: PersonnelDashboardState,
): Record<string, WidgetProps> {
	return {
		// 11) Utbildningar
		trainings: {
			title: localizationConstants.wTrainingsTitle,
			icon: BookOpen,
			emptyTitle: localizationConstants.wTrainingsTitle,
			emptyDescription: localizationConstants.wTrainingsDesc,
		},

		// 12) Certifikat & Behörigheter
		certificates: {
			title: localizationConstants.wCertificatesTitle,
			icon: FileCheck,
			emptyTitle: localizationConstants.wCertificatesTitle,
			emptyDescription: localizationConstants.wCertificatesDesc,
		},

		// 13) Bild
		teamImage: {
			title: localizationConstants.wImageTitle,
			icon: ImageIcon,
			emptyTitle: localizationConstants.wImageTitle,
			emptyDescription: localizationConstants.wImageDesc,
		},

		// 14) Nyheter
		personnelNews: {
			title: localizationConstants.wNewsTitle,
			icon: Newspaper,
			emptyTitle: localizationConstants.wNewsTitle,
			emptyDescription: localizationConstants.wNewsDesc,
		},
	};
}
