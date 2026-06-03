export const SUPPLIER_DETAIL_TABS = [
	"overview",
	"projects",
	"services",
	"documents",
	"reviews",
] as const;

export type SupplierDetailTabValue = (typeof SUPPLIER_DETAIL_TABS)[number];

export const SUPPLIER_DETAIL_DEFAULT_TAB = SUPPLIER_DETAIL_TABS[0];

import localizationConstants from "@/utils/translation/constants";

export const SUPPLIER_DETAIL_TAB_LABELS: Record<string, string> = {
	overview: localizationConstants.supplierTabOverview,
	projects: localizationConstants.supplierTabProjects,
	services: localizationConstants.supplierTabServices,
	documents: localizationConstants.supplierTabDocuments,
	reviews: localizationConstants.supplierTabReviews,
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

export interface SupplierReview {
	id: string;
	name: string;
	initials: string;
	date: string;
	timestamp: number;
	rating: number;
	text: string;
	tags: string[];
}

export const DUMMY_REVIEWS: SupplierReview[] = [
	{
		id: "1",
		name: "Anna Svensson",
		initials: "AS",
		date: "2 dagar sedan",
		timestamp: 5,
		rating: 5,
		text: "Mycket professionell och punktlig. Vårt badrum blev precis som vi ville ha det! Teamet var noga med att städa efter sig varje dag och resultatet överträffade våra förväntningar.",
		tags: ["Badrumsrenovering", "Punktlig"],
	},
	{
		id: "2",
		name: "Erik Johansson",
		initials: "EJ",
		date: "1 vecka sedan",
		timestamp: 4,
		rating: 5,
		text: "Fantastiskt arbete med vårt kök. Högt rekommenderad! Bra kommunikation under hela projektet och mycket flexibla när vi ville göra små ändringar.",
		tags: ["Köksrenovering"],
	},
	{
		id: "3",
		name: "Maria Andersson",
		initials: "MA",
		date: "2 veckor sedan",
		timestamp: 3,
		rating: 4,
		text: "Professionellt team som levererade i tid och inom budget. Vi är nöjda med resultatet och kan rekommendera Pelle bygg till andra.",
		tags: ["Renovering", "Bra kommunikation"],
	},
	{
		id: "4",
		name: "Johan Berg",
		initials: "JB",
		date: "3 veckor sedan",
		timestamp: 2,
		rating: 4,
		text: "Snabb offert och tydlig kommunikation. Arbetet utfördes professionellt och med god kvalitet. Glad att vi valde Pelle bygg!",
		tags: ["Målning", "Snabb"],
	},
	{
		id: "5",
		name: "Sofia Lindström",
		initials: "SL",
		date: "1 månad sedan",
		timestamp: 1,
		rating: 5,
		text: "Mycket nöjd med renoveringen av vårt badrum. Teamet var artiga och lyhörda för våra önskemål. Rekommenderar starkt!",
		tags: ["Badrumsrenovering"],
	},
];

export interface StarBreakdown {
	stars: number;
	count: number;
	pct: number;
}

export const DUMMY_STAR_BREAKDOWN: StarBreakdown[] = [
	{ stars: 5, count: 45, pct: 93.75 },
	{ stars: 4, count: 3, pct: 6.25 },
	{ stars: 3, count: 0, pct: 0 },
	{ stars: 2, count: 0, pct: 0 },
	{ stars: 1, count: 0, pct: 0 },
];

export interface PopularTag {
	label: string;
	count: number;
	isPopular: boolean;
}

export const DUMMY_POPULAR_TAGS: PopularTag[] = [
	{ label: "Badrumsrenovering", count: 2, isPopular: true },
	{ label: "Punktlig", count: 1, isPopular: false },
	{ label: "Köksrenovering", count: 1, isPopular: false },
];

export const supplierDetailTabTriggerClass =
	"relative flex-none rounded-none border-0 bg-transparent px-6 py-3 text-sm shadow-none " +
	"font-medium text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-2 border-transparent -mb-px after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-[#1E293B] data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-2 data-[state=active]:!border-[#1E293B]";
