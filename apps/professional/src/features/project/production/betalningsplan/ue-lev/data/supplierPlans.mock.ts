import { mockDate } from "../../../../constants/mockData";
import type { SupplierPaymentPlan, SupplierPlanDocument, SupplierPlanStatus } from "../types";

const TERMS = {
	contractSum: 5_000_000,
	retentionPerAcontoPercent: 10,
	retentionTotalPercent: 5,
	retentionFixedAmount: 0,
};

/** The frame's three plan documents, all reviewed on a plan already approved. */
function documents(prefix: string, reviewed: boolean): SupplierPlanDocument[] {
	return ["Betalningsplan huvudbyggnad, etapp 1", "Etapp 2", "Etapp 3"].map((name, index) => ({
		id: `${prefix}-doc-${index + 1}`,
		planNumber: index + 1,
		name,
		fileName: "Kontrakt.pdf",
		reviewed,
	}));
}

/** A plan from the list frame with a short, representative set of rows. */
function plan(
	projectId: string,
	id: string,
	companyName: string,
	totalAmount: number,
	status: SupplierPlanStatus,
): SupplierPaymentPlan {
	const approved = status === "approved";
	return {
		id,
		projectId,
		companyName,
		totalAmount,
		status,
		createdBy: "Anders Svensson",
		createdDate: mockDate(-30),
		revisedDate: mockDate(-25),
		approvedDate: approved ? mockDate(-20) : undefined,
		terms: TERMS,
		acontos: [
			{ id: `${id}-a1`, date: mockDate(-15), activity: "Aconto 1", lift: "Grund", amount: 100_000, retained: 10_000, economy: "paid", paidDate: mockDate(-10) },
			{ id: `${id}-a2`, date: mockDate(15), activity: "Aconto 2", lift: "Stomme", amount: 200_000, retained: 20_000, economy: "not_due" },
			{ id: `${id}-a3`, date: mockDate(45), activity: "Aconto 3", lift: "Installation", amount: 200_000, retained: 20_000, economy: "not_applicable" },
		],
		documents: documents(id, approved),
	};
}

/**
 * Subcontractor and supplier payment plans on each project.
 *
 * 5001 carries the list frame's six companies with their totals and statuses.
 * Rörmokare — under review, its documents not yet ticked — carries the detail
 * frame's rows, so the approval flow can be walked end to end. The frame names
 * two rows "Aconto 2"; the third is Aconto 3 here. Dates come from `mockDate`.
 */
export const SEEDED_SUPPLIER_PLANS: SupplierPaymentPlan[] = [
	plan("5001", "5001-ue-1", "Pelle Målare", 158_680, "approved"),
	plan("5001", "5001-ue-2", "Rörmokare", 145_630, "under_review"),
	plan("5001", "5001-ue-3", "Elektriker", 56_250, "not_ready"),
	plan("5001", "5001-ue-4", "Städare", 25_690, "approved"),
	plan("5001", "5001-ue-5", "Köksleverantör", 158_680, "approved"),
	plan("5001", "5001-ue-6", "Sotare", 158_680, "approved"),
	plan("5000", "5000-ue-1", "Pelles Måleri", 320_000, "under_review"),
];
