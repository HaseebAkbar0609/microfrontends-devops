export type PaymentPlanStatus =
	| "not_invoiced"
	| "invoiced"
	| "paid"
	| "overdue";

export type UeLevStatus =
	| "approved"
	| "under_review"
	| "not_ready"
	| "invoiced"
	| "paid";

export interface BestallarePaymentPlan {
	id: string;
	planNumber: number;
	name: string;
	fileName: string;
	fileType: "pdf" | "doc";
	fileSize?: string;
	status: PaymentPlanStatus;
	createdAt?: string;
	totalAmount?: number;
}

export interface UeLevPaymentPlan {
	id: string;
	companyName: string;
	totalAmount: number;
	status: UeLevStatus;
	role?: string;
	contactPerson?: string;
	email?: string;
	phone?: string;
	date?: string;
}

export interface PaymentMilestone {
	id: string;
	date: string;
	activity: string;
	lyft: string;
	belopp: number;
	innehallet: number;
	attErhalla: number;
	percentage?: number;
	status?: PaymentPlanStatus;
}

export interface PaymentPlanDocument {
	id: string;
	date: string;
	type: string;
	fileName: string;
	fileType: "pdf" | "doc" | "image";
	fileUrl?: string;
}

export interface PaymentPlanProjectInfo {
	projectNr: string;
	project: string;
	kvartersNamn: string;
	bestallare: string;
	kontraktSumma: number;
	startDatum: string;
	slutDatum: string;
}

export interface PaymentPlanSummaryMeta {
	kontraktsumma: number;
	skapadAv: string;
	datum: string;
	reviderad: string;
	innehallnaMedelPerAcontoPercent: number;
	totaltInnehalletAvKontraktsummaPercent: number;
	belopp: number;
	beloppInnehalletTotalt: number;
}

export interface PaymentPlanDetail {
	id: string;
	orderId: string;
	planNumber: number;
	title: string;
	projectInfo: PaymentPlanProjectInfo;
	summary: PaymentPlanSummaryMeta;
	milestones: PaymentMilestone[];
	documents: PaymentPlanDocument[];
	status: "draft" | "sent" | "approved";
}
