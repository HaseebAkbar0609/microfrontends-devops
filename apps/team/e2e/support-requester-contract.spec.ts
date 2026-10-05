/**
 * A support ticket is raised for a private customer or a professional company
 * picked from the real registers (TFS-1039).
 *
 * Follows sales-activities-contract.spec.ts: the Playwright runner, no browser,
 * no server.
 *
 * Run: pnpm --filter @tfs/team test:e2e -- support-requester-contract
 */
import { expect, test } from "@playwright/test";

import { getRequesterHref } from "../src/features/support/constants/supportNav";
import { searchRequesters } from "../src/features/support/utils/requesterSearch";
import axiosInstance from "../src/lib/axiosInstance";

test("each customer type searches its own register and maps to one row shape", async () => {
	const original = axiosInstance.get;
	const calls: Array<[string, unknown]> = [];
	axiosInstance.get = (async (url: string, config?: { params?: unknown }) => {
		calls.push([url, config?.params]);
		if (url.includes("/private/")) {
			return { data: { data: { items: [{ id: "c1", name: "Anna Larsson", email: "anna@x.se", city: "Umeå" }], total_pages: 1, total_items: 1, current_page: 1, page_size: 8 } } };
		}
		return { data: { data: [{ company_id: "p1", company_name: "Bygg AB", organization_number: "556000-0000", contact_person: "Erik" }], total_pages: 1, total_items: 1, current_page: 1, page_size: 8 } };
	}) as typeof axiosInstance.get;
	try {
		const privateRows = await searchRequesters("private", "anna");
		const professionalRows = await searchRequesters("professional", "bygg");
		expect(privateRows).toEqual([{ id: "c1", name: "Anna Larsson", detail: "anna@x.se · Umeå" }]);
		expect(professionalRows).toEqual([{ id: "p1", name: "Bygg AB", detail: "556000-0000 · Erik" }]);
	} finally {
		axiosInstance.get = original;
	}
	expect(calls.map(([url]) => url)).toEqual([
		"/api/v1/teams/private/customers/active",
		"/api/v1/teams/professionals/accounts",
	]);
	expect(calls.map(([, params]) => params)).toEqual([
		expect.objectContaining({ search: "anna", page_size: 8 }),
		expect.objectContaining({ search: "bygg", page_size: 8, status: "active" }),
	]);
});

test("a linked ticket opens its record under Customers; an unlinked one has nowhere to go", () => {
	expect(getRequesterHref({ customerId: "p1", customerType: "professional", customer: "Bygg AB" })).toBe("/customers/professional/p1");
	expect(getRequesterHref({ customerId: "c1", customerType: "private", customer: "Anna Larsson" })).toBe("/customers/private?search=Anna%20Larsson");
	expect(getRequesterHref({ customerId: null, customerType: "private", customer: "Okänd" })).toBeNull();
});
