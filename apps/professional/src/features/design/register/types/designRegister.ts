export interface DesignKontaktData {
	mode: "eigen" | "extern";
	// Kunduppgifter
	kunduppgifterEnabled: boolean;
	foretag: string;
	address: string;
	postNr: string;
	ort: string;
	mail: string;
	telefon: string;
	orgNr: string;
	// Projekterings ansvarig (Eigen regi) / Kontaktperson (Extern kund)
	projektAnsvarigEnabled: boolean;
	kontaktperson: string;
	fornamn: string;
	efternamn: string;
	kontaktMail: string;
	mobil: string;
	roll: string;
	// Extern kund: Beställare + extra Projekterings ansvarig fields
	bestellare: string;
	ansvarigFoetag: string;
	ansvarigKontaktperson: string;
	ansvarigFornamn: string;
	ansvarigEfternamn: string;
	ansvarigMail: string;
	ansvarigMobil: string;
	ansvarigRoll: string;
}

export interface DesignProjektData {
	projekteringNr: string;
	projekteringNamn: string;
	kvarteraNamn: string;
	projekteringAdress: string;
	postNr: string;
	ort: string;
	type: string;
	kategori: string;
	avdelning: string;
	startDatum: string;
	slutDatum: string;
}
