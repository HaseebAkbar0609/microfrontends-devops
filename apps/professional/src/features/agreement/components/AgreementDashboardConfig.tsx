import {
	Clock,
	Search,
	Folder,
	Table2,
	ShieldCheck,
	User,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";

export const AGREEMENT_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Folder },

	agreementKpi: {
		title: localizationConstants.agreementWidgetKpiTitle,
		icon: Folder,
	},

	agreementActive: {
		title: localizationConstants.agreementWidgetActiveTitle,
		icon: Table2,
	},

	agreementExpiring: {
		title: localizationConstants.agreementWidgetExpiringTitle,
		icon: Clock,
	},

	agreementPending: {
		title: localizationConstants.agreementWidgetPendingTitle,
		icon: ShieldCheck,
	},

	agreementSupplier: {
		title: localizationConstants.agreementWidgetSupplierTitle,
		icon: User,
	},

	agreementSearch: {
		title: localizationConstants.agreementWidgetSearchTitle,
		icon: Search,
	},
};

export const AGREEMENT_WIDGET_ORDER = [
	"agreementKpi",
	"agreementActive",
	"agreementExpiring",
	"agreementPending",
	"agreementSupplier",
	"agreementSearch",
] as const;

export const AGREEMENT_INITIAL_WIDGETS: PlacedWidgetEntry[] = [
	{ uid: "agreement-kpi", sidebarId: "agreementKpi", colSpanClass: "col-span-12 sm:col-span-4 h-[160px]", widgetProps: AGREEMENT_SIDEBAR_WIDGET_MAP.agreementKpi },
	{ uid: "agreement-active", sidebarId: "agreementActive", colSpanClass: "col-span-12 sm:col-span-8 h-[160px]", widgetProps: AGREEMENT_SIDEBAR_WIDGET_MAP.agreementActive },
	{ uid: "agreement-expiring", sidebarId: "agreementExpiring", colSpanClass: "col-span-12 sm:col-span-4 h-[281px]", widgetProps: AGREEMENT_SIDEBAR_WIDGET_MAP.agreementExpiring },
	{ uid: "agreement-pending", sidebarId: "agreementPending", colSpanClass: "col-span-12 sm:col-span-4 h-[281px]", widgetProps: AGREEMENT_SIDEBAR_WIDGET_MAP.agreementPending },
	{ uid: "agreement-supplier", sidebarId: "agreementSupplier", colSpanClass: "col-span-12 sm:col-span-4 h-[281px]", widgetProps: AGREEMENT_SIDEBAR_WIDGET_MAP.agreementSupplier },
	{ uid: "agreement-search", sidebarId: "agreementSearch", colSpanClass: "col-span-12 h-[127px]", widgetProps: AGREEMENT_SIDEBAR_WIDGET_MAP.agreementSearch },
];
