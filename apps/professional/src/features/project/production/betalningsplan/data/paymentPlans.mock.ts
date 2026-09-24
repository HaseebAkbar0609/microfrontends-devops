import localizationConstants from "@/utils/translation/constants";
import { mockDate } from "../../../constants/mockData";
import type { PaymentPlanDocument, ProjectPaymentPlan } from "../types";

const FRAME_TERMS = {
	contractSum: 5_000_000,
	retentionPerAcontoPercent: 10,
	retentionTotalPercent: 5,
	retentionFixedAmount: 0,
};

function documents(prefix: string): PaymentPlanDocument[] {
	return [1, 2].map((n) => ({
		id: `${prefix}-doc-${n}`,
		date: mockDate(-30),
		typeKey: localizationConstants.lblByggmote,
		fileName: `Betalningsplan-underlag-${n}.pdf`,
	}));
}

/**
 * Payment plans on each project.
 *
 * 5001 carries the frame's three plans, and its first — "Betalningsplan
 * huvudbyggnad, etapp 1" — the frame's detail: a 5 000 000 kr contract
 * retaining 10 % per aconto up to 5 % of the contract, with Aconto 1 invoiced
 * and paid and two more waiting. The frame names two rows "Aconto 2"; the third
 * is Aconto 3 here.
 *
 * Dates come from `mockDate`, never `new Date()`.
 */
export const SEEDED_PAYMENT_PLANS: ProjectPaymentPlan[] = [
	{
		id: "5001-plan-1",
		projectId: "5001",
		planNumber: 1,
		name: "Betalningsplan huvudbyggnad, etapp 1",
		contractFileName: "Kontrakt.pdf",
		createdBy: "Anders Svensson",
		createdDate: mockDate(-40),
		revisedDate: mockDate(-40),
		status: "draft",
		terms: FRAME_TERMS,
		acontos: [
			{
				id: "5001-plan-1-a1",
				date: mockDate(-20),
				activity: "Aconto 1",
				lift: "Grund",
				amount: 500_000,
				retained: 50_000,
				invoicedDate: mockDate(-18),
				paid: true,
			},
			{
				id: "5001-plan-1-a2",
				date: mockDate(10),
				activity: "Aconto 2",
				lift: "Stomme",
				amount: 1_000_000,
				retained: 100_000,
				paid: false,
			},
			{
				id: "5001-plan-1-a3",
				date: mockDate(40),
				activity: "Aconto 3",
				lift: "Installation",
				amount: 500_000,
				retained: 50_000,
				paid: false,
			},
		],
		documents: documents("5001-plan-1"),
	},
	{
		id: "5001-plan-2",
		projectId: "5001",
		planNumber: 2,
		name: "Etapp 2",
		contractFileName: "Kontrakt.pdf",
		createdBy: "Anders Svensson",
		createdDate: mockDate(-10),
		revisedDate: mockDate(-5),
		status: "sent",
		terms: { ...FRAME_TERMS, contractSum: 2_000_000 },
		acontos: [
			{
				id: "5001-plan-2-a1",
				date: mockDate(-8),
				activity: "Aconto 1",
				lift: "Grund",
				amount: 400_000,
				retained: 40_000,
				invoicedDate: mockDate(-6),
				paid: false,
			},
		],
		documents: [],
	},
	{
		id: "5001-plan-3",
		projectId: "5001",
		planNumber: 3,
		name: "Etapp 3",
		contractFileName: "Kontrakt.pdf",
		createdBy: "Anders Svensson",
		createdDate: mockDate(-2),
		revisedDate: mockDate(-2),
		status: "draft",
		terms: { ...FRAME_TERMS, contractSum: 1_500_000 },
		acontos: [],
		documents: [],
	},
	{
		id: "5000-plan-1",
		projectId: "5000",
		planNumber: 1,
		name: "Betalningsplan ombyggnad villa",
		contractFileName: "Kontrakt.pdf",
		createdBy: "Anders Svensson",
		createdDate: mockDate(-60),
		revisedDate: mockDate(-30),
		status: "sent",
		terms: { ...FRAME_TERMS, contractSum: 800_000 },
		acontos: [],
		documents: [],
	},
];
