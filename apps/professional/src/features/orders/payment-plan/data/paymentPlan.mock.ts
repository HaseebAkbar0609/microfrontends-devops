import type {
	BestallarePaymentPlan,
	UeLevPaymentPlan,
	PaymentPlanDetail,
} from "../types/paymentPlan.types";

export const MOCK_BESTALLARE_PLANS: BestallarePaymentPlan[] = [
	{
		id: "1",
		planNumber: 1,
		name: "Betalningsplan huvudbyggnad, etapp 1",
		fileName: "Kontrakt.pdf",
		fileType: "pdf",
		fileSize: "1.2 MB",
		status: "not_invoiced",
		createdAt: "2025-09-01",
		totalAmount: 5000000,
	},
	{
		id: "2",
		planNumber: 2,
		name: "Etapp 2",
		fileName: "Kontrakt.pdf",
		fileType: "pdf",
		fileSize: "1.2 MB",
		status: "not_invoiced",
		createdAt: "2025-09-15",
		totalAmount: 2500000,
	},
	{
		id: "3",
		planNumber: 3,
		name: "Etapp 3",
		fileName: "Kontrakt.pdf",
		fileType: "pdf",
		fileSize: "1.2 MB",
		status: "not_invoiced",
		createdAt: "2025-10-01",
		totalAmount: 1800000,
	},
];

export const MOCK_UE_LEV_PLANS: UeLevPaymentPlan[] = [
	{
		id: "ue-1",
		companyName: "Pelle Målare",
		totalAmount: 158680,
		status: "approved",
		role: "Målare",
		contactPerson: "Pelle Nilsson",
		email: "pelle@malare.se",
		phone: "070-123 45 67",
	},
	{
		id: "ue-2",
		companyName: "Rörmokare",
		totalAmount: 145630,
		status: "under_review",
		role: "VVS",
		contactPerson: "Erik Andersson",
		email: "erik@rormokare.se",
		phone: "070-234 56 78",
	},
	{
		id: "ue-3",
		companyName: "Elektriker",
		totalAmount: 56250,
		status: "not_ready",
		role: "El",
		contactPerson: "Johan Karlsson",
		email: "johan@el.se",
		phone: "070-345 67 89",
	},
	{
		id: "ue-4",
		companyName: "Städare",
		totalAmount: 25690,
		status: "approved",
		role: "Städ",
		contactPerson: "Maria Lind",
		email: "maria@stad.se",
		phone: "070-456 78 90",
	},
	{
		id: "ue-5",
		companyName: "Köksleverantör",
		totalAmount: 158680,
		status: "approved",
		role: "Kök",
		contactPerson: "Lars Berg",
		email: "lars@kok.se",
		phone: "070-567 89 01",
	},
	{
		id: "ue-6",
		companyName: "Sotare",
		totalAmount: 158680,
		status: "approved",
		role: "Sotning",
		contactPerson: "Karin Holm",
		email: "karin@sotare.se",
		phone: "070-678 90 12",
	},
];

export const MOCK_PAYMENT_PLAN_DETAIL: PaymentPlanDetail = {
	id: "1",
	orderId: "5000-001",
	planNumber: 1,
	title: "Betalningsplan huvudbyggnad, etapp 1",
	projectInfo: {
		projectNr: "5000",
		project: "Ombyggnad Villa",
		kvartersNamn: "Vskatan",
		bestallare: "Fastighetsbolaget",
		kontraktSumma: 5000000,
		startDatum: "2026-05-01",
		slutDatum: "2026-08-01",
	},
	summary: {
		kontraktsumma: 5000000,
		skapadAv: "Anders Swensson",
		datum: "2025-09-01",
		reviderad: "2025-09-01",
		innehallnaMedelPerAcontoPercent: 10,
		totaltInnehalletAvKontraktsummaPercent: 5,
		belopp: 0,
		beloppInnehalletTotalt: 250000,
	},
	milestones: [
		{
			id: "m-1",
			date: "2025-12-09",
			activity: "Aconto 1",
			lyft: "Grund",
			belopp: 500000,
			innehallet: -50000,
			attErhalla: 450000,
			percentage: 10,
			status: "invoiced",
		},
		{
			id: "m-2",
			date: "2025-12-09",
			activity: "Aconto 2",
			lyft: "Stomme",
			belopp: 1000000,
			innehallet: -100000,
			attErhalla: 900000,
			percentage: 20,
			status: "not_invoiced",
		},
		{
			id: "m-3",
			date: "2025-12-09",
			activity: "Aconto 2",
			lyft: "Installationer",
			belopp: 500000,
			innehallet: -50000,
			attErhalla: 450000,
			percentage: 10,
			status: "not_invoiced",
		},
	],
	documents: [
		{
			id: "d-1",
			date: "2025-09-01",
			type: "Byggmöte",
			fileName: "filename.pdf",
			fileType: "pdf",
		},
		{
			id: "d-2",
			date: "2025-09-01",
			type: "Byggmöte",
			fileName: "filename.pdf",
			fileType: "pdf",
		},
		{
			id: "d-3",
			date: "2025-09-01",
			type: "Byggmöte",
			fileName: "filename.pdf",
			fileType: "pdf",
		},
	],
	status: "draft",
};

/**
 * Returns mock payment plan detail matching the given order and plan IDs
 */
export function getPaymentPlanMockByOrderId(
	orderId = "5000-001",
	planId = "1"
): PaymentPlanDetail {
	const matchedPlan = MOCK_BESTALLARE_PLANS.find((p) => p.id === planId);
	return {
		...MOCK_PAYMENT_PLAN_DETAIL,
		id: planId,
		orderId,
		planNumber: matchedPlan ? matchedPlan.planNumber : 1,
		title: matchedPlan ? matchedPlan.name : MOCK_PAYMENT_PLAN_DETAIL.title,
	};
}
