export type WageTypeStatus = "active" | "inactive";

export type WageTypePersonalType =
	| "tjansteman"
	| "arbetare"
	| "deltid"
	| "vikarie"
	| "projektanstalld";

export type WageTypeWageForm = "timlon" | "fastlon";

export type WageTypeTransactionType =
	| "bruttolon"
	| "oblon"
	| "sjuklon"
	| "overtid"
	| "semester"
	| "nettolon";

export type WageTypeUnit = "manad" | "tim" | "dag" | "belopp" | "percent";

export interface WageTypeItem {
	id: string;
	loneartId: string;
	benamning: string;
	personalTyp: WageTypePersonalType;
	enhet: WageTypeUnit;
	loneform: WageTypeWageForm;
	transaktionstyp: WageTypeTransactionType;
	preliminarskatt: string;
	arbetsgivaravgift: string;
	skapad: string;
	andrad: string;
	konto: string;
	kontoKredit?: string;
	motKontoAG?: string;
	agUnderlag?: boolean;
	semestergrundad?: boolean;
	agiKod?: string;
	beskrivning?: string;
	status: WageTypeStatus;
}

export interface WageTypeFormData {
	loneartId: string;
	benamning: string;
	personalTyp: WageTypePersonalType;
	loneform: WageTypeWageForm;
	transaktionstyp: WageTypeTransactionType;
	enhet: WageTypeUnit;
	preliminarskatt: string;
	arbetsgivaravgift: string;
	kontoDebet: string;
	kontoKredit: string;
	motKontoAG: string;
	agUnderlag: boolean;
	semestergrundad: boolean;
	agiKod: string;
	beskrivning: string;
	status: WageTypeStatus;
}

export type WageTypeFormErrors = Partial<Record<keyof WageTypeFormData, string>>;

export interface WageTypeFilterState {
	searchQuery: string;
	statusFilter: "all" | WageTypeStatus;
	personalTypeFilter: "all" | WageTypePersonalType;
	wageFormFilter: "all" | WageTypeWageForm;
	transactionTypeFilter: "all" | WageTypeTransactionType;
}
