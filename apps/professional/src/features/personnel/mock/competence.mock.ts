import { CompetenceItem } from "../types/competence.types";

export const INITIAL_COMPETENCES_MOCK: CompetenceItem[] = [
	{
		id: "comp-001",
		nr: "001",
		name: "Gymnasium utbildning",
		training: "Byggutbildning 3åring",
		certNo: "458933",
		expiryDate: "2026-08-01",
		status: "expire_soon",
		hasFile: true,
		specifications: [
			{
				id: "spec-001",
				date: "2024-05-10",
				name: "Betyg",
				fileType: "pdf",
				fileName: "Betyg.pdf",
			},
			{
				id: "spec-002",
				date: "2024-05-10",
				name: "CV",
				fileType: "pdf",
				fileName: "CV.pdf",
			},
		],
	},
	{
		id: "comp-002",
		nr: "002",
		name: "Heta arbeten",
		training: "Heta arbeten kurs 1",
		certNo: "6689752",
		expiryDate: "2026-08-01",
		status: "active",
		hasFile: true,
		specifications: [
			{
				id: "spec-003",
				date: "2024-06-15",
				name: "Certifikat Heta Arbeten",
				fileType: "pdf",
				fileName: "Certifikat_Heta_Arbeten.pdf",
			},
		],
	},
	{
		id: "comp-003",
		nr: "003",
		name: "Höghöjds kurs",
		training: "Högjöds kurs BAS 1",
		certNo: "—",
		expiryDate: "2026-09-01",
		status: "active",
		hasFile: true,
		specifications: [
			{
				id: "spec-004",
				date: "2024-07-20",
				name: "Intyg Höghöjd",
				fileType: "pdf",
				fileName: "Intyg_Hoghojd.pdf",
			},
		],
	},
	{
		id: "comp-004",
		nr: "004",
		name: "HLR-utbildning",
		training: "HLR-utbildning - Grundkurs",
		certNo: "—",
		expiryDate: "2028-01-01",
		status: "expire_soon",
		hasFile: true,
		specifications: [
			{
				id: "spec-005",
				date: "2024-01-15",
				name: "HLR Kursintyg",
				fileType: "pdf",
				fileName: "HLR_Kursintyg.pdf",
			},
		],
	},
];
