/**
 * What a new partner offer must satisfy before it can be saved.
 *
 * newOfferSchema is the only validation between the form and the offer list, so
 * its edges are pinned here. Follows admin-user-contract.spec.ts: the Playwright
 * runner, no browser.
 */
import { expect, test } from "@playwright/test";
import { EMPTY_NEW_OFFER, newOfferSchema } from "../src/features/partners/dashboard/schemas/newOffer.schema";

const valid = {
	...EMPTY_NEW_OFFER,
	offerName: "Höstkampanj",
	startDate: "2026-10-01",
	endDate: "2026-10-31",
	discount: "20",
	channels: ["b2c"] as ("b2c" | "b2b")[],
	imageId: "image-1",
};

const fails = (changes: Partial<typeof valid>) => !newOfferSchema.safeParse({ ...valid, ...changes }).success;

test("a complete offer is accepted", () => {
	expect(newOfferSchema.safeParse(valid).success).toBe(true);
});

test("the empty form is refused", () => {
	expect(newOfferSchema.safeParse(EMPTY_NEW_OFFER).success).toBe(false);
});

test("a name made only of spaces is refused", () => {
	expect(fails({ offerName: "   " })).toBe(true);
});

for (const discount of ["0", "101", "12.5", "-5", "abc", ""]) {
	test(`discount "${discount}" is refused`, () => {
		expect(fails({ discount })).toBe(true);
	});
}

test("discount is a whole percent from 1 to 100, surrounding spaces allowed", () => {
	expect(fails({ discount: "1" })).toBe(false);
	expect(fails({ discount: "100" })).toBe(false);
	expect(fails({ discount: " 20 " })).toBe(false);
});

test("at least one channel is required", () => {
	expect(fails({ channels: [] })).toBe(true);
	expect(fails({ channels: ["b2c", "b2b"] })).toBe(false);
});

test("a picture is required", () => {
	expect(fails({ imageId: "" })).toBe(true);
});

test("an end before the start is refused, and the error lands on the end date", () => {
	const result = newOfferSchema.safeParse({ ...valid, startDate: "2026-10-31", endDate: "2026-10-01" });
	expect(result.success).toBe(false);
	expect(result.error?.issues.some((issue) => issue.path.join(".") === "endDate")).toBe(true);
});

test("an offer that starts and ends on the same day is allowed", () => {
	expect(fails({ startDate: "2026-10-15", endDate: "2026-10-15" })).toBe(false);
});
