/**
 * Activities are appended and updated through their own endpoints (TFS-1188).
 *
 * Follows sales-module-contract.spec.ts: the Playwright runner, no browser, no
 * server. Its own file so it never conflicts with the other Sales specs.
 *
 * Run: pnpm --filter @tfs/team test:e2e -- sales-activities-contract
 */
import { expect, test } from "@playwright/test";

import * as salesCrmApi from "../src/features/sales/api/salesCrmApi";
import axiosInstance from "../src/lib/axiosInstance";

test("an activity is appended on its own, never by resending the company's list", async () => {
	// A PATCH of the whole list soft-deletes whatever a colleague logged since this
	// tab loaded (sales_crm_service._sync_activities), so activities have their own
	// append and patch endpoints.
	const original = { post: axiosInstance.post, patch: axiosInstance.patch };
	const sent: Array<[string, unknown]> = [];
	const record = (async (url: string, body?: unknown) => {
		sent.push([url, body]);
		return { data: { data: body } };
	}) as typeof axiosInstance.post;
	axiosInstance.post = record;
	axiosInstance.patch = record as typeof axiosInstance.patch;
	try {
		const activity = { id: "sa-1", date: "2026-09-30T08:00:00Z", type: "call" as const, text: "Ring", followUpAt: "", done: false };
		await salesCrmApi.addSalesActivity("rec-1", activity);
		await salesCrmApi.patchSalesActivity("rec-1", "sa-1", { done: true });
	} finally {
		Object.assign(axiosInstance, original);
	}
	expect(sent).toEqual([
		["/api/v1/teams/sales/crm/rec-1/activities", expect.objectContaining({ id: "sa-1" })],
		["/api/v1/teams/sales/crm/rec-1/activities/sa-1", { done: true }],
	]);
});
