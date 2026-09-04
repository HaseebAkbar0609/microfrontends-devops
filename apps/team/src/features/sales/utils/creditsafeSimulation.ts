import localizationConstants from "@/utils/translation/constants";
import type { CreditsafeInfo, SalesCompany } from "../types";

/**
 * Stand-in for the Creditsafe lookup until an API key is wired up. The result is
 * derived deterministically from the organisation number so the same company
 * always reports the same rating. The UI states plainly that this is simulated.
 */

const RATINGS = ["AAA", "AA", "A", "B", "C"] as const;

const LOW_RISK_RATINGS = new Set<string>(["AAA", "AA"]);

function ratingSeed(organisationNumber: string): number {
	const digits = (organisationNumber.match(/\d/g) ?? []).join("");
	return digits ? Number(digits.slice(-3)) : 100;
}

function riskLevelKeyFor(rating: string) {
	if (LOW_RISK_RATINGS.has(rating)) {
		return localizationConstants.salesCreditsafeRiskVeryLow;
	}
	if (rating === "A") return localizationConstants.salesCreditsafeRiskLow;
	return localizationConstants.salesCreditsafeRiskMedium;
}

export function simulateCreditsafeLookup(
	company: SalesCompany,
): CreditsafeInfo {
	const seed = ratingSeed(company.organisationNumber);
	const rating = RATINGS[seed % RATINGS.length];

	return {
		fetchedAt: new Date().toISOString(),
		hasFTax: seed % 7 !== 0,
		vatRegistered: seed % 5 !== 0,
		employerRegistered: company.employees > 0 || seed % 3 !== 0,
		rating,
		riskLevelKey: riskLevelKeyFor(rating),
		registeredAt: company.startYear ? `${company.startYear}-01-01` : "",
		legalFormKey: localizationConstants.salesLegalFormLimitedCompany,
		address: company.city,
	};
}
