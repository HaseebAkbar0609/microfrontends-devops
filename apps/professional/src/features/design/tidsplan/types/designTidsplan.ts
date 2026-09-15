export interface DesignTidsplanItem {
	id: string;
	datum: string;
	tidsplanType: string;
	typ: string;
	startDatum: string;
	slutDatum: string;
	orderNr: string;
	kund: string;
	skapadAv: string;
	skapadDatum: string;
	revideradDatum: string;
	beskrivning: string;
	title: string;
}

export interface DesignTidsplanFormState {
	tidsplanType: string;
	typ: string;
	startDatum: string;
	slutDatum: string;
	orderNr: string;
	kund: string;
	skapadAv: string;
	skapadDatum: string;
	revideradDatum: string;
	beskrivning: string;
}
