import type { ForfragnRow, InbjudnaRow, SupplierQuoteData } from "../types/forfragan";

export const MOCK_FORFRAGNNINGAR: ForfragnRow[] = [
	{ id: "k301-001", kalkylNr: "K301-001", datum: "2025-09-01", forfragan: "Kök", status: "pagar" },
	{ id: "k301-002", kalkylNr: "K301-002", datum: "2025-09-15", forfragan: "Fönster", status: "ej-paborjad" },
	{ id: "k301-003", kalkylNr: "K301-003", datum: "2025-09-15", forfragan: "Golv", status: "ej-paborjad" },
	{ id: "k301-004", kalkylNr: "K301-004", datum: "2029-09-25", forfragan: "El-arbete", status: "pagar" },
	{ id: "k301-005", kalkylNr: "K301-005", datum: "2025-09-01", forfragan: "Målning", status: "pagar" },
	{ id: "k301-006", kalkylNr: "K301-006", datum: "2025-09-01", forfragan: "Rör", status: "pagar" },
];

export const MOCK_INBJUDNA: InbjudnaRow[] = [
	{ id: "beijer", datum: "2025-09-01", company: "Beijer", amount: 158000, status: "received-price" },
	{ id: "byggmax", datum: "2025-09-15", company: "ByggMax", amount: 0, status: "ongoing" },
	{ id: "fredells", datum: "2025-09-15", company: "Fredells", amount: 0, status: "ongoing" },
	{ id: "marbodal", datum: "2029-09-25", company: "Marbodal", amount: 205000, status: "received-price" },
];

export const MOCK_SUPPLIER_QUOTE: SupplierQuoteData = {
	id: "beijer",
	company: "Beijer Bygg",
	mail: "contact@example.test",
	telefon: "0802418835",
	address: "info",
	postNr: "171 03",
	kontaktSumma: "Sche",
	kontaktNamn: "Kalle Andersson",
	kontaktMail: "contact@example.test",
	kontaktMobil: "070-593 83 31",
	offertPris: 258000,
	isFardig: true,
	kommentarer: "",
	documents: [
		{ id: "d1", datum: "2024-05-10", namn: "offert.pdf", typ: "Offert", fileType: "pdf" },
		{ id: "d2", datum: "2024-05-10", namn: "offert.pdf", typ: "Offert", fileType: "pdf" },
		{ id: "d3", datum: "2024-05-10", namn: "offert.pdf", typ: "Offert", fileType: "pdf" },
	],
};
