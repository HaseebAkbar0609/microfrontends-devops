export type HalsaSubView = "friskvard" | "rehab";

export interface FriskvardData {
	isEligible: boolean;
	allowanceAmount: number;
	period: "month" | "year";
	providers: string[];
}

export interface RehabDocumentItem {
	id: string;
	date: string;
	name: string;
	fileFormat: string;
	fileSize?: string;
	url?: string;
}

export interface RehabData {
	center: string;
	areaForImprovement: string;
	startDate: string;
	estimatedReturnDate: string;
	capacityReturnWork: string;
	followUpFrequency: string;
	nextFollowUpDate: string;
	documents: RehabDocumentItem[];
}
