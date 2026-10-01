/**
 * A company save carries the version this tab read, so the server can refuse a
 * stale one with 409 instead of letting two sellers overwrite each other
 * (TFS-1189).
 *
 * Its own file so it never conflicts with sales-module-contract.spec.ts, where
 * this was the SALES-03 gap.
 *
 * Run: pnpm --filter @tfs/team test:e2e -- sales-version-contract
 */
import { expect, test } from "@playwright/test";

import { companyInput, companyPatchBody } from "../src/features/sales/api/salesCrmApi";
import { createEmptyCompany } from "../src/features/sales/utils/salesFactories";

const SERVER_OWNED = ["id", "createdAt", "order", "payment", "professionalCompanyId"];

test("a patch sends the version this tab read, not the caller's copy", () => {
	const company = { ...createEmptyCompany(), version: 1, professionalCompanyId: "pro-1" };
	const body = companyPatchBody({ ...company, city: "Umeå" }, 7);
	expect(body).toMatchObject({ version: 7, city: "Umeå" });
	for (const owned of SERVER_OWNED) expect(body).not.toHaveProperty(owned);
});

test("a patch without a known version sends none", () => {
	expect(companyPatchBody({ city: "Umeå", version: 3 }, undefined)).toEqual({ city: "Umeå" });
});

test("a create sends neither a version nor any server-owned field", () => {
	const body = companyInput({ ...createEmptyCompany(), version: 4 });
	for (const owned of [...SERVER_OWNED, "version"]) expect(body).not.toHaveProperty(owned);
});
