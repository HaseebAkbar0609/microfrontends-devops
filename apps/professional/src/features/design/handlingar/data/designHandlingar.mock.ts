import type {
	HandlingArkiverad,
	HandlingDokument,
	HandlingFoto,
	HandlingRitning,
} from "../types/designHandlingar";

export const MOCK_RITNINGAR: HandlingRitning[] = [
	{ id: "r1", datum: "2025-03-01", ritningsNr: "A-305-20", kategori: "A-ritning", skapadAv: "Kalle Svensson" },
	{ id: "r2", datum: "2025-03-05", ritningsNr: "A-306-20", kategori: "Konstruktion", skapadAv: "Stefan Eriksson" },
	{ id: "r3", datum: "2025-03-10", ritningsNr: "K-106-20", kategori: "K-ritning", skapadAv: "Stefan Eriksson" },
	{ id: "r4", datum: "2025-03-15", ritningsNr: "VS-101-20", kategori: "VVS-ritning", skapadAv: "Stefan Eriksson" },
];

export const MOCK_DOKUMENT: HandlingDokument[] = [
	{ id: "d1", datum: "2025-03-01", dokumentNamn: "Byggbeskrivning", kategori: "Bygghandling", skapadAv: "Kalle Svensson" },
	{ id: "d2", datum: "2025-03-05", dokumentNamn: "AF-del", kategori: "Bygghandling", skapadAv: "Stefan Eriksson" },
	{ id: "d3", datum: "2025-03-10", dokumentNamn: "VVS-Beskrivning", kategori: "VVS-handling", skapadAv: "Stefan Eriksson" },
	{ id: "d4", datum: "2025-03-15", dokumentNamn: "El-Beskrivning", kategori: "El-handling", skapadAv: "Stefan Eriksson" },
];

export const MOCK_FOTO: HandlingFoto[] = [
	{ id: "f1", datum: "2025-04-01", fotoNr: "001", benamning: "Kök", skapadAv: "Kalle Svensson" },
	{ id: "f2", datum: "2025-04-03", fotoNr: "002", benamning: "Mark", skapadAv: "Stefan Eriksson" },
	{ id: "f3", datum: "2025-04-05", fotoNr: "003", benamning: "Badrum", skapadAv: "" },
	{ id: "f4", datum: "2025-04-08", fotoNr: "004", benamning: "Isolering", skapadAv: "Stefan Eriksson" },
];

export const MOCK_ARKIVERADE: HandlingArkiverad[] = [
	{ id: "a1", datum: "2025-01-15", type: "A502-10", benamning: "A-ritning", skapadAv: "Kalle Svensson" },
	{ id: "a2", datum: "2025-01-20", type: "A502-10", benamning: "Mark", skapadAv: "Stefan Eriksson" },
	{ id: "a3", datum: "2025-02-01", type: "Byggbeskrivning", benamning: "AF-cel", skapadAv: "" },
	{ id: "a4", datum: "2025-02-10", type: "VS010-1", benamning: "VVS-ritning", skapadAv: "Stefan Eriksson" },
];
