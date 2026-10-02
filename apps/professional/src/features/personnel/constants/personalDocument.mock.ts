import { PersonalDocumentsState } from "../types/personalDocument.types";

export const INITIAL_PERSONAL_DOCUMENTS: PersonalDocumentsState = {
	metadata: {
		employeeHandbook: "Personal bok 1",
		policy: "Bil-policy",
		jobDescription: "Projektledare",
	},
	documents: [
		{
			id: "pdoc_1",
			date: "2024-05-10",
			name: "Arbetsbeskrivning",
			fileFormat: "PDF",
			fileSize: "1.2 MB",
		},
		{
			id: "pdoc_2",
			date: "2024-05-10",
			name: "Policy",
			fileFormat: "PDF",
			fileSize: "850 KB",
		},
		{
			id: "pdoc_3",
			date: "2024-05-10",
			name: "Policy",
			fileFormat: "PDF",
			fileSize: "920 KB",
		},
	],
};
