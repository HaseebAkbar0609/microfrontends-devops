import { AgreementDetail } from "../types/agreementDetail";

export const DUMMY_AGREEMENT_DETAIL: AgreementDetail = {
	id: "1",
	avdelning: "IT",
	avtalsTyp: "ITAvtal",
	ansvarig: "Info",
	motpart: "Info",
	startdatum: "2024-01-01",
	slutdatum: "2026-12-31",
	aktionDatum: "2026-03-31",
	paminnelseDatum: "2026-02-01",
	avtalsPrioritet: "Info",
	meddelande:
		"Hyran är på 3 år , vi måste förhandla 9 månader innan kontraktet går ut, skicka skriftligt till hyresvärd",
	contacts: [
		{
			id: "1",
			fornamn: "Lars",
			efternamn: "Svensson",
			mail: "lars.svensson@byg...",
			mobil: "070-6306345",
			roll: "2024/01/01",
		},
		{
			id: "2",
			fornamn: "Lars",
			efternamn: "Svensson",
			mail: "lars.svensson@byg...",
			mobil: "2024/01/01",
			roll: "2024/01/01",
		},
	],
	documents: [
		{
			id: "1",
			datum: "2024-05-10",
			namn: "Dokumentets namn",
			fil: "Kontrakt.pdf",
			type: "pdf",
		},
		{
			id: "2",
			datum: "2024-05-10",
			namn: "Dokumentets namn",
			fil: "Kontrakt.pdf",
			type: "doc",
		},
	],
};
