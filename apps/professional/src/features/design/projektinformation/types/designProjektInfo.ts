export interface DesignKunduppgifterInfo {
	foretag: string;
	address: string;
	postNr: string;
	ort: string;
	mail: string;
	telefon: string;
	orgNr: string;
}

export interface DesignProjektAnsvarigInfo {
	fornamn: string;
	efternamn: string;
	mail: string;
	mobil: string;
	roll: string;
}

export interface DesignProjekteringInfo {
	projekteringNr: string;
	projekteringNamn: string;
	kvarteraNamn: string;
	projekteringAdress: string;
	postNr: string;
	ort: string;
}

export interface DesignProjekteringDetailsInfo {
	typ: string;
	kategori: string;
	avdelning: string;
	startDatum: string;
	slutDatum: string;
}

export interface DesignProjektRecord {
	projektId: string;
	projektNr: string;
	kunduppgifter: DesignKunduppgifterInfo;
	projektAnsvarig: DesignProjektAnsvarigInfo;
	projektering: DesignProjekteringInfo;
	projekteringInfo: DesignProjekteringDetailsInfo;
}

export interface DesignKontaktpersonItem {
	id: string;
	fornamn: string;
	efternamn: string;
	mail: string;
	mobil: string;
	roll: string;
}

export type DesignOrgGroupId =
	| "bestallare"
	| "arkitekt"
	| "byggentreprenor"
	| "elektriker";

export interface DesignOrgMember {
	id: string;
	foretag: string;
	roll: string;
	kategori: string;
	address: string;
	postNr: string;
	ort: string;
	kontakt: string;
	mail: string;
	group: DesignOrgGroupId;
	kontaktpersoner: DesignKontaktpersonItem[];
}

export type DesignInfoSectionKey =
	| "kunduppgifter"
	| "projektAnsvarig"
	| "projektering"
	| "projekteringInfo";
