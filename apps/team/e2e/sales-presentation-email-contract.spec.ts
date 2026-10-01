/**
 * The meeting booker opens a presentation email filled in from a Sales template
 * (TFS-1191).
 *
 * Its own file so it never conflicts with sales-module-contract.spec.ts.
 *
 * Run: pnpm --filter @tfs/team test:e2e -- sales-presentation-email-contract
 */
import { expect, test } from "@playwright/test";

import { createEmptyCompany } from "../src/features/sales/utils/salesFactories";
import { buildMailtoLink, renderTemplate } from "../src/features/sales/utils/salesTemplates";

test("a presentation email opens filled in, signed by whoever sends it", () => {
	const company = { ...createEmptyCompany(), name: "Contract AB", contactPerson: "Eva", seller: "Account seller" };
	const template = { id: "t1", name: "Intro", subject: "Hej {företag}", body: "Hej {kontakt}, boka: {calendly}\n/{säljare}" };
	const { subject, body } = renderTemplate(template, company, "https://calendly.com/x", "Booker Bo");
	expect(subject).toBe("Hej Contract AB");
	expect(body).toBe("Hej Eva, boka: https://calendly.com/x\n/Booker Bo");
	const link = buildMailtoLink(" eva@contract.se ", subject, body);
	expect(link.startsWith("mailto:eva@contract.se?subject=Hej%20Contract%20AB&body=")).toBe(true);
	expect(decodeURIComponent(link.split("&body=")[1])).toBe(body);
	// An address cannot smuggle in more recipients or headers.
	expect(buildMailtoLink("a@b.se?cc=x@y.se", "s", "b")).toMatch(/^mailto:a@b\.se%3Fcc%3Dx@y\.se\?subject=/);
});
