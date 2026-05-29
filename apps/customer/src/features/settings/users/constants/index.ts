import { BreadcrumbItem } from "@/types/user";
import type { User, UserPermissions } from "../types/types";

import localizationConstants from "@/utils/translation/constants";

/* export const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.settings },
	{ label: localizationConstants.users },
]; */
export const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.settings, href: "/settings" },
	{ label: localizationConstants.users, href: "/settings/users" },
];

export const USERS_COLUMNS = [
	{ label: localizationConstants.displayName, field: "first_name" },
	{ label: localizationConstants.dateCreated, field: "date_created" },
	{ label: localizationConstants.accountType, field: "account_type" },
	{ label: localizationConstants.lastLogin, field: "last_login" },
	{ label: localizationConstants.status, field: "status" },
	{ label: localizationConstants.actions, field: "actions" },
] as const;

export const USER_PERMISSION_OPTIONS = [
	{ key: "viewProjects", label: "View projects" },
	{ key: "createProjects", label: "Create projects" },
	{ key: "editProjects", label: "Edit projects" },
	{ key: "viewOffers", label: "View offers" },
	{ key: "approveOffers", label: "Approve offers" },
	{ key: "manageUsers", label: "Manage users" },
] as const;

export const DEFAULT_USER_PERMISSIONS: UserPermissions = {
	viewProjects: true,
	createProjects: false,
	editProjects: false,
	viewOffers: true,
	approveOffers: false,
	manageUsers: false,
};

const ADMIN_PERMISSIONS: UserPermissions = {
	viewProjects: true,
	createProjects: true,
	editProjects: true,
	viewOffers: true,
	approveOffers: true,
	manageUsers: true,
};

export const DUMMY_USERS: User[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    mobile_number: "+12025550143",
    private_email: "john.doe@example.com",
    address: "742 Evergreen Terrace",
    city: "Springfield",
    postal_code: "97477",
    personal_number: "19900101-1234",
    date_created: "2025-01-15",
    account_type: "users",
    last_login: "2026-05-24T14:22:15Z",
    status: "active",
    permissions: ADMIN_PERMISSIONS,
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    mobile_number: "+14155552671",
    private_email: "jane.smith@example.com",
    address: "221B Baker Street",
    city: "London",
    postal_code: "NW1 6XE",
    personal_number: "19880518-5678",
    date_created: "2025-03-22",
    account_type: "users",
    last_login: "2026-05-25T01:10:00Z",
    status: "active",
    permissions: DEFAULT_USER_PERMISSIONS,
  },
  {
    id: "3",
    first_name: "Michael",
    last_name: "Brown",
    mobile_number: "+13125550189",
    private_email: "michael.b@example.com",
    address: "1600 Amphitheatre Parkway",
    city: "Mountain View",
    postal_code: "94043",
    personal_number: "19791102-2468",
    date_created: "2025-06-05",
    account_type: "users",
    last_login: "2026-05-20T09:34:11Z",
    status: "active",
    permissions: DEFAULT_USER_PERMISSIONS,
  },
  {
    id: "4",
    first_name: "Emily",
    last_name: "Davis",
    mobile_number: "+12125550198",
    private_email: "emily.davis@example.com",
    address: "350 Fifth Avenue",
    city: "New York",
    postal_code: "10118",
    personal_number: "19951224-1357",
    date_created: "2025-09-12",
    account_type: "users",
    last_login: "2026-04-15T23:11:45Z",
    status: "deactivated",
    permissions: DEFAULT_USER_PERMISSIONS,
  },
  {
    id: "5",
    first_name: "David",
    last_name: "Wilson",
    mobile_number: "+12065550122",
    private_email: "david.w@example.com",
    address: "410 Terry Ave N",
    city: "Seattle",
    postal_code: "98109",
    personal_number: "19830214-9753",
    date_created: "2025-12-01",
    account_type: "users",
    last_login: "2026-05-23T18:05:22Z",
    status: "deactivated",
    permissions: DEFAULT_USER_PERMISSIONS,
  }
];

// export const COMPANIES: ChatCompany[] = [
// 	{
// 		id: "1",
// 		name: "Pelle Bygg",
// 		time: "10:24",
// 		status: "Received Quote",
// 		statusVariant: "success",
// 		message: "We can come for a site visit on Thursda",
// 		hasCalendar: true,
// 		unread: 2,
// 	},
// 	{
// 		id: "2",
// 		name: "Målarfirman Solen AB",
// 		time: "Yesterday",
// 		status: "Pending",
// 		statusVariant: "warning",
// 		message: "Thank you for your inquiry, we will get back",
// 		hasCalendar: false,
// 		unread: 1,
// 	},
// 	{
// 		id: "3",
// 		name: "Bygg & Fix Stockholm",
// 		time: "2 days ago",
// 		status: "Estimated",
// 		statusVariant: "info",
// 		message: "Here is our price estimate...",
// 		hasCalendar: false,
// 		unread: 0,
// 	},
// 	{
// 		id: "4",
// 		name: "KakelProffsen",
// 		time: "3 days ago",
// 		status: "Received Quote",
// 		statusVariant: "success",
// 		message: "Material and timeline attached",
// 		hasCalendar: false,
// 		unread: 0,
// 	},
// 	{
// 		id: "5",
// 		name: "Snickare Stockholm AB",
// 		time: "1 week ago",
// 		status: "Under review",
// 		statusVariant: "secondary",
// 		message: "When is a good time for a site visit?",
// 		hasCalendar: false,
// 		unread: 0,
// 	},
// ];

// /** Tabs for supplier quote detail (URL ?tab=…) */
// export const SUPPLIER_QUOTE_DETAIL_TABS = [
// 	"quote",
// 	"company-info",
// 	"reference",
// 	"discussions",
// ] as const;

// export const SUPPLIER_QUOTE_DETAIL_DEFAULT_TAB = SUPPLIER_QUOTE_DETAIL_TABS[0];

// export const detailTabTriggerClass =
// 	"relative flex-none rounded-none border-0 bg-transparent px-0 py-2.5 text-sm shadow-none " +
// 	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
// 	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
// 	"border-b-2 border-transparent -mb-px after:hidden " +
// 	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
// 	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
// 	"data-[state=active]:!border-b-2 data-[state=active]:!border-slate-900";

// export const COMPANY_DESCRIPTION =
// 	"Målarfirman Solen AB is a professional painting company based in Solna with over 15 years of experience in both interior and exterior painting. We specialize in high-quality bathroom repairs and renovations.";

// export const DUMMY_CERTIFICATES = [
// 	{
// 		id: "1",
// 		date: "2023-01-15",
// 		name: "Safe Water Certificate",
// 		text: "Authorized for water installations",
// 	},
// 	{
// 		id: "2",
// 		date: "2022-05-20",
// 		name: "BKR Certificate",
// 		text: "Quality assurance for wet rooms",
// 	},
// 	{
// 		id: "3",
// 		date: "2021-11-30",
// 		name: "ISO 9001",
// 		text: "Quality management system",
// 	},
// ];

// export const DUMMY_PERSONNEL = [
// 	{
// 		id: "1",
// 		name: "Anders Johansson",
// 		position: "Site Manager",
// 		certifications: "Safety, Wet Room Expert",
// 	},
// 	{
// 		id: "2",
// 		name: "Maria Svensson",
// 		position: "Master Painter",
// 		certifications: "BKR, Safe Water",
// 	},
// 	{
// 		id: "3",
// 		name: "Kalle Karlsson",
// 		position: "Apprentice",
// 		certifications: "Basic Safety",
// 	},
// ];

// export const DUMMY_REVIEWS = [
// 	{
// 		id: "1",
// 		name: "Anna Berg",
// 		review: "Very professional and timely. The bathroom looks amazing!",
// 		rating: 5,
// 		date: "2023-11-20",
// 		imageUrl: "/assets/images/profile1.png",
// 	},
// 	{
// 		id: "2",
// 		name: "Erik Nilsson",
// 		review: "Great result, but a bit more expensive than others.",
// 		rating: 4,
// 		date: "2023-10-05",
// 		imageUrl: "/assets/images/profile2.png",
// 	},
// 	{
// 		id: "3",
// 		name: "Sofie Lind",
// 		review: "Fantastic communication throughout the project.",
// 		rating: 5,
// 		date: "2023-08-15",
// 		imageUrl: "/assets/images/profile3.png",
// 	},
// ];

// export const DUMMY_INSURANCE = [
// 	{
// 		id: "1",
// 		projectName: "Bathroom Renovation",
// 		contactPerson: "Peter Hansson",
// 		municipality: "Solna",
// 		date: "2024-01-10",
// 		phone: "070-123 45 67",
// 	},
// 	{
// 		id: "2",
// 		projectName: "Kitchen Painting",
// 		contactPerson: "Sara Ek",
// 		municipality: "Stockholm",
// 		date: "2023-12-15",
// 		phone: "070-987 65 43",
// 	},
// ];

// export const DUMMY_REFERENCE_PROJECTS: ReferenceProject[] = [
// 	{
// 		id: "1",
// 		name: "Luxury Villa",
// 		municipality: "Bromma",
// 		year: "2023",
// 		images: [
// 			"/assets/images/bathroom_repair_intro.png",
// 			"/assets/images/bathroom_repair_intro.png",
// 		],
// 	},
// 	{
// 		id: "2",
// 		name: "Apartment complex",
// 		municipality: "Solna",
// 		year: "2022",
// 		images: ["/assets/images/bathroom_repair_intro.png"],
// 	},
// ];

// export const DUMMY_QUOTE_ITEMS = [
// 	{
// 		id: "1",
// 		no: "1",
// 		description: "Painting walls and ceiling",
// 		amount: "15,000 SEK",
// 	},
// 	{
// 		id: "2",
// 		no: "2",
// 		description: "Tiling bathroom floors",
// 		amount: "45,000 SEK",
// 	},
// 	{
// 		id: "3",
// 		no: "3",
// 		description: "Plumbing installations",
// 		amount: "30,000 SEK",
// 	},
// ];

// export const projectDetailTabTriggerClass =
// 	"relative flex-none rounded-none border-0 bg-transparent px-0 py-2.5 text-sm shadow-none " +
// 	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
// 	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
// 	"border-b-2 border-transparent -mb-px after:hidden " +
// 	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
// 	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
// 	"data-[state=active]:!border-b-2 data-[state=active]:!border-slate-900";

// export function isValidProjectDetailTab(
// 	value: string | null,
// ): value is (typeof PROJECT_DETAIL_TABS)[number]["value"] {
// 	if (!value) return false;
// 	return PROJECT_DETAIL_TABS.some((t) => t.value === value);
// }
