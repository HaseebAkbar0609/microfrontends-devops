import { QUOTE_MODULE_TEMPLATES } from "../constants/quoteModules";
import {
	DEFAULT_QUOTE_USERS,
	DEFAULT_QUOTE_VALID_DAYS,
} from "../constants/sales.constants";
import type {
	QuoteModuleRow,
	QuoteTermId,
	SalesCompany,
} from "../types";

export type QuoteDraft = {
	/** Issue date shown on the sheet; stable for a saved quote. */
	createdAt: string;
	customerName: string;
	organisationNumber: string;
	contactPerson: string;
	email: string;
	customerMobile: string;
	sellerName: string;
	sellerEmail: string;
	sellerMobile: string;
	users: number;
	extraDiscountPercent: number;
	validDays: number;
	term: QuoteTermId;
	notes: string;
	modules: QuoteModuleRow[];
};

function catalogRows(descriptionOf: (key: string) => string): QuoteModuleRow[] {
	return QUOTE_MODULE_TEMPLATES.map((template) => ({
		id: template.id,
		name: template.name,
		description: descriptionOf(template.descriptionKey),
		price: template.price,
		unit: template.unit,
		selected: template.defaultSelected,
		quantity: template.defaultQuantity,
		quantityEditable: template.quantityEditable,
	}));
}

/**
 * Rebuilds the editable module list.
 *
 * With no saved quote this is the plain catalogue. With one, catalogue rows are
 * overlaid with the saved quantity, price and unit, and any line the seller
 * added by hand is appended so "edit quote" round-trips.
 */
function modulesFor(
	company: SalesCompany,
	descriptionOf: (key: string) => string,
): QuoteModuleRow[] {
	const rows = catalogRows(descriptionOf);
	const quote = company.quote;
	if (!quote) return rows;

	const savedById = new Map(quote.lines.map((line) => [line.id, line]));
	const merged = rows.map((row) => {
		const saved = savedById.get(row.id);
		if (!saved) return { ...row, selected: false };
		return {
			...row,
			selected: true,
			quantity: saved.quantity,
			price: saved.price,
			unit: saved.unit,
		};
	});

	const catalogIds = new Set(rows.map((row) => row.id));
	const custom = quote.lines
		.filter((line) => !catalogIds.has(line.id))
		.map<QuoteModuleRow>((line) => ({
			id: line.id,
			name: line.name,
			description: line.description,
			price: line.price,
			unit: line.unit,
			selected: true,
			quantity: line.quantity,
			quantityEditable: true,
		}));

	return [...merged, ...custom];
}

/**
 * Seeds the builder from the company, and from its saved quote when there is
 * one. `descriptionOf` and `defaultNotes` are passed in already translated.
 */
export function createQuoteDraft(
	company: SalesCompany,
	descriptionOf: (key: string) => string,
	defaultNotes: string,
): QuoteDraft {
	const quote = company.quote;

	return {
		createdAt: quote?.createdAt ?? new Date().toISOString(),
		customerName: company.name,
		organisationNumber: company.organisationNumber,
		contactPerson: company.contactPerson,
		email: company.email,
		customerMobile: company.mobile,
		sellerName: company.seller,
		sellerEmail: "",
		sellerMobile: "",
		users: quote?.users ?? (company.employees || DEFAULT_QUOTE_USERS),
		extraDiscountPercent: 0,
		validDays: DEFAULT_QUOTE_VALID_DAYS,
		term: quote?.term ?? "yearly",
		notes: quote?.notes || defaultNotes,
		modules: modulesFor(company, descriptionOf),
	};
}
