import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";

export interface EmploymentContract {
	employeeName: string;
	role: string;
	employmentNumber: string;
	personNumber: string;
	startDate: string;
	address: string;
	postalCode: string;
	city: string;
	mobile: string;
	email: string;
	downloadUrl: string;
	documentPages: { id: string; text: string }[];
}

const CONTRACT_PAGE_TEXT =
	"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy. Fusce aliquet pede non pede. Suspendisse dapibus lorem pellentesque magna. Integer nulla. Donec blandit feugiat ligula. Donec hendrerit, felis et imperdiet euismod, purus ipsum pretium metus, in lacinia nulla nisl eget sapien.\n\nDonec ut est in lectus consequat consequat. Etiam eget dui. Aliquam erat volutpat. Sed at lorem in nunc porta tristique. Proin nec augue. Quisque aliquam tempor magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc ac magna. Maecenas odio dolor, vulputate vel, auctor ac, accumsan id, felis. Pellentesque cursus sagittis felis. Pellentesque porttitor, velit lacinia egestas auctor, diam eros tempus arcu, nec vulputate augue magna vel risus. Cras non magna vel ante adipiscing rhoncus. Vivamus a mi. Morbi neque. Aliquam erat volutpat. Integer ultrices lobortis eros.\n\nIn in nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Donec ullamcorper fringilla eros. Fusce in sapien eu purus dapibus commodo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras faucibus condimentum odio. Sed ac ligula. Aliquam at eros. Etiam at ligula et tellus ullamcorper ultrices. In fermentum, lorem non cursus porttitor, diam urna accumsan lacus, sed interdum wisi nibh nec nisl.\n\nQuisque ornare placerat risus. Ut molestie magna at mi. Integer aliquet mauris et nibh. Ut mattis ligula posuere velit. Nunc sagittis. Curabitur varius fringilla nisl. Duis pretium mi euismod erat. Maecenas id augue. Nam vulputate. Duis a quam non neque lobortis malesuada. Praesent euismod. Donec nulla augue, venenatis scelerisque, dapibus a, consequat at, leo.";

export const EMPLOYMENT_CONTRACT: EmploymentContract = {
	employeeName: "Anna Andersson",
	role: "Snickare",
	employmentNumber: "00001",
	personNumber: "000000-0000",
	startDate: mockDate(-611),
	address: "Mysgränd 14, 113 45 STOCKHOLM",
	postalCode: "-",
	city: "Järfälla",
	mobile: "-",
	email: "Ann@example.com",
	downloadUrl: "/mock/anstallningsavtal-00001.pdf",
	documentPages: [
		{ id: "page-1", text: CONTRACT_PAGE_TEXT },
		{ id: "page-2", text: CONTRACT_PAGE_TEXT },
	],
};

export const EMPLOYMENT_TAB_IDS = [
	"contract",
	"sickReport",
	"leave",
	"payslip",
	"documents",
] as const;

export type EmploymentTabId = (typeof EMPLOYMENT_TAB_IDS)[number];

export const EMPLOYMENT_TABS: { id: EmploymentTabId; label: string }[] = [
	{ id: "contract", label: localizationConstants.myPagesEmpTabContract },
	{ id: "sickReport", label: localizationConstants.myPagesEmpTabSickReport },
	{ id: "leave", label: localizationConstants.myPagesEmpTabLeave },
	{ id: "payslip", label: localizationConstants.myPagesEmpTabPayslip },
	{ id: "documents", label: localizationConstants.myPagesEmpTabDocuments },
];

export type ScheduleEventKind = "sick" | "vab" | "leave";

export interface ScheduleEvent {
	id: string;
	day: number;
	startHour: number;
	durationHours: number;
	labelKey: string;
	kind: ScheduleEventKind;
}

export const SCHEDULE_DAYS = [
	{ day: 11, label: "Mån, Februari" },
	{ day: 12, label: "Tis, Februari" },
	{ day: 13, label: "Ons, Februari" },
	{ day: 14, label: "Tors, Februari" },
	{ day: 15, label: "Fre, Februari" },
	{ day: 16, label: "Lör, Februari" },
	{ day: 17, label: "Sön, Februari" },
];

export const SCHEDULE_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export const SICK_SCHEDULE_EVENTS: ScheduleEvent[] = [
	{
		id: "sick-14",
		day: 14,
		startHour: 9,
		durationHours: 1,
		labelKey: localizationConstants.myPagesEmpTypeSick,
		kind: "sick",
	},
	{
		id: "vab-15",
		day: 15,
		startHour: 9,
		durationHours: 2,
		labelKey: localizationConstants.myPagesEmpTypeVab,
		kind: "vab",
	},
	{
		id: "sick-12",
		day: 12,
		startHour: 13,
		durationHours: 1,
		labelKey: localizationConstants.myPagesEmpTypeSick,
		kind: "vab",
	},
];

export const LEAVE_SCHEDULE_EVENTS: ScheduleEvent[] = [
	{
		id: "leave-14",
		day: 14,
		startHour: 9,
		durationHours: 1,
		labelKey: "",
		kind: "leave",
	},
	{
		id: "leave-15",
		day: 15,
		startHour: 9,
		durationHours: 1,
		labelKey: "",
		kind: "leave",
	},
	{
		id: "leave-16",
		day: 16,
		startHour: 9,
		durationHours: 1,
		labelKey: "",
		kind: "leave",
	},
	{
		id: "leave-12",
		day: 12,
		startHour: 13,
		durationHours: 1,
		labelKey: "",
		kind: "leave",
	},
];

export interface SickInfoEntry {
	id: string;
	labelKey: string;
	lines: string[];
}

export const SICK_INFORMATION: SickInfoEntry[] = [
	{
		id: "company-doctor",
		labelKey: localizationConstants.myPagesEmpCompanyDoctor,
		lines: ["Läkarmottagning Bli Frisk", "Storgatan 10 , 171 63 Solna"],
	},
	{
		id: "phone",
		labelKey: localizationConstants.myPagesEmpPhone,
		lines: ["08-560 60 60"],
	},
	{
		id: "mail",
		labelKey: localizationConstants.myPagesEmpMail,
		lines: ["info@lakare.se"],
	},
	{
		id: "emergency-dentist",
		labelKey: localizationConstants.myPagesEmpEmergencyDentist,
		lines: ["Lag tanden AB", "Mysgränd 14, 113 45 STOCKHOLM"],
	},
];

export type LeaveStatus = "review" | "approved" | "rejected";

export interface LeaveRequest {
	id: string;
	listDate: string;
	requestedPeriod: string;
	status: LeaveStatus;
	comment: string;
}

export const LEAVE_STATUS_KEY: Record<LeaveStatus, string> = {
	review: localizationConstants.myPagesEmpStatusReview,
	approved: localizationConstants.myPagesEmpStatusApproved,
	rejected: localizationConstants.myPagesEmpStatusRejected,
};

export const LEAVE_REQUESTS: LeaveRequest[] = [
	{
		id: "lr-1",
		listDate: "2025/10/01",
		requestedPeriod: "2025/11/15 - 2025/11/25",
		status: "review",
		comment: "-",
	},
	{
		id: "lr-2",
		listDate: "2025/01/01",
		requestedPeriod: "2025/11/15 - 2025/11/25",
		status: "approved",
		comment: "-",
	},
	{
		id: "lr-3",
		listDate: "2024/05/01",
		requestedPeriod: "2025/11/15 - 2025/11/25",
		status: "approved",
		comment: "-",
	},
	{
		id: "lr-4",
		listDate: "2024/07/31",
		requestedPeriod: "2025/11/15 - 2025/11/25",
		status: "rejected",
		comment: "-",
	},
	{
		id: "lr-5",
		listDate: "2024/10/15",
		requestedPeriod: "2025/11/15 - 2025/11/25",
		status: "review",
		comment: "-",
	},
];

export interface Payslip {
	id: string;
	monthKey: string;
	fileName: string;
}

export const PAYSLIP_EMPLOYEE_NAME = "Pelle Andersson";
export const PAYSLIP_YEARS = ["2025", "2024", "2023"];

export const PAYSLIPS: Payslip[] = [
	{
		id: "ps-01",
		monthKey: localizationConstants.monthJanuary,
		fileName: "Lönespecifikation Januari",
	},
	{
		id: "ps-02",
		monthKey: localizationConstants.monthFebruary,
		fileName: "Lönespecifikation Februari",
	},
	{
		id: "ps-03",
		monthKey: localizationConstants.monthMarch,
		fileName: "Lönespecifikation Mars",
	},
	{
		id: "ps-04",
		monthKey: localizationConstants.monthApril,
		fileName: "Lönespecifikation April",
	},
	{
		id: "ps-05",
		monthKey: localizationConstants.monthMay,
		fileName: "Lönespecifikation Maj",
	},
	{
		id: "ps-06",
		monthKey: localizationConstants.monthJune,
		fileName: "Lönespecifikation Juni",
	},
];

export type DocumentStatus = "read" | "needsSign" | "notOpened" | "signed";

export interface PersonalDocument {
	id: string;
	name: string;
	version: string;
	fileName: string;
	status: DocumentStatus;
}

export const DOCUMENT_STATUS_KEY: Record<DocumentStatus, string> = {
	read: localizationConstants.myPagesEmpDocRead,
	needsSign: localizationConstants.myPagesEmpDocNeedsSign,
	notOpened: localizationConstants.myPagesEmpDocNotOpened,
	signed: localizationConstants.myPagesEmpDocSigned,
};

export const PERSONAL_DOCUMENTS: PersonalDocument[] = [
	{
		id: "doc-1",
		name: "Policy",
		version: "2025-006",
		fileName: "Filename",
		status: "read",
	},
	{
		id: "doc-2",
		name: "Personal handboken",
		version: "2025-001",
		fileName: "Filename",
		status: "needsSign",
	},
	{
		id: "doc-3",
		name: "Regler",
		version: "2025-008",
		fileName: "Filename",
		status: "notOpened",
	},
	{
		id: "doc-4",
		name: "Regler",
		version: "2025-009",
		fileName: "Filename",
		status: "signed",
	},
];
