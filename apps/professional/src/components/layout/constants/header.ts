import {
	FileText,
	LayoutGrid,
	Calculator,
	Folder,
	ShoppingCart,
	ShoppingBag,
	PencilRuler,
	ShieldCheck,
	Warehouse,
	Truck,
	Construction,
	IdCard,
	FileCheck2,
	PieChart,
	TrendingUp,
	Users,
	Landmark,
	Wallet,
	Presentation,
	Megaphone,
	FileSignature,
	Monitor,
	FileStack,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

export interface AppItem {
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	href: string;
}

export interface AppGroup {
	category: string;
	items: AppItem[];
}

export const APP_GROUPS: AppGroup[] = [
	// 1. Affär
	{
		category: localizationConstants.businessCategory,
		items: [
			{
				label: localizationConstants.offer,
				icon: FileText,        // Document with text lines
				href: "/module/business/offer/dashboard",
			},
			{
				label: localizationConstants.b2b,
				icon: LayoutGrid,      // 4-square grid icon
				href: "/module/business/b2b",
			},
			{
				label: localizationConstants.calculation,
				icon: Calculator,      // Calculator with + and =
				href: "/module/business/calculation",
			},
		],
	},

	// 2. Produktion
	{
		category: localizationConstants.productionCategory,
		items: [
			// Row 1: Projekt, Order, Inköp
			{
				label: localizationConstants.project,
				icon: Folder,          // Folder icon
				href: "/module/production/project",
			},
			{
				label: localizationConstants.order,
				icon: ShoppingCart,    // Shopping cart
				href: "/module/production/order",
			},
			{
				label: localizationConstants.purchase,
				icon: ShoppingBag,     // Shopping bag with handles
				href: "/module/production/purchase",
			},
			// Row 2: Projektering, KMA, Material & Lager
			{
				label: localizationConstants.design,
				icon: PencilRuler,     // Pencil + ruler drawing icon
				href: "/module/production/design",
			},
			{
				label: localizationConstants.kma,
				icon: ShieldCheck,     // Shield with checkmark
				href: "/module/production/kma",
			},
			{
				label: localizationConstants.materialStorage,
				icon: Warehouse,       // Warehouse building with entrance
				href: "/module/production/material-storage",
			},
			// Row 3: Fordon, Maskin, Åtkomst
			{
				label: localizationConstants.vehicle,
				icon: Truck,           // Delivery truck
				href: "/module/production/vehicle",
			},
			{
				label: localizationConstants.machine,
				icon: Construction,    // Construction excavator/equipment
				href: "/module/production/machine",
			},
			{
				label: localizationConstants.access,
				icon: IdCard,          // ID badge card with portrait photo and info lines
				href: "/module/production/access",
			},
		],
	},

	// 3. Ekonomistyrning
	{
		category: localizationConstants.financialManagementCategory,
		items: [
			// Row 1: Faktura, Ekonomi, Prognos
			{
				label: localizationConstants.invoice,
				icon: FileCheck2,      // Document page with text lines
				href: "/module/financial-management/invoice",
			},
			{
				label: localizationConstants.economy,
				icon: PieChart,        // Pie chart circle
				href: "/module/financial-management/economy",
			},
			{
				label: localizationConstants.forecast,
				icon: TrendingUp,      // Line graph with upward arrow
				href: "/module/financial-management/forecast",
			},
			// Row 2: Personal, Juridik, Inkasso
			{
				label: localizationConstants.personnel,
				icon: Users,           // Two people outlines
				href: "/module/financial-management/personnel",
			},
			{
				label: localizationConstants.law,
				icon: Landmark,        // Temple pillars / columns
				href: "/module/financial-management/law",
			},
			{
				label: localizationConstants.debtCollection,
				icon: Wallet,          // Wallet with card popping out
				href: "/module/financial-management/debt-collection",
			},
		],
	},

	// 4. Affärsstöd
	{
		category: localizationConstants.businessSupportCategory,
		items: [
			// Row 1: Ledning, Marknad, Avtal
			{
				label: localizationConstants.managementSupport,
				icon: Presentation,    // Presentation easel board on tripod legs
				href: "/module/business-support/management-support",
			},
			{
				label: localizationConstants.marketingSales,
				icon: Megaphone,       // Megaphone bullhorn
				href: "/module/business-support/marketing-sales",
			},
			{
				label: localizationConstants.agreement,
				icon: FileSignature,   // Document with signature pen
				href: "/module/business-support/agreement",
			},
			// Row 2: Data & IT, Mallar
			{
				label: localizationConstants.dataIT,
				icon: Monitor,         // Computer monitor screen
				href: "/module/business-support/data-it",
			},
			{
				label: localizationConstants.templates,
				icon: FileStack,       // Stacked template documents
				href: "/module/business-support/templates",
			},
		],
	},
];
