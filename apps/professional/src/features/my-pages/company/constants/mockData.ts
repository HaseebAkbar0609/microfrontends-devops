import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";

export const COMPANY_TAB_IDS = [
	"info",
	"organisation",
	"messages",
	"news",
	"whistleblower",
	"updates",
] as const;

export type CompanyTabId = (typeof COMPANY_TAB_IDS)[number];

export const COMPANY_TABS: { id: CompanyTabId; label: string }[] = [
	{ id: "info", label: localizationConstants.companyTabInfo },
	{ id: "organisation", label: localizationConstants.companyTabOrganisation },
	{ id: "messages", label: localizationConstants.companyTabMessages },
	{ id: "news", label: localizationConstants.companyTabNews },
	{
		id: "whistleblower",
		label: localizationConstants.companyTabWhistleblower,
	},
	{ id: "updates", label: localizationConstants.companyTabUpdates },
];

export interface CompanyInfoField {
	id: string;
	labelKey: string;
	value: string;
}

export const COMPANY_NAME = "Byggbolaget AB";
export const COMPANY_ORG_NR = "556040-5050";

export const COMPANY_INFO_ROWS: CompanyInfoField[][] = [
	[
		{
			id: "name",
			labelKey: localizationConstants.companyInfoName,
			value: "Byggbolaget AB",
		},
		{
			id: "orgNr",
			labelKey: localizationConstants.companyInfoOrgNr,
			value: "556040-5050",
		},
		{
			id: "vatNr",
			labelKey: localizationConstants.companyInfoVatNr,
			value: "SE556060100101",
		},
		{
			id: "insuranceNr",
			labelKey: localizationConstants.companyInfoInsuranceNr,
			value: "5-789057",
		},
		{
			id: "sniCode",
			labelKey: localizationConstants.companyInfoSniCode,
			value: "5-789057",
		},
	],
	[
		{
			id: "postAddress",
			labelKey: localizationConstants.companyInfoPostAddress,
			value: "Stengatan 11",
		},
		{
			id: "postNr1",
			labelKey: localizationConstants.companyInfoPostNr,
			value: "175 10",
		},
		{
			id: "city1",
			labelKey: localizationConstants.companyInfoCity,
			value: "Järfälla",
		},
	],
	[
		{
			id: "visitAddress",
			labelKey: localizationConstants.companyInfoVisitAddress,
			value: "Stengatan",
		},
		{
			id: "postNr2",
			labelKey: localizationConstants.companyInfoPostNr,
			value: "175 10",
		},
		{
			id: "city2",
			labelKey: localizationConstants.companyInfoCity,
			value: "Järfälla",
		},
	],
	[
		{
			id: "deliveryAddress",
			labelKey: localizationConstants.companyInfoDeliveryAddress,
			value: "Stengatan",
		},
		{
			id: "postNr3",
			labelKey: localizationConstants.companyInfoPostNr,
			value: "175 10",
		},
		{
			id: "city3",
			labelKey: localizationConstants.companyInfoCity,
			value: "Järfälla",
		},
	],
	[
		{
			id: "switchboard",
			labelKey: localizationConstants.companyInfoSwitchboard,
			value: "08-15 00 00",
		},
		{
			id: "email",
			labelKey: localizationConstants.companyInfoEmail,
			value: "Ann@example.com",
		},
		{
			id: "website",
			labelKey: localizationConstants.companyInfoWebsite,
			value: "www.byggbolaget.se",
		},
	],
	[
		{
			id: "bank",
			labelKey: localizationConstants.companyInfoBank,
			value: "Nordea",
		},
		{
			id: "bankAccount",
			labelKey: localizationConstants.companyInfoBankAccount,
			value: "08-15 00 00",
		},
		{
			id: "bankgiro",
			labelKey: localizationConstants.companyInfoBankgiro,
			value: "5500-5500",
		},
		{
			id: "postgiro",
			labelKey: localizationConstants.companyInfoPostgiro,
			value: "5-789057",
		},
	],
	[
		{
			id: "iban",
			labelKey: localizationConstants.companyInfoIban,
			value: "SE56 0400 0000 0556 0405 050",
		},
		{
			id: "bic",
			labelKey: localizationConstants.companyInfoBic,
			value: "556040-5050",
		},
		{
			id: "swish",
			labelKey: localizationConstants.companyInfoSwish,
			value: "556040-5050",
		},
	],
];

export interface CompanyContact {
	id: string;
	title: string;
	name: string;
	department: string;
	city: string;
	mobile: string;
	email: string;
}

export const COMPANY_CONTACTS: CompanyContact[] = [
	{
		id: "c-1",
		title: "VD",
		name: "Anders Andersson",
		department: "Overhead",
		city: "Stockholm",
		mobile: "070-520 50 50",
		email: "Ann@example.com",
	},
	{
		id: "c-2",
		title: "Ekonomi",
		name: "Lotta Svensson",
		department: "Service",
		city: "Göteborg",
		mobile: "070-520 50 50",
		email: "lotta@example.com",
	},
	{
		id: "c-3",
		title: "Inköpare",
		name: "Mia  Sjärna",
		department: "Entreprenad",
		city: "Malmö",
		mobile: "070-256 520",
		email: "mia@example.com",
	},
	{
		id: "c-4",
		title: "Arbetschef",
		name: "Pelle Karlsson",
		department: "Service",
		city: "Stockholm",
		mobile: "070-458 90",
		email: "pelle@example.com",
	},
];

export interface OrgNode {
	id: string;
	name: string;
	role: string;
	/** Tailwind classes for the role badge outline. */
	roleClass: string;
	email: string;
	children?: OrgNode[];
}

const ROLE_CLASS = {
	vd: "border-blue-300 text-blue-600",
	economy: "border-green-300 text-green-600",
	work: "border-amber-300 text-amber-600",
	purchase: "border-red-300 text-red-600",
	site: "border-slate-300 text-slate-600",
	carpenter: "border-slate-300 text-slate-600",
} as const;

export const ORG_ROOT: OrgNode = {
	id: "anders",
	name: "Anders Andersson",
	role: "VD",
	roleClass: ROLE_CLASS.vd,
	email: "Ann@example.com",
	children: [
		{
			id: "lotta",
			name: "Lotta Karlsson",
			role: "Ekonomichef",
			roleClass: ROLE_CLASS.economy,
			email: "lotta@example.com",
		},
		{
			id: "pelle",
			name: "Pelle Svensson",
			role: "Arbetschef",
			roleClass: ROLE_CLASS.work,
			email: "Pellesvensson @example.com",
			children: [
				{
					id: "stina",
					name: "Stina Larsson",
					role: "Platschef",
					roleClass: ROLE_CLASS.site,
					email: "Pellesvensson @example.com",
					children: [
						{
							id: "lars",
							name: "Lars Eriksson",
							role: "Snickare",
							roleClass: ROLE_CLASS.carpenter,
							email: "Pellesvensson @example.com",
						},
						{
							id: "anders-j",
							name: "Anders Jönsson",
							role: "Snickare",
							roleClass: ROLE_CLASS.carpenter,
							email: "Pellesvensson @example.com",
						},
						{
							id: "goran",
							name: "Göran Isaksson",
							role: "Snickare",
							roleClass: ROLE_CLASS.carpenter,
							email: "Pellesvensson @example.com",
						},
					],
				},
			],
		},
		{
			id: "mia",
			name: "Mia Stjärna",
			role: "Inköpare",
			roleClass: ROLE_CLASS.purchase,
			email: "mia@example.com",
		},
	],
};

export type MessageFileKind = "video" | "doc" | "pdf" | "sheet" | "text";

export type MessageStatus = "read" | "unread";

export interface CompanyMessage {
	id: string;
	date: string;
	from: string;
	subject: string;
	fileKind: MessageFileKind;
	status: MessageStatus;
	/** Body shown in the View dialog. */
	body: string;
	recipientName: string;
	recipientHandle: string;
	files: string[];
	/** Sent time shown in the View dialog, e.g. "13:20". */
	sentTime: string;
	sentDate: string;
}

const MESSAGE_BODY =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat";

const messageDefaults = {
	body: MESSAGE_BODY,
	recipientName: "Rachel Meyers",
	recipientHandle: "@rachel",
	files: ["Document 1.pdf", "Document 2.pdf"],
	sentTime: "13:20",
	sentDate: mockDate(-214),
};

export const COMPANY_MESSAGES: CompanyMessage[] = [
	{
		id: "m-1",
		date: mockDate(-861),
		from: "Anna",
		subject: "Videography edits...",
		fileKind: "video",
		status: "read",
		...messageDefaults,
	},
	{
		id: "m-2",
		date: mockDate(-861),
		from: "Cyan Anlina",
		subject: "Official Documents Upl...",
		fileKind: "doc",
		status: "read",
		...messageDefaults,
	},
	{
		id: "m-3",
		date: mockDate(-861),
		from: "Marie",
		subject: "Policy agrrement ...",
		fileKind: "pdf",
		status: "read",
		...messageDefaults,
	},
	{
		id: "m-4",
		date: mockDate(-856),
		from: "Jhon David",
		subject: "Meeting With Client...",
		fileKind: "sheet",
		status: "unread",
		...messageDefaults,
	},
	{
		id: "m-5",
		date: mockDate(-861),
		from: "ABC Ltd.",
		subject: "Videography edits...",
		fileKind: "video",
		status: "unread",
		...messageDefaults,
	},
	{
		id: "m-6",
		date: mockDate(-861),
		from: "Hotpack Pte",
		subject: "Document Needed...",
		fileKind: "doc",
		status: "read",
		...messageDefaults,
	},
	{
		id: "m-7",
		date: mockDate(-846),
		from: "Tata LLC",
		subject: "Videography edits...",
		fileKind: "sheet",
		status: "unread",
		...messageDefaults,
	},
	{
		id: "m-8",
		date: mockDate(-851),
		from: "Marie",
		subject: "Personal files...",
		fileKind: "text",
		status: "read",
		...messageDefaults,
	},
];

export interface CompanyNewsItem {
	id: string;
	date: string;
	title: string;
	excerpt: string;
	paragraphs: string[];
}

const NEWS_PARAGRAPH =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat";

const NEWS_TITLE =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum dolor sit amet";

export const COMPANY_NEWS: CompanyNewsItem[] = ["n-1", "n-2", "n-3", "n-4"].map(
	(id) => ({
		id,
		date: mockDate(-225),
		title: NEWS_TITLE,
		excerpt: NEWS_PARAGRAPH,
		paragraphs: [NEWS_PARAGRAPH, NEWS_PARAGRAPH, NEWS_PARAGRAPH],
	}),
);

export interface CompanyUpdate {
	id: string;
	date: string;
	type: string;
	functionArea: string;
}

export const COMPANY_UPDATES: CompanyUpdate[] = [
	{
		id: "u-1",
		date: mockDate(-856),
		type: "Ny mall - kalkyl",
		functionArea: "Kalkyl -modul",
	},
	{
		id: "u-2",
		date: mockDate(-861),
		type: "System update - sandy",
		functionArea: "Mallar",
	},
];
