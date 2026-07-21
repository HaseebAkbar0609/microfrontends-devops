import localizationConstants from "@/utils/translation/constants";
import type {
	ActiveProject,
	ArchivedProject,
	ProjectDocument,
	PersonalDocument,
	MeetingMinute,
	ProjectQuestion,
	TimelineEvent,
	OrgMember,
} from "../types";

export const ACTIVE_PROJECT_MAIN_TABS = [
	{ value: "project", label: localizationConstants.projectTabProject },
	{ value: "contract", label: localizationConstants.projectTabContract },
	{ value: "finance", label: localizationConstants.projectTabFinance },
	{
		value: "quality",
		label: localizationConstants.projectTabQualityManagement,
	},
] as const;

export type ActiveProjectMainTabValue =
	(typeof ACTIVE_PROJECT_MAIN_TABS)[number]["value"];

export const ACTIVE_PROJECT_MAIN_TAB_VALUES = ACTIVE_PROJECT_MAIN_TABS.map(
	(t) => t.value,
) as readonly ActiveProjectMainTabValue[];

export const ACTIVE_PROJECT_DEFAULT_TAB = ACTIVE_PROJECT_MAIN_TABS[0].value;

export const ACTIVE_PROJECT_SUB_TABS = [
	{
		value: "personal-info",
		label: localizationConstants.projectSubTabPersonalInfo,
	},
	{
		value: "documents",
		label: localizationConstants.projectSubTabDocuments,
	},
	{
		value: "meeting-minutes",
		label: localizationConstants.projectSubTabMeetingMinutes,
	},
	{ value: "qa", label: localizationConstants.projectSubTabQA },
	{
		value: "timeline",
		label: localizationConstants.projectSubTabTimeline,
	},
	{
		value: "org-plan",
		label: localizationConstants.projectSubTabOrgPlan,
	},
] as const;

export type ActiveProjectSubTabValue =
	(typeof ACTIVE_PROJECT_SUB_TABS)[number]["value"];

export const ACTIVE_PROJECT_SUB_TAB_VALUES = ACTIVE_PROJECT_SUB_TABS.map(
	(t) => t.value,
) as readonly ActiveProjectSubTabValue[];

export const ACTIVE_PROJECT_DEFAULT_SUB_TAB = ACTIVE_PROJECT_SUB_TABS[0].value;

export const DUMMY_PROJECTS: ActiveProject[] = [];

export const DUMMY_PERSONAL_DOCUMENTS: PersonalDocument[] = [
	{ id: "1", name: "Bathroom Renovation", type: "Architecture Drawing" },
];

export const DUMMY_PROJECT_DOCUMENTS: ProjectDocument[] = [
	{
		id: "1",
		name: "Arbetsbeskrivning",
		specification: "Construction Drawing",
		type: "PDF",
		date: "2024-05-10",
		fileUrl: "#",
	},
	{
		id: "2",
		name: "Policy",
		specification: "Color Scheme",
		type: "PDF",
		date: "2024-05-10",
		fileUrl: "#",
	},
	{
		id: "3",
		name: "Material List",
		specification: "Specification",
		type: "XLSX",
		date: "2024-05-12",
		fileUrl: "#",
	},
];

export const DUMMY_MEETING_MINUTES: MeetingMinute[] = [
	{
		id: "1",
		title: "Meeting with IT Team",
		date: "2024-11-12",
		rating: "good",
		description:
			"Initial meeting to align on project scope and timeline. All parties present.",
	},
	{
		id: "2",
		title: "Mouse not working, need replacement",
		date: "2024-10-06",
		rating: "bad",
		description:
			"Inspection revealed quality issues. Contractor tasked with corrections.",
	},
	{
		id: "3",
		title: "Screen poor quality, needs review",
		date: "2024-10-06",
		rating: "moderate",
		description:
			"Reviewed progress. Minor delays due to material delivery. New schedule agreed upon.",
	},
];

export const DUMMY_PROJECT_QUESTIONS: ProjectQuestion[] = [
	{
		id: "1",
		question: "When will the tiles be delivered?",
		answer: "Tiles are scheduled for delivery on March 15th.",
		date: "2024-03-08",
		isAnswered: true,
	},
	{
		id: "2",
		question: "Can we change the shower position?",
		answer: undefined,
		date: "2024-03-12",
		isAnswered: false,
	},
	{
		id: "3",
		question: "What warranty is provided on the fixtures?",
		answer: "All fixtures come with a 5-year manufacturer warranty.",
		date: "2024-03-20",
		isAnswered: true,
	},
];

export const DUMMY_TIMELINE_EVENTS: TimelineEvent[] = [
	{
		id: "1",
		title: "Project Start",
		date: "2024-03-01",
		description: "Project officially started. Site preparation begins.",
		isCompleted: true,
	},
	{
		id: "2",
		title: "Demolition Complete",
		date: "2024-03-15",
		description: "Old bathroom fixtures and tiles removed.",
		isCompleted: true,
	},
	{
		id: "3",
		title: "Plumbing Rough-In",
		date: "2024-04-01",
		description: "New plumbing connections installed.",
		isCompleted: true,
	},
	{
		id: "4",
		title: "Tiling",
		date: "2024-04-20",
		description: "Wall and floor tiles being installed.",
		isCompleted: false,
	},
	{
		id: "5",
		title: "Fixture Installation",
		date: "2024-05-15",
		description: "Shower, toilet, and vanity installation.",
		isCompleted: false,
	},
	{
		id: "6",
		title: "Project Completion",
		date: "2024-06-30",
		description: "Final inspection and handover.",
		isCompleted: false,
	},
];

export const DUMMY_ORG_MEMBERS: OrgMember[] = [
	{
		id: "1",
		company: "Bygg & Co AB",
		category: "Construction",
		role: "Main Contractor",
		contactPerson: "Lars Pettersson",
		phone: "08-123 456 78",
		mail: "lars@byggco.se",
	},
	{
		id: "2",
		company: "VVS Expert AB",
		category: "Plumbing",
		role: "Subcontractor",
		contactPerson: "Karin Lindberg",
		phone: "08-987 654 32",
		mail: "karin@vvsexpert.se",
	},
	{
		id: "3",
		company: "El-Proffs AB",
		category: "Electrical",
		role: "Subcontractor",
		contactPerson: "Johan Holm",
		phone: "070-111 22 33",
		mail: "johan@elproffs.se",
	},
];

export const ACTIVE_PROJECT_COLUMNS = [
	{
		label: localizationConstants.refNo,
		field: "referenceNo",
		sortable: true,
	},
	{ label: localizationConstants.projectName, field: "name", sortable: true },
	{
		label: localizationConstants.projectOrderNoCol,
		field: "orderNo",
		sortable: true,
	},
	{
		label: localizationConstants.projectQuoteRefNoCol,
		field: "quoteReferenceNo",
		sortable: true,
	},
	{
		label: localizationConstants.projectSupplierCol,
		field: "companyName",
		sortable: true,
	},
	{ label: localizationConstants.status, field: "status", sortable: true },
	{ label: localizationConstants.actions, field: "actions", sortable: false },
] as const;

export const ACTIVE_PROJECT_STATUS_FILTER_OPTIONS: {
	label: string;
	value: ActiveProject["status"];
}[] = [
		{
			label: localizationConstants.projectStatusReceivedQuote,
			value: "received-quote",
		},
		{
			label: localizationConstants.projectStatusCompleted,
			value: "completed",
		},
		{ label: localizationConstants.projectStatusDraft, value: "draft" },
		{ label: localizationConstants.projectStatusActive, value: "active" },
		{ label: localizationConstants.projectStatusOnHold, value: "on-hold" },
	];

export const ACTIVE_PROJECT_STATUS_LABEL_KEY: Record<
	ActiveProject["status"],
	string
> = {
	"received-quote": localizationConstants.projectStatusReceivedQuote,
	completed: localizationConstants.projectStatusCompleted,
	draft: localizationConstants.projectStatusDraft,
	active: localizationConstants.projectStatusActive,
	"on-hold": localizationConstants.projectStatusOnHold,
	"under-review": "Under Review",
};

export const ACTIVE_PROJECT_STATUS_VARIANT: Record<
	ActiveProject["status"],
	"success" | "info" | "warning"
> = {
	"received-quote": "info",
	completed: "success",
	draft: "info",
	active: "success",
	"on-hold": "warning",
	"under-review": "info",
};

export const ARCHIVED_PROJECT_COLUMNS = [
	{
		label: localizationConstants.refNo,
		field: "referenceNo",
		sortable: true,
	},
	{ label: localizationConstants.projectName, field: "name", sortable: true },
	{
		label: localizationConstants.projectOrderNoCol,
		field: "orderNo",
		sortable: true,
	},
	{
		label: localizationConstants.projectQuoteRefNoCol,
		field: "quoteReferenceNo",
		sortable: true,
	},
	{
		label: localizationConstants.projectSupplierCol,
		field: "companyName",
		sortable: true,
	},
	{ label: localizationConstants.status, field: "status", sortable: true },
	{ label: localizationConstants.actions, field: "actions", sortable: false },
] as const;

export const DUMMY_ARCHIVED_PROJECTS: ArchivedProject[] = [
	{
		id: "a1",
		name: "Attic Renovation",
		referenceNo: "O088",
		orderNo: "2023-11",
		quoteReferenceNo: "1498201",
		clientNo: "CL-10011",
		projectNo: "PRJ-2023-011",
		startDate: "2023-08-01",
		endDate: "2023-12-15",
		contactPersonName: "Erik Lund",
		mobileNumber: "070-234 56 78",
		email: "erik@example.com",
		address: "Björkvägen 4",
		postalCode: "168 52",
		companyName: "Takproffsen AB",
		status: "archived",
		statusLabel: "Archived",
		archivedDate: "2024-01-10",
		category: "Renovation",
	},
	{
		id: "a2",
		name: "Garden Landscaping",
		referenceNo: "O072",
		orderNo: "2023-07",
		quoteReferenceNo: "1461402",
		clientNo: "CL-10008",
		projectNo: "PRJ-2023-008",
		startDate: "2023-05-10",
		endDate: "2023-09-30",
		contactPersonName: "Sara Nyberg",
		mobileNumber: "070-345 67 89",
		email: "sara@example.com",
		address: "Rosengatan 12",
		postalCode: "141 32",
		companyName: "Grönt & Skönt AB",
		status: "archived",
		statusLabel: "Archived",
		archivedDate: "2023-10-12",
		category: "Garden",
	},
	{
		id: "a3",
		name: "Garage Build",
		referenceNo: "O065",
		orderNo: "2023-05",
		quoteReferenceNo: "1450903",
		clientNo: "CL-10005",
		projectNo: "PRJ-2023-005",
		startDate: "2023-03-01",
		endDate: "2023-08-20",
		contactPersonName: "Mikael Berg",
		mobileNumber: "070-456 78 90",
		email: "mikael@example.com",
		address: "Ekstigen 7",
		postalCode: "125 71",
		companyName: "Karles bygg AB",
		status: "archived",
		statusLabel: "Archived",
		archivedDate: "2023-09-01",
		category: "Garage",
	},
	{
		id: "a4",
		name: "Facade Painting",
		referenceNo: "O054",
		orderNo: "2023-02",
		quoteReferenceNo: "1442504",
		clientNo: "CL-10002",
		projectNo: "PRJ-2023-002",
		startDate: "2023-01-15",
		endDate: "2023-04-30",
		contactPersonName: "Lina Ek",
		mobileNumber: "070-567 89 01",
		email: "lina@example.com",
		address: "Storgatan 22",
		postalCode: "111 29",
		companyName: "Målarfirman Solen AB",
		status: "archived",
		statusLabel: "Archived",
		archivedDate: "2023-05-15",
		category: "Painting",
	},
];
