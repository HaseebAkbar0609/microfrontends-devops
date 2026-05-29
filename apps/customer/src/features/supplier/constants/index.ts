export const SUPPLIER_DETAIL_TABS = [
	"overview",
	"projects",
	"services",
	"documents",
	"reviews",
] as const;

export type SupplierDetailTabValue = (typeof SUPPLIER_DETAIL_TABS)[number];

export const SUPPLIER_DETAIL_DEFAULT_TAB = SUPPLIER_DETAIL_TABS[0];

export const SUPPLIER_DETAIL_TAB_LABELS: Record<string, string> = {
	overview: "Översikt",
	projects: "Projekt",
	services: "Tjänster",
	documents: "Dokument",
	reviews: "Omdömen",
};

export interface Supplier {
	id: string;
	initials: string;
	name: string;
	category: string;
	location: string;
	rating: number;
	reviewCount: number;
	isVerified: boolean;
	isTopSupplier: boolean;
	isOnline: boolean;
	phone: string;
	email: string;
	website: string;
	languages: string;
	responseTime: string;
	lastActive: string;
	completedProjects: number;
	ongoingProjects: number;
	hasRotRut: boolean;
	description: string;
	certifications: number;
	mainMunicipality: string;
	additionalMunicipalities: number;
}

export const DUMMY_SUPPLIER: Supplier = {
	id: "1",
	initials: "PB",
	name: "Pelle bygg AB",
	category: "Bygg & Renovering",
	location: "Stockholm, Sweden",
	rating: 5.0,
	reviewCount: 48,
	isVerified: true,
	isTopSupplier: true,
	isOnline: true,
	phone: "08–580 50 50",
	email: "info@pellebygg.se",
	website: "www.pellebygg.se",
	languages: "Svenska, English",
	responseTime: "~2 timmar",
	lastActive: "Aktiv senaste 2 dagar",
	completedProjects: 124,
	ongoingProjects: 6,
	hasRotRut: true,
	description:
		"Pelle bygg AB är ett välrenommerat byggföretag med över 15 års erfarenhet av renovering och nybyggnation i Stockholmsområdet. Vi specialiserar oss på badrum och kök men erbjuder ett komplett utbud av byggtjänster.",
	certifications: 3,
	mainMunicipality: "Stockholm",
	additionalMunicipalities: 2,
};

export interface SupplierService {
	id: string;
	name: string;
	isPopular: boolean;
}

export const DUMMY_SERVICES: SupplierService[] = [
	{ id: "1", name: "Badrumsrenovering", isPopular: true },
	{ id: "2", name: "Köksrenovering", isPopular: false },
	{ id: "3", name: "Målning", isPopular: false },
	{ id: "4", name: "Elinstallation", isPopular: false },
	{ id: "5", name: "VVS", isPopular: false },
	{ id: "6", name: "Golvläggning", isPopular: false },
];

export const supplierDetailTabTriggerClass =
	"relative flex-none rounded-none border-0 bg-transparent px-6 py-3 text-sm shadow-none " +
	"font-medium text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-2 border-transparent -mb-px after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-[#1E293B] data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-2 data-[state=active]:!border-[#1E293B]";
