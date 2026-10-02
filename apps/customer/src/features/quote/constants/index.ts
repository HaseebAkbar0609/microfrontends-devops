import { BreadcrumbItem } from "@/types/user";
import {
	ChatCompany,
	ProjectDocument,
	Quote,
	QuoteItem,
	QuoteStatus,
	ReferenceProject,
} from "../types/types";
import localizationConstants from "@/utils/translation/constants";

export const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.business, href: "/business" },
	{ label: localizationConstants.getQuote },
];

/** Tabs for project / offer detail page */
export const PROJECT_DETAIL_TABS = [
	{ value: "overview", label: localizationConstants.overviewTab },
	{ value: "quote-list", label: localizationConstants.quoteListTab },
	{ value: "documents", label: localizationConstants.documentsTab },
	{ value: "chat", label: localizationConstants.chatMeetingsTab },
] as const;

export type ProjectDetailTabValue =
	(typeof PROJECT_DETAIL_TABS)[number]["value"];

export const PROJECT_DETAIL_TAB_VALUES = PROJECT_DETAIL_TABS.map(
	(t) => t.value,
) as readonly ProjectDetailTabValue[];

export const PROJECT_DETAIL_DEFAULT_TAB = PROJECT_DETAIL_TABS[0].value;

/** API `status` query values for project list filter (label = localized, value = backend enum) */
export const PROJECT_STATUS_FILTER_OPTIONS = [
	{
		label: localizationConstants.statusNotReviewed,
		value: "not_reviewd",
	},
	{ label: localizationConstants.statusOpened, value: "opened" },
	{ label: localizationConstants.statusAccepted, value: "accepted" },
	{
		label: localizationConstants.statusWaitingForQuote,
		value: "waiting_for_quote",
	},
	{ label: localizationConstants.statusApproved, value: "approved" },
	{
		label: localizationConstants.statusUnderReview,
		value: "under_review",
	},
	{
		label: localizationConstants.statusReceivedQuote,
		value: "recieved_quote",
	},
	{ label: localizationConstants.statusRejected, value: "rejected" },
] as const;

/** Map API `quote_status` value → translation key (same labels as the status filter) */
export const PROJECT_STATUS_VALUE_TO_LABEL_KEY: Record<string, string> =
	{
		...Object.fromEntries(
			PROJECT_STATUS_FILTER_OPTIONS.map((o) => [o.value, o.label]),
		),
		draft: localizationConstants.statusDraft,
	};

export const QUOTE_COLUMNS = [
	{ label: localizationConstants.refNo, field: "refNo" },
	{ label: localizationConstants.projectName, field: "projectName" },
	{ label: localizationConstants.type, field: "type" },
	{ label: localizationConstants.category, field: "category" },
	{ label: localizationConstants.receivedQuotes, field: "receivedQuotes" },
	{ label: localizationConstants.lowestPrice, field: "lowestPrice" },
	{ label: localizationConstants.highestPrice, field: "highestPrice" },
	{ label: localizationConstants.status, field: "quote_status" },
	{ label: localizationConstants.actions, field: "actions" },
] as const;

export const DUMMY_QUOTES: QuoteItem[] = [
	{
		id: "1",
		isStarred: true,
		company: "Pelle Construction",
		contact: "Peter Svensson",
		orgNo: "982 234 2341",
		price: "46,000 SEK",
		status: "Approved",
	},
	{
		id: "2",
		isStarred: false,
		company: "Nisse Construction",
		contact: "Nisse Olsson",
		orgNo: "982 234 2341",
		price: "57,000 SEK",
		status: "Received Quote",
	},
	{
		id: "3",
		isStarred: true,
		company: "CL Construction",
		contact: "Conny Larson",
		orgNo: "982 234 2341",
		price: "0 SEK",
		status: "Invited",
	},
	{
		id: "4",
		isStarred: false,
		company: "Nisse Construction",
		contact: "Peter Svensson",
		orgNo: "982 234 2341",
		price: "26,000 SEK",
		status: "Estimated",
	},
	{
		id: "5",
		isStarred: true,
		company: "Garage",
		contact: "Nisse Olsson",
		orgNo: "982 234 2341",
		price: "70,000 SEK",
		status: "Waiting for Quote",
	},
	{
		id: "6",
		isStarred: false,
		company: "Backyard",
		contact: "Conny Larson",
		orgNo: "982 234 2341",
		price: "0 SEK",
		status: "Waiting for Quote",
	},
	{
		id: "7",
		isStarred: false,
		company: "Backyard",
		contact: "Conny Larson",
		orgNo: "982 234 2341",
		price: "0 SEK",
		status: "Waiting for Quote",
	},
	{
		id: "8",
		isStarred: false,
		company: "Backyard",
		contact: "Conny Larson",
		orgNo: "982 234 2341",
		price: "0 SEK",
		status: "Waiting for Quote",
	},
];

export const DUMMY_DATA: Quote[] = [
	{
		id: "1",
		refNo: "0101",
		projectName: "Bathroom",
		type: "B2C",
		category: "Painter",
		receivedQuotes: "3/5",
		lowestPrice: "46,000 SEK",
		highestPrice: "56,000 SEK",
		quote_status: "recieved_quote",
	},
	{
		id: "2",
		refNo: "002",
		projectName: "Kitchen",
		type: "B2C",
		category: "Country",
		receivedQuotes: "1/5",
		lowestPrice: "57,000 SEK",
		highestPrice: "57,000 SEK",
		quote_status: "opened",
	},
	{
		id: "3",
		refNo: "003",
		projectName: "Bathroom",
		type: "Express",
		category: "Carpenter",
		receivedQuotes: "0/8",
		lowestPrice: "0 SEK",
		highestPrice: "0 SEK",
		quote_status: "waiting_for_quote",
	},
];

export const getStatusVariant = (status: QuoteStatus) => {
	switch (status) {
		case "Approved":
		case "Received Quote":
			return "success";
		case "Invited":
		case "Estimated":
			return "info";
		case "Waiting for Quote":
			return "warning";
		case "Rejected":
			return "destructive";
		default:
			return "outline";
	}
};

export const DUMMY_DOCUMENTS: ProjectDocument[] = [
	{
		id: "1",
		date: "2024-05-10",
		name: "Job Description",
		comments: "I uploaded the wrong document",
		fileType: "PDF",
	},
	{
		id: "2",
		date: "2024-05-10",
		name: "Policy",
		comments: "This is the updated document",
		fileType: "PDF",
	},
	{
		id: "3",
		date: "2024-05-10",
		name: "Policy",
		comments: "I uploaded the wrong document",
		fileType: "PDF",
	},
];

export const COMPANIES: ChatCompany[] = [
	{
		id: "1",
		name: "Pelle Bygg",
		time: "10:24",
		status: "Received Quote",
		statusVariant: "success",
		message: "We can come for a site visit on Thursda",
		hasCalendar: true,
		unread: 2,
	},
	{
		id: "2",
		name: "Målarfirman Solen AB",
		time: "Yesterday",
		status: "Pending",
		statusVariant: "warning",
		message: "Thank you for your inquiry, we will get back",
		hasCalendar: false,
		unread: 1,
	},
	{
		id: "3",
		name: "Bygg & Fix Stockholm",
		time: "2 days ago",
		status: "Estimated",
		statusVariant: "info",
		message: "Here is our price estimate...",
		hasCalendar: false,
		unread: 0,
	},
	{
		id: "4",
		name: "KakelProffsen",
		time: "3 days ago",
		status: "Received Quote",
		statusVariant: "success",
		message: "Material and timeline attached",
		hasCalendar: false,
		unread: 0,
	},
	{
		id: "5",
		name: "Snickare Stockholm AB",
		time: "1 week ago",
		status: "Under review",
		statusVariant: "secondary",
		message: "When is a good time for a site visit?",
		hasCalendar: false,
		unread: 0,
	},
];

/** Tabs for supplier quote detail (URL ?tab=…) */
export const SUPPLIER_QUOTE_DETAIL_TABS = [
	"quote",
	"company-info",
	"reference",
	"discussions",
] as const;

export const SUPPLIER_QUOTE_DETAIL_DEFAULT_TAB = SUPPLIER_QUOTE_DETAIL_TABS[0];

export const detailTabTriggerClass =
	"relative flex-none rounded-none border-0 bg-transparent px-0 py-2.5 text-sm shadow-none " +
	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-2 border-transparent -mb-px after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-2 data-[state=active]:!border-slate-900";

export const COMPANY_DESCRIPTION =
	"Målarfirman Solen AB is a professional painting company based in Solna with over 15 years of experience in both interior and exterior painting. We specialize in high-quality bathroom repairs and renovations.";

export const DUMMY_CERTIFICATES = [
	{
		id: "1",
		date: "2023-01-15",
		name: "Safe Water Certificate",
		text: "Authorized for water installations",
	},
	{
		id: "2",
		date: "2022-05-20",
		name: "BKR Certificate",
		text: "Quality assurance for wet rooms",
	},
	{
		id: "3",
		date: "2021-11-30",
		name: "ISO 9001",
		text: "Quality management system",
	},
];

export const DUMMY_PERSONNEL = [
	{
		id: "1",
		name: "Anders Johansson",
		position: "Site Manager",
		certifications: "Safety, Wet Room Expert",
	},
	{
		id: "2",
		name: "Maria Svensson",
		position: "Master Painter",
		certifications: "BKR, Safe Water",
	},
	{
		id: "3",
		name: "Kalle Karlsson",
		position: "Apprentice",
		certifications: "Basic Safety",
	},
];

export const DUMMY_REVIEWS = [
	{
		id: "1",
		name: "Anna Berg",
		review: "Very professional and timely. The bathroom looks amazing!",
		rating: 5,
		date: "2023-11-20",
		imageUrl: "/assets/images/profile1.png",
	},
	{
		id: "2",
		name: "Erik Nilsson",
		review: "Great result, but a bit more expensive than others.",
		rating: 4,
		date: "2023-10-05",
		imageUrl: "/assets/images/profile2.png",
	},
	{
		id: "3",
		name: "Sofie Lind",
		review: "Fantastic communication throughout the project.",
		rating: 5,
		date: "2023-08-15",
		imageUrl: "/assets/images/profile3.png",
	},
];

export const DUMMY_INSURANCE = [
	{
		id: "1",
		projectName: "Bathroom Renovation",
		contactPerson: "Peter Hansson",
		municipality: "Solna",
		date: "2024-01-10",
		phone: "070-123 45 67",
	},
	{
		id: "2",
		projectName: "Kitchen Painting",
		contactPerson: "Sara Ek",
		municipality: "Stockholm",
		date: "2023-12-15",
		phone: "070-987 65 43",
	},
];

export const DUMMY_REFERENCE_PROJECTS: ReferenceProject[] = [
	{
		id: "1",
		name: "Luxury Villa",
		municipality: "Bromma",
		year: "2023",
		images: [
			"/assets/images/bathroom_repair_intro.png",
			"/assets/images/bathroom_repair_intro.png",
		],
	},
	{
		id: "2",
		name: "Apartment complex",
		municipality: "Solna",
		year: "2022",
		images: ["/assets/images/bathroom_repair_intro.png"],
	},
];

export const DUMMY_QUOTE_ITEMS = [
	{
		id: "1",
		no: "1",
		description: "Painting walls and ceiling",
		amount: "15,000 SEK",
	},
	{
		id: "2",
		no: "2",
		description: "Tiling bathroom floors",
		amount: "45,000 SEK",
	},
	{
		id: "3",
		no: "3",
		description: "Plumbing installations",
		amount: "30,000 SEK",
	},
];

export const projectDetailTabTriggerClass =
	"relative flex-none rounded-none border-0 bg-transparent px-0 py-2.5 text-sm shadow-none " +
	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-2 border-transparent -mb-px after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-2 data-[state=active]:!border-slate-900";

export function isValidProjectDetailTab(
	value: string | null,
): value is (typeof PROJECT_DETAIL_TABS)[number]["value"] {
	if (!value) return false;
	return PROJECT_DETAIL_TABS.some((t) => t.value === value);
}
