export type KalkylKontaktData = {
	mode: "eigen" | "extend";
	offert: string;
	// Entreprenör Kunduppgifter
	kunduppgifter?: boolean;
	foretag: string;
	address: string;
	postNr: string;
	ort: string;
	mail: string;
	telefon: string;
	orgNr: string;
	// Kalkylansvarig
	kontaktperson: string;
	fornamn: string;
	efternamn: string;
	kontaktMail: string;
	mobil: string;
	roll: string;
	// Beställare Kunduppgifter (extend mode)
	bestellareKunduppgifter?: boolean;
	bestellareForetag: string;
	bestellareAddress: string;
	bestellarePostNr: string;
	bestellareOrt: string;
	bestellareMail: string;
	bestellareTelefon: string;
	bestellareOrgNr: string;
	// Beställare Kontaktperson (extend mode)
	bestellareKontaktperson: string;
	bestellareFornamn: string;
	bestellareEfternamn: string;
	bestellareKontaktAddress: string;
	bestellareKontaktPostnummer: string;
	bestellareKontaktMail: string;
	bestellareTelefonDirect: string;
	bestellareKontaktOrt: string;
	bestellareRoll: string;
};

export type CreateCalculationPayload = {
	mode: "eigen" | "extend";
	offer_id?: string;
	client_name?: string;
	project_name: string;
	project_number?: string;
	block_name?: string;
	project_address?: string;
	postal_code?: string;
	city?: string;
	type?: string;
	category?: string;
	department?: string;
	contract_sum?: number;
	offer_number?: string;
	start_date?: string;
	end_date?: string;
	latest_offer_date?: string;
	contractor: {
		company_name?: string;
		address?: string;
		postal_code?: string;
		city?: string;
		email?: string;
		phone?: string;
		org_number?: string;
		responsible?: {
			contact_person?: string;
			first_name?: string;
			last_name?: string;
			email?: string;
			mobile?: string;
			role?: string;
		};
	};
	client?: {
		company_name?: string;
		address?: string;
		postal_code?: string;
		city?: string;
		email?: string;
		phone?: string;
		org_number?: string;
		contact?: {
			contact_person?: string;
			first_name?: string;
			last_name?: string;
			address?: string;
			postal_code?: string;
			city?: string;
			email?: string;
			phone?: string;
			role?: string;
		};
	};
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
	senasteDatum: string;
};

export type KalkylDocItem = {
	id: string;
	datum: string;
	namn: string;
	typ: string;
	fileType: "pdf" | "doc" | "img";
};

export type KalkylDetailData = {
	calcNo: string;
	bestellareForetag: string;
	bestellareAddress: string;
	bestellarePostNr: string;
	bestellareOrt: string;
	bestellareMail: string;
	bestellareTelefon: string;
	bestellareOrgNr: string;
	kontaktFornamn: string;
	kontaktEfternamn: string;
	kontaktAddress: string;
	kontaktPostnummer: string;
	kontaktMail: string;
	kontaktMobil: string;
	kontaktRoll: string;
	kontaktOrt: string;
	entreprenorForetag: string;
	entreprenorAddress: string;
	entreprenorPostNr: string;
	entreprenorOrt: string;
	entreprenorMail: string;
	entreprenorTelefon: string;
	entreprenorOrgNr: string;
	kalkylFornamn: string;
	kalkylEfternamn: string;
	kalkylMail: string;
	kalkylMobil: string;
	kalkylRoll: string;
	projekteringNr: string;
	projekteringNamn: string;
	kvartersNamn: string;
	projekteringAdress: string;
	postNr: string;
	ort: string;
	type: string;
	kategori: string;
	avdelning: string;
	kontraktsumma: string;
	offertNr: string;
	startDatum: string;
	slutDatum: string;
	senatsDatumOffert: string;
	documents: KalkylDocItem[];
};

export type KalkylTemplate = {
	id: string;
	benamning: string;
	sektion: number;
	mall: string;
	datum: string;
};

export type KalkylSectionRow = {
	id: string;
	artikel: string;
	benamning: string;
	antal: string;
	enhet: string;
	aPris: string;
	paslagPct: string;
};

export type KalkylberakningSection = {
	id: string;
	name: string;
	isOpen: boolean;
	rows: KalkylSectionRow[];
};

export type OverheadRow = {
	id: string;
	artikel: string;
	benamning: string;
	antal: string;
	enhet: string;
	aPris: string;
	paslagPct: string;
	justering: string;
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

export type CostSectionData = {
	id: string;
	titleKey?: string;
	title?: string;
	isOpen?: boolean;
	rows: LaborRow[];
};

export type StandardCalculationData = {
	id?: string;
	calcNo?: string;
	projectName?: string;
	markups: MarkupRow[];
	baseCosts: MarkupRow[];
	laborCosts: LaborRow[];
	sections?: CostSectionData[];
};

export type SkallKravDoc = {
	id: string;
	datum: string;
	typ: string;
	filename: string;
	fileUrl?: string;
	fileSize?: string;
};

