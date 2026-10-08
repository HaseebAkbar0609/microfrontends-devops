/**
 * The pure logic behind Team › Content console › Kund › Konsulter (TFS-1216):
 * the form round trip, the limits the server also enforces, and which error
 * text reaches the user. Follows admin-user-contract.spec.ts: no browser.
 */
import { expect, test } from "@playwright/test";
import { CONSULTANT_TYPE_LIMITS as LIMITS } from "../src/features/content/constants/content.constants";
import {
	consultantTypeSchema,
	toConsultantTypeForm,
	toConsultantTypeInput,
	type ConsultantTypeFormValues,
} from "../src/features/content/schemas/consultantType.schema";
import { apiErrorText } from "../src/features/content/utils/apiErrors";

const architect = {
	id: "architect",
	name: "Architect",
	in_use: false,
	sections: [{ title: "Ritningar", bullets: ["Ritar huset.", "Söker bygglov."] }],
};

const refused = (values: ConsultantTypeFormValues) => !consultantTypeSchema.safeParse(values).success;
const section = (bullets: number) => ({
	title: "T",
	bullets: Array.from({ length: bullets }, () => ({ text: "b" })),
});

test("a saved type comes back out of the form unchanged", () => {
	expect(toConsultantTypeInput(toConsultantTypeForm(architect))).toEqual({
		name: architect.name,
		sections: architect.sections,
	});
});

test("the form trims, then refuses what the server would refuse", () => {
	expect(
		consultantTypeSchema.parse({
			name: "  Akustik  ",
			sections: [{ title: " Ljud ", bullets: [{ text: " Mäter buller. " }] }],
		}),
	).toEqual({ name: "Akustik", sections: [{ title: "Ljud", bullets: [{ text: "Mäter buller." }] }] });

	expect(refused({ name: "   ", sections: [] })).toBe(true);
	expect(refused({ name: "x".repeat(LIMITS.nameLength), sections: [] })).toBe(false);
	expect(refused({ name: "x".repeat(LIMITS.nameLength + 1), sections: [] })).toBe(true);
	expect(refused({ name: "A", sections: [{ title: "T", bullets: [{ text: "  " }] }] })).toBe(true);
	expect(refused({ name: "A", sections: [section(0)] })).toBe(false);
	expect(refused({ name: "A", sections: [section(LIMITS.bulletsPerSection + 1)] })).toBe(true);
	expect(refused({ name: "A", sections: Array.from({ length: LIMITS.sections + 1 }, () => section(1)) })).toBe(true);
});

test("server text is shown as sent; bare codes and missing text fall back", () => {
	const apiError = (message: unknown) => ({ isAxiosError: true, response: { data: { message } } });

	expect(apiErrorText(apiError("Namnet används redan."), "fallback")).toBe("Namnet används redan.");
	expect(apiErrorText(apiError("CONSULTANT_TYPE_IN_USE"), "fallback")).toBe("fallback");
	expect(apiErrorText(apiError("  "), "fallback")).toBe("fallback");
	expect(apiErrorText(apiError(undefined), "fallback")).toBe("fallback");
	expect(apiErrorText(new Error("Network Error"), "fallback")).toBe("fallback");
});
