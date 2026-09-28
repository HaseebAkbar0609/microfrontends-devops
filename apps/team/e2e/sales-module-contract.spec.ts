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
 * Run: pnpm --filter @tfs/team test:e2e -- sales-module-contract
 */
import { expect, test } from "@playwright/test";

import { companyInput } from "../src/features/sales/api/salesCrmApi";
import * as salesCrmApi from "../src/features/sales/api/salesCrmApi";
import {
	createEmptyCompany,
	createId,
	createOrder,
	createPendingPayment,
	createQuoteNumber,
} from "../src/features/sales/utils/salesFactories";
import { calculateQuoteTotals } from "../src/features/sales/utils/quoteCalculations";
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
	company.version = 4;
	return company;
}

const moduleRow: QuoteModuleRow = {
	id: "m1", name: "Bas", description: "", quantity: 1,
	price: 500, unit: "perMonth", selected: true,
};

// ───────────────────────── what is implemented ─────────────────────────

test("the CRM record round-trips through a real API module", () => {
	// Everything below is a gap. This one is the baseline: prospects, their
	// contact details, activities and the quote do reach the server.
	const body = companyInput(quotedCompany());
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
	// left. TFS-1137 mirrors exactly this arithmetic on the server.
	const yearly = calculateQuoteTotals([moduleRow], "yearly", 10);
	expect(yearly.monthlyNet).toBeCloseTo(382.5, 2);
	expect(yearly.firstInvoice).toBeCloseTo(4590, 2);
});

// ──────────────── backend exists, frontend never calls it ────────────────

test.fail("SALES-11: the settings screen reads and writes the settings API", async () => {
	// The backend shipped and merged (PR 82, /api/v1/teams/sales/settings), but
	// SalesSettingsProvider still holds the Calendly link and the email templates
	// in useState seeded from salesSettings.mock, so a seller's settings are gone
	// on reload. Only the server half of the ticket was done.
	const api = await import("../src/features/sales/api/salesSettingsApi");
	expect(Object.keys(api)).toEqual(
		expect.arrayContaining(["getSalesSettings", "patchSalesSettings"]),
	);
});

test.fail("SALES-03: a patch asserts the version it read, so a 409 can happen", () => {
	// The server compares `version` and answers SALES_COMPANY_VERSION_CONFLICT,
	// but both companyInput and SalesCrmProvider strip the field before sending,
	// so two sellers editing one prospect still overwrite each other silently.
	expect(companyInput(quotedCompany())).toHaveProperty("version", 4);
});

test.fail("SALES-07: the list asks the server to filter, search and sort", () => {
	// The server took over filtering, search and sorting, but
	// listSalesCompanies() still walks every page 100 at a time and hands the
	// whole table to the browser, which is what it did before. Function.length is
	// its declared arity: zero parameters means there is nowhere to pass a
	// filter, a search term, a sort or a page.
	expect(salesCrmApi.listSalesCompanies).toHaveLength(1);
});

// ──────────────────────── no backend at all yet ────────────────────────

test.fail("TFS-1136: an order confirmation survives being saved", () => {
	// SalesCompanyData has no `order` field, so companyInput deletes it on the
	// way out. The API answers 200 and the confirmation is gone on reload.
	expect(companyInput(quotedCompany())).toHaveProperty("order");
});

test.fail("TFS-1136: a payment link survives being saved", () => {
	// Same for `payment`: the link and invoice number the seller just sent to a
	// customer are dropped, with no error.
	expect(companyInput(quotedCompany())).toHaveProperty("payment");
});

test.fail("SALES-10: stored sales documents have somewhere to live", async () => {
	// SalesDocumentsProvider starts from an empty useState. Media upload and
	// signed reads already exist on the server; what is missing is the index.
	const api = await import("../src/features/sales/api/salesDocumentsApi");
	expect(Object.keys(api)).toEqual(expect.arrayContaining(["listSalesDocuments"]));
});

test.fail("Sales organisation: the team roster is not a mock seed", async () => {
	// SalesTeamProvider seeds from salesTeam.mock and keeps edits in useState, so
	// the sales organisation resets on reload.
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

test.fail("TFS-1137: a saved quote carries the discount that explains its net", () => {
	// The quote draft holds extraDiscountPercent and drops it on save, so nothing
	// stored explains a net below the term price. The server now accepts the
	// field; the client has to start sending it before monthlyNet can be checked
	// exactly rather than merely bounded.
	const quote = quotedCompany().quote;
	expect(quote).toHaveProperty("extraDiscountPercent");
});

test.fail("Trials: the Sales screens use the durations the trials API offers", async () => {
	// The Sales screens offer 14 and 30 days; the backend /teams/trials and
	// Robert both say 30 days and 1-6 months. Sales never calls that API, so the
	// two have never had to agree.
	const api = await import("../src/features/sales/api/salesTrialsApi");
	expect(Object.keys(api)).toEqual(expect.arrayContaining(["createTrial"]));
});
