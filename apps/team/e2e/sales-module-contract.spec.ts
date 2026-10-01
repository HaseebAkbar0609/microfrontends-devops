/**
 * What the Sales module actually does today, and what is still missing.
 *
 * Follows admin-user-contract.spec.ts: the Playwright runner, no browser, no
 * server. These assert the contract between the team app and the Sales API, which
 * is where the gaps live, so they run in a second and cannot flake.
 *
 * The `test.fail` blocks are the remaining work, and they are not decoration.
 * Playwright treats an unexpected pass as a failure, so the moment somebody
 * implements one of these the suite says so and the marker has to come off. A
 * plain skip would rot silently; a red suite would be ignored.
 *
 * Two kinds of gap cannot be detected that way, and are `test.fixme` instead:
 * the logic sits inline in a hook or provider callback, so there is no function
 * a test can call without rendering React. Each says what extraction would make
 * it self-checking.
 *
 * The API module and function names in the "no backend yet" markers are the
 * contract to build against. Choose a different name and update the marker with
 * it; otherwise the gap closes and the marker never notices.
 *
 * Run: pnpm --filter @tfs/team test:e2e -- sales-module-contract
 */
import { expect, test } from "@playwright/test";

import * as salesCrmApi from "../src/features/sales/api/salesCrmApi";
import {
	createEmptyCompany,
	createId,
	createOrder,
	createPendingPayment,
	createQuoteNumber,
} from "../src/features/sales/utils/salesFactories";
import { calculateQuoteTotals } from "../src/features/sales/utils/quoteCalculations";
import { buildSalesQuote, createQuoteDraft } from "../src/features/sales/utils/quoteDraft";
import axiosInstance from "../src/lib/axiosInstance";
import type { QuoteModuleRow, SalesCompany } from "../src/features/sales/types";

function quotedCompany(): SalesCompany {
	const company = createEmptyCompany();
	company.name = "Contract AB";
	company.organisationNumber = "5561234567";
	company.quote = {
		quoteNumber: "Q-202609-001",
		createdAt: "2026-09-28",
		validUntil: "2026-10-28",
		users: 3,
		term: "monthly",
		monthlyNet: 500,
		firstInvoice: 500,
		lines: [{
			id: "l1", name: "Bas", description: "", quantity: 1,
			price: 500, unit: "perMonth", amount: 500,
		}],
		notes: "",
	};
	company.order = createOrder(company);
	company.payment = createPendingPayment(company);
	return company;
}

const moduleRow: QuoteModuleRow = {
	id: "m1", name: "Bas", description: "", quantity: 1,
	price: 500, unit: "perMonth", selected: true,
};

// ───────────────────────── what is implemented ─────────────────────────

test("the CRM has an API module, and a prospect's fields survive the create body", () => {
	// The baseline everything below is measured against. companyInput builds the
	// body for create and bulk import; these fields are kept, so they reach the
	// server. What it strips is the subject of the TFS-1136 markers.
	const body = salesCrmApi.companyInput(quotedCompany());
	expect(body.name).toBe("Contract AB");
	expect(body.organisationNumber).toBe("5561234567");
	expect(body.quote?.monthlyNet).toBe(500);
	expect(Object.keys(salesCrmApi)).toEqual(
		expect.arrayContaining([
			"listSalesCompanies", "createSalesCompany", "createSalesCompanies",
			"patchSalesCompany", "archiveSalesCompany", "linkProfessionalAccount",
		]),
	);
});

test("quote totals follow the documented discount order", () => {
	// Term discount off the gross first, then the extra discount off what is
	// left. TFS-1137 mirrors exactly this arithmetic on the server, so changing a
	// discount here without the server fails this test first.
	const yearly = calculateQuoteTotals([moduleRow], "yearly", 10);
	expect(yearly.monthlyNet).toBeCloseTo(382.5, 2);
	expect(yearly.firstInvoice).toBeCloseTo(4590, 2);
});

test("SALES-11: the settings screen reads and writes the settings API", async () => {
	// /api/v1/teams/sales/settings (PR 82) holds the Calendly link and the email
	// templates; SalesSettingsProvider reads them and saves each change.
	const api = await import("../src/features/sales/api/salesSettingsApi");
	expect(Object.keys(api)).toEqual(
		expect.arrayContaining(["getSalesSettings", "patchSalesSettings"]),
	);
});

// ──────────────── backend exists, frontend never calls it ────────────────

test.fail("SALES-07: the list asks the server to filter, search and sort", async () => {
	// The server took over filtering, search and sorting, but
	// listSalesCompanies() takes no arguments and requests every page, so the
	// browser does it. Confirmed against local dev: typing in the search box and
	// sorting a column fire no request.
	//
	// Asserted by behaviour, not arity: a default parameter would give
	// Function.length 0 and hide a real fix.
	const original = axiosInstance.get;
	const sent: unknown[] = [];
	axiosInstance.get = (async (_url: string, config?: { params?: unknown }) => {
		sent.push(config?.params);
		return { data: { data: [], total_pages: 1 } };
	}) as typeof axiosInstance.get;
	try {
		await (salesCrmApi.listSalesCompanies as (query?: object) => Promise<unknown>)({
			search: "Nordisk",
		});
	} finally {
		axiosInstance.get = original;
	}
	expect(sent[0]).toHaveProperty("search", "Nordisk");
});

// ──────────────────────── no backend at all yet ────────────────────────

test.fail("TFS-1136: an order confirmation survives being saved", () => {
	// SalesCompanyData has no `order` field, so companyInput deletes it on the
	// way out. The API answers 200 and the confirmation is gone on reload. An
	// order date and number are not financial, so the client may send the order;
	// the number itself should be allocated by the server (TFS-1138).
	expect(salesCrmApi.companyInput(quotedCompany())).toHaveProperty("order");
});

test.fixme("TFS-1136: a payment link survives a reload", () => {
	// The link and invoice number a seller just sent are gone on reload. But the
	// server strips `payment` on purpose: the CRM schema is non-financial, and
	// test_sales_records_reject_fake_financial_state refuses a client-written
	// payment, because otherwise a seller could mark their own invoice paid.
	//
	// So the fix is not for the client to send `payment`. Payment state belongs
	// in the payment_orders ledger that sales_billing_service already writes, and
	// the CRM should read it from there. That is why this is fixme and not an
	// assertion that companyInput keeps `payment`: such a marker would stay red
	// for the right fix and turn green for the wrong one — the one that reopens
	// the hole. Assert on the server-read payment once that endpoint exists.
});

test.fail("SALES-10: stored sales documents have somewhere to live", async () => {
	// SalesDocumentsProvider starts from an empty useState. Media upload and
	// signed reads already exist on the server; what is missing is the index.
	const api = await import("../src/features/sales/api/salesDocumentsApi");
	expect(Object.keys(api)).toEqual(expect.arrayContaining(["listSalesDocuments"]));
});

test.fail("Sales organisation: the team roster is not a mock seed", async () => {
	// SalesTeamProvider seeds from salesTeam.mock and keeps edits in useState, so
	// the sales organisation resets on reload. Against an empty local database it
	// still shows five people, all from the mock.
	const api = await import("../src/features/sales/api/salesTeamApi");
	expect(Object.keys(api)).toEqual(expect.arrayContaining(["listSalesTeam"]));
});

// ──────────────────────── numbering and money ────────────────────────

test.fail("TFS-1138: a quote number does not depend on unrelated factory calls", () => {
	// createQuoteNumber shares one module-level counter with createId and
	// createTrialAccount, so the serial depends on how many unrelated things were
	// created first. Creating the prospect already consumed 001.
	createId("sc");
	expect(createQuoteNumber()).toMatch(/-001$/);
});

test.fail("TFS-1138: document numbers are issued by the server, not the browser", async () => {
	// The counter resets on reload and runs per tab, so two tabs produce the same
	// quote number. Order and invoice numbers are worse: they are built from the
	// last four characters of the company id, so they are neither sequential nor
	// unique — and Swedish bookkeeping rules require invoice numbers to be both.
	const api = await import("../src/features/sales/api/salesNumbersApi");
	expect(Object.keys(api)).toEqual(expect.arrayContaining(["allocateDocumentNumber"]));
});

test("TFS-1137: a saved quote carries the discount that explains its net", () => {
	// Without the percentage the server (PR 92) can only bound monthlyNet: 50 000 kr
	// of lines invoiced for 1 kr would pass as a 99.998 percent discount. And a
	// reopened quote must start from its own discount, or saving it again raises
	// the price without anyone touching it.
	const company = quotedCompany();
	company.quote = { ...company.quote!, extraDiscountPercent: 12.5 };
	const draft = createQuoteDraft(company, (key) => key, "");
	expect(draft.extraDiscountPercent).toBe(12.5);
	const totals = calculateQuoteTotals(draft.modules, draft.term, draft.extraDiscountPercent);
	const quote = buildSalesQuote(draft, totals, "Q-1");
	expect(quote.extraDiscountPercent).toBe(12.5);
	expect(quote.monthlyNet).toBe(totals.monthlyNet);
});

test.fail("Trials: the Sales screens use the durations the trials API offers", async () => {
	// The Sales screens offer 14 and 30 days; the backend /teams/trials and
	// Robert both say 30 days and 1-6 months. Sales never calls that API, so the
	// two have never had to agree.
	const api = await import("../src/features/sales/api/salesTrialsApi");
	expect(Object.keys(api)).toEqual(expect.arrayContaining(["createTrial"]));
});
