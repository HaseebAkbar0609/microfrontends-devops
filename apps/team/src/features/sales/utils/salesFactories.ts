import {
	DEFAULT_QUOTE_VALID_DAYS,
	INVOICE_NUMBER_PREFIX,
	MS_PER_DAY,
	ORDER_NUMBER_PREFIX,
	PAYMENT_LINK_BASE_URL,
	TRIAL_ACCOUNT_DOMAIN,
} from "../constants/sales.constants";
import type {
	SalesCompany,
	SalesOrder,
	SalesPayment,
	TrialAccount,
	TrialKind,
} from "../types";

/**
 * Everything in this file runs from a client event handler only — never during
 * render — so reading the real clock here cannot cause a hydration mismatch.
 */

let sequence = 0;

function nextSequence(): number {
	sequence += 1;
	return sequence;
}

export function createId(prefix: string): string {
	return `${prefix}-${Date.now().toString(36)}-${nextSequence()}`;
}

function slugify(value: string, fallback: string): string {
	const slug = value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 20);
	return slug || fallback;
}

function shortYear(): string {
	return String(new Date().getFullYear());
}

function documentSuffix(companyId: string): string {
	return companyId.slice(-4);
}

export function createEmptyCompany(): SalesCompany {
	return {
		id: createId("sc"),
		name: "",
		organisationNumber: "",
		contactPerson: "",
		email: "",
		mobile: "",
		city: "",
		trade: "",
		category: "",
		region: "",
		employees: 0,
		revenue: 0,
		startYear: "",
		status: "prospect",
		accountManager: "",
		seller: "",
		source: "",
		notes: "",
		createdAt: new Date().toISOString(),
		demoAccounts: [],
		testAccounts: [],
		creditsafe: null,
		activities: [],
		quote: null,
		order: null,
		payment: null,
	};
}

export function createTrialAccount(
	company: SalesCompany,
	days: number,
	kind: TrialKind,
): TrialAccount {
	const slug = slugify(company.name, kind);
	const startedAt = new Date();
	const expiresAt = new Date(startedAt.getTime() + days * MS_PER_DAY);

	return {
		username: `${slug}-${nextSequence()}@${kind}.${TRIAL_ACCOUNT_DOMAIN}`,
		url: `https://${kind}.${TRIAL_ACCOUNT_DOMAIN}/${company.id}`,
		startedAt: startedAt.toISOString(),
		expiresAt: expiresAt.toISOString(),
	};
}

export function createQuoteValidUntil(days = DEFAULT_QUOTE_VALID_DAYS): string {
	return new Date(Date.now() + days * MS_PER_DAY).toISOString();
}

export function createOrder(company: SalesCompany): SalesOrder {
	return {
		orderNumber: `${ORDER_NUMBER_PREFIX}-${shortYear()}-${documentSuffix(company.id)}`,
		createdAt: new Date().toISOString(),
	};
}

export function createPendingPayment(company: SalesCompany): SalesPayment {
	return {
		status: "pending",
		link: `${PAYMENT_LINK_BASE_URL}/${company.id}`,
		invoiceNumber: `${INVOICE_NUMBER_PREFIX}-${shortYear()}-${documentSuffix(company.id)}`,
		sentAt: new Date().toISOString(),
		amount: company.quote?.firstInvoice ?? 0,
	};
}
