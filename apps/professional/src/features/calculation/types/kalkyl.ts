export type KalkylKontaktData = {
	mode: "eigen" | "extend";
	offert: string;
	// Entreprenör
	kunduppgifter: boolean;
	foretag: string;
	address: string;
	postNr: string;
	ort: string;
	mail: string;
	telefon: string;
	orgNr: string;
	// Kalkylansvarig (eigen mode)
	kontaktperson: string;
	fornamn: string;
	efternamn: string;
	kontaktMail: string;
	mobil: string;
	roll: string;
	// Beställare (extend mode)
	bestellareKunduppgifter: boolean;
	bestellareFoetag: string;
	bestellareAddress: string;
	bestellarePostNr: string;
	bestellareOrt: string;
	bestellareMail: string;
	bestellareTelefon: string;
	bestellareFornamn: string;
	bestellareEfternamn: string;
	bestellareKontaktMail: string;
	bestellareMobil: string;
};

export type KalkylProjektData = {
	projektNr: string;
	projektNamn: string;
	kvartersNamn: string;
	projektAdress: string;
	postNr: string;
	ort: string;
	type: string;
	kategori: string;
	avdelning: string;
	kontraktsumma: string;
	offertNr: string;
	startDatum: string;
	slutDatum: string;
	senatsDatum: string;
};

export type KalkylDocItem = {
	id: string;
	datum: string;
	namn: string;
	typ: string;
	fileType: "pdf" | "doc" | "img";
};

export type MarkupRow = {
	id: string;
	title: string;
	markupPercentage: string;
};

export type LaborRow = {
	id: string;
	item: string;
	description: string;
	quantity: string;
	unit: string;
	aPrice: string;
};

export type APriceRow = {
	id: string;
	artikel: string;
	benaming: string;
	specification: string;
	kategori: string;
	antal: number;
	enhet: string;
	aPrice: number;
};
