export type ForfragnStatus = "pagar" | "ej-paborjad" | "avslutad";

export interface ForfragnKontaktData {
	kontaktperson: string;
	fornamn: string;
	efternamn: string;
	adress: string;
	postNr: string;
	mail: string;
	telefon: string;
	ort: string;
}

export const DEFAULT_KONTAKT: ForfragnKontaktData = {
	kontaktperson: "Anders Svensson",
	fornamn: "",
	efternamn: "",
	adress: "",
	postNr: "",
	mail: "",
	telefon: "",
	ort: "",
};
export type InbjudnaStatus = "received-price" | "ongoing" | "declined";

export interface ForfragnRow {
	id: string;
	kalkylNr: string;
	datum: string;
	forfragan: string;
	status: ForfragnStatus;
}

export interface InbjudnaRow {
	id: string;
	datum: string;
	company: string;
	amount: number;
	status: InbjudnaStatus;
}

export interface SupplierDocument {
	id: string;
	datum: string;
	namn: string;
	typ: string;
	fileType: "pdf" | "doc" | "img";
}

export interface SupplierQuoteData {
	id: string;
	company: string;
	mail: string;
	telefon: string;
	address: string;
	postNr: string;
	kontaktSumma: string;
	kontaktNamn: string;
	kontaktMail: string;
	kontaktMobil: string;
	offertPris: number;
	isFardig: boolean;
	kommentarer: string;
	documents: SupplierDocument[];
}
