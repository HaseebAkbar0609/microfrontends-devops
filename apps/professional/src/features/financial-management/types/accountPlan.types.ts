export type AccountStatus = "active" | "inactive";

export type RadioMode = "obligatoriskt" | "tillatet" | "ej_tillatet";

export interface AccountPlanItem {
	id: string;
	kontoNr: string;
	benamning: string;
	momskod: string;
	sru: string;
	automatkont: string;
	ingaendeBalans: string;
	budget: string;
	status: AccountStatus;
	aktivt?: string;
	accountType?: string;
	kostnadsstalleMode?: RadioMode;
	projektMode?: RadioMode;
	foreslaKostnadsstalle?: string;
	foreslaProjekt?: string;
	description?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateAccountFormData {
	kontoNr: string;
	benamning: string;
	ingaendeBalans: string;
	aktivt: string;
	sru: string;
	momskod: string;
	kostnadsstalleMode: RadioMode;
	projektMode: RadioMode;
	foreslaKostnadsstalle: string;
	foreslaProjekt: string;
}

export interface ImportAccountRow {
	id: string;
	sourceKonto: string;
	sourceBenamning: string;
	action: "koppla" | "skapa_nytt" | "ignorera";
	targetKonto: string;
	momskodPercent: string;
	targetBenamning: string;
}

export interface ImportAccountSettings {
	importeraEndastAnvanda: "alla" | "endast_anvanda";
	anvandBenamningFran: "sie_fil" | "befintlig_kontoplan";
	anvandSruFran: "sie_fil" | "befintlig_kontoplan";
}

export interface GetAccountPlanListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetAccountPlanListResponse {
	data: AccountPlanItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
