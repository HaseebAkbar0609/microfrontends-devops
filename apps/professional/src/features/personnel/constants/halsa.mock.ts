import { FriskvardData, RehabData } from "../types/halsa.types";

export const INITIAL_FRISKVARDS_DATA: FriskvardData = {
	isEligible: true,
	allowanceAmount: 5000,
	period: "month",
	providers: ["SATS", "Massage", "Gym"],
};

export const INITIAL_REHAB_DATA: RehabData = {
	center: "Mental Health Oasis",
	areaForImprovement: "Substance Abuse",
	startDate: "2024-03-01",
	estimatedReturnDate: "2024-05-01",
	capacityReturnWork: "50%",
	followUpFrequency: "Varje vecka",
	nextFollowUpDate: "2024-03-23",
	documents: [
		{
			id: "rehab_doc_1",
			date: "2024-03-15",
			name: "Rehab-Avtal",
			fileFormat: "pdf",
			fileSize: "1.2 MB",
		},
		{
			id: "rehab_doc_2",
			date: "2024-03-12",
			name: "C1",
			fileFormat: "pdf",
			fileSize: "840 KB",
		},
	],
};
