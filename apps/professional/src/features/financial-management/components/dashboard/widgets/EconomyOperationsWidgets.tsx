"use client";

import {
	Building,
	Building2,
	ClipboardList,
	CreditCard,
	ReceiptText,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { EconomyDashboardState } from "../../../types/economyDashboard.types";

export function createEconomyOperationsWidgets(
	_state: EconomyDashboardState,
): Record<string, WidgetProps> {
	return {
		// 11) Kundfordringar (A/R)
		accountsReceivable: {
			title: localizationConstants.accountsReceivableWidgetTitle,
			icon: CreditCard,
		},

		// 12) Leverantörsskulder (A/P)
		accountsPayable: {
			title: localizationConstants.accountsPayableWidgetTitle,
			icon: Building2,
		},

		// 14) Fakturering
		invoicing: {
			title: localizationConstants.invoicingWidgetTitle,
			icon: ReceiptText,
		},

		// 16) Projektekonomi
		projectEconomy: {
			title: localizationConstants.projectEconomyWidgetTitle,
			icon: Building,
		},

		// 17) Orderekonomi
		orderEconomy: {
			title: localizationConstants.orderEconomyWidgetTitle,
			icon: ClipboardList,
		},
	};
}
