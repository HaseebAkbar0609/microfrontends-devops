export type QABadgeType = "ue" | "bestellare" | "fraga";
export type QAStatus = "new" | "opened" | "answered";

export interface QAReply {
	id: string;
	authorName: string;
	authorInitials: string;
	timestamp: string;
	text: string;
}

export interface QACard {
	id: string;
	authorName: string;
	authorInitials: string;
	company: string;
	badge: QABadgeType;
	timestamp: string;
	text: string;
	status: QAStatus;
	replies: QAReply[];
}
