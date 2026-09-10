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
	{ id: "whistleblower", label: localizationConstants.companyTabWhistleblower },
	{ id: "updates", label: localizationConstants.companyTabUpdates },
];

export interface CompanyInfo {
	id: string;
	company_name: string;
	organization_number?: string | null;
	category_info?: { id: string; name: string } | null;
}

export interface CompanyContact {
	id: string;
	title: string;
	name: string;
	department: string;
	city: string;
	mobile: string;
	email: string;
	role: string;
}

export interface OrgNode {
	id: string;
	name: string;
	role: string;
	roleClass: string;
	email: string;
	children?: OrgNode[];
}

export interface CompanyAttachment {
	media_id: string;
	file_name: string;
}

export type CompanyContentKind = "message" | "news" | "update" | "whistleblower";

export interface CompanyContentItem {
	id: string;
	company_id: string;
	kind: CompanyContentKind;
	title: string | null;
	body: string;
	recipient: string | null;
	attachments: CompanyAttachment[];
	metadata: Record<string, unknown>;
	created_at: number;
}

export type MessageFileKind = "video" | "doc" | "pdf" | "sheet" | "text";
export type MessageStatus = "read" | "unread";

export interface CompanyMessage {
	id: string;
	date: string;
	from: string;
	subject: string;
	fileKind: MessageFileKind;
	status: MessageStatus;
	body: string;
	recipientName: string;
	recipientHandle: string;
	files: string[];
	sentTime: string;
	sentDate: string;
}

export interface CompanyNewsItem {
	id: string;
	date: string;
	title: string;
	excerpt: string;
	paragraphs: string[];
}

export interface CompanyUpdate {
	id: string;
	date: string;
	type: string;
	functionArea: string;
}
