export interface AgreementDetailContact {
	id: string;
	fornamn: string;
	efternamn: string;
	mail: string;
	mobil: string;
	roll: string;
}

export interface AgreementDetailDocument {
	id: string;
	datum: string;
	namn: string;
	fil: string;
	type: "pdf" | "doc";
	url?: string;
}

export interface AgreementDetail {
	id: string;
	avdelning: string;
	avtalsTyp: string;
	ansvarig: string;
	motpart: string;
	startdatum: string;
	slutdatum: string;
	aktionDatum: string;
	paminnelseDatum: string;
	paminnelseText?: string;
	avtalsPrioritet: string;
	meddelande: string;
	status?: string;
	contacts: AgreementDetailContact[];
	documents: AgreementDetailDocument[];
}
