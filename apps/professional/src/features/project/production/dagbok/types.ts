/** A diary is written as a draft; once published it is the record and cannot change. */
export type DiaryStatus = "utkast" | "publicerad";

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WeatherCondition = "soligt" | "mulet" | "regn" | "sno" | "blasigt";
export type WorkStatus = "ej_paborjad" | "pagar" | "klar";
export type DeviationType = "ata" | "fel" | "hinder";
export type DeviationStatus = "pagar" | "atgardas" | "klar";

/** The two people the frame's Bekräfta section asks to sign. */
export type DiarySignerRole = "platschef" | "bestallare";

/** The four tables under Detaljerad information. */
export type DiaryRowKind = "workforce" | "works" | "machines" | "deviations";

/** One weather reading; Plats and Datum come from the project and the diary. */
export interface WeatherReading {
	id: string;
	temperature: number;
	unit: TemperatureUnit;
	condition: WeatherCondition;
	description: string;
	otherNote: string;
}

/** Närvarande arbetsstyrka: a trade on site, with its own staff and UE counts. */
export interface WorkforceRow {
	id: string;
	role: string;
	own: number | null;
	ue: number | null;
	hours: number;
	note: string;
}

export interface WorkRow {
	id: string;
	name: string;
	status: WorkStatus;
	note: string;
}

export interface MachineRow {
	id: string;
	name: string;
	quantity: number;
	hours: number;
	note: string;
}

export interface DeviationRow {
	id: string;
	/** Numbered in order within the diary. */
	number: number;
	type: DeviationType;
	status: DeviationStatus;
	note: string;
}

export interface DiarySignature {
	name: string;
	/** `yyyy-MM-dd`. */
	signedDate: string;
	/** The uploaded signature's file name. There is no file store, so the file itself is not kept. */
	fileName?: string;
}

/** Everything a draft can change. */
export interface DiaryContent {
	weather: WeatherReading[];
	workforce: WorkforceRow[];
	works: WorkRow[];
	machines: MachineRow[];
	deviations: DeviationRow[];
	generalNotes: string;
	selfControlNote: string;
}

export interface ProjectDiary extends DiaryContent {
	id: string;
	projectId: string;
	/** `yyyy-MM-dd`; one diary per project per day. */
	date: string;
	status: DiaryStatus;
	signatures: Record<DiarySignerRole, DiarySignature | null>;
	createdBy: string;
	updatedDate: string;
	publishedDate: string | null;
}

/** A row of any of the four tables, as the dialog and the generic card handle it. */
export interface DiaryRowByKind {
	workforce: WorkforceRow;
	works: WorkRow;
	machines: MachineRow;
	deviations: DeviationRow;
}
