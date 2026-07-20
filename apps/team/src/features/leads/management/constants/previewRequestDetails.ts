import type { LeadRequestDetails } from "@/features/leads/types";

export const previewRequestDetails: LeadRequestDetails = {
	projectName: "Badrum",
	isExpress: true,
	orderNumber: "0012",
	category: "Målare",
	projectType: "Kund Offert",
	address: "Stengatan 10",
	city: "Solna",
	postalCode: "171 63",
	directions: "3:e gatan från Ikea-butiken",
	description:
		"Pelle Construction är glada att påbörja denna badrumsrenovering, och förvandla det till en modern oas. Vårt team av skickliga hantverkare kommer att hantera allt från rivning till de sista detaljerna, vilket säkerställer en smidig och stressfri upplevelse. Vi kommer att arbeta nära dig för att välja högkvalitativa material och armaturer som speglar din personliga stil. Projektet inkluderar uppdatering av VVS, el och ventilationssystem för att uppfylla aktuella standarder. Vi är engagerade i att leverera exceptionella resultat som överträffar dina förväntningar, och skapa ett badrum som kommer att älska i många år framöver.",
	documents: [
		{ id: "preview-doc-1", date: "2024-05-10", name: "Arbetsbeskrivning", fileType: "PDF" },
		{ id: "preview-doc-2", date: "2024-05-10", name: "Policy", fileType: "PDF" },
		{ id: "preview-doc-3", date: "2024-05-10", name: "Policy", fileType: "PDF" },
	],
	suppliers: [
		{
			id: "preview-supplier-1",
			companyName: "Pelle Construction",
			orgNumber: "982 234 2341",
			contactName: "Peter Svensson",
			email: "peter@pellebygg.se",
		},
		{
			id: "preview-supplier-2",
			companyName: "Nisse Construction",
			orgNumber: "982 234 2341",
			contactName: "Nisse Olsson",
			email: "nisse@nissebygg.se",
		},
		{
			id: "preview-supplier-3",
			companyName: "CL Construction",
			orgNumber: "982 234 2341",
			contactName: "Conny Larson",
			email: "conny@larson.se",
		},
	],
};
