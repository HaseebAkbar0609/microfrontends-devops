import { mockDate } from "@/features/widgetdashboard/utils/mockDates";

export interface CompanyReview {
	id: string;
	reviewer: string;
	rating: number;
	date: string;
	text: string;
	companyName: string;
	reply?: {
		text: string;
		date: string;
	};
}

// Mock reviews are intentionally plain data (not i18n) — the backend will
// provide real customer reviews once its API exists.
const PENDING_TEXT =
	"Tack för ett bra utfört arbete, ni höll verkligen tiden och vi är tacksamma över det utförda.";
const ANSWERED_TEXT = "It was a great pleasure to encounter with professionals";
const REPLY_TEXT = "Vi tackar för uppdraget och önskar er lycka till med köket";

export const REPLY_PLACEHOLDER = REPLY_TEXT;

export const PENDING_REVIEWS: CompanyReview[] = [
	{
		id: "rev-1",
		reviewer: "Astrid",
		rating: 5,
		date: mockDate(-2),
		text: PENDING_TEXT,
		companyName: "Byggbolaget AB",
	},
	{
		id: "rev-2",
		reviewer: "Astrid",
		rating: 5,
		date: mockDate(-2),
		text: PENDING_TEXT,
		companyName: "Byggbolaget AB",
	},
];

export const ANSWERED_REVIEWS: CompanyReview[] = [
	{
		id: "rev-3",
		reviewer: "Jhonas",
		rating: 5,
		date: mockDate(-6),
		text: ANSWERED_TEXT,
		companyName: "Byggbolaget AB",
		reply: { text: REPLY_TEXT, date: mockDate(-5) },
	},
	{
		id: "rev-4",
		reviewer: "Jhonas",
		rating: 4,
		date: mockDate(-6),
		text: ANSWERED_TEXT,
		companyName: "Byggbolaget AB",
		reply: { text: REPLY_TEXT, date: mockDate(-5) },
	},
	{
		id: "rev-5",
		reviewer: "Jhonas",
		rating: 4,
		date: mockDate(-8),
		text: ANSWERED_TEXT,
		companyName: "Byggbolaget AB",
		reply: { text: REPLY_TEXT, date: mockDate(-7) },
	},
	{
		id: "rev-6",
		reviewer: "Jhonas",
		rating: 4,
		date: mockDate(-8),
		text: ANSWERED_TEXT,
		companyName: "Byggbolaget AB",
		reply: { text: REPLY_TEXT, date: mockDate(-7) },
	},
];
