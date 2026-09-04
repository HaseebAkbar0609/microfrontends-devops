import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";

const required = (key: string) => z.string().trim().min(1, key);

/**
 * Quantity and price arrive from text inputs, so they are validated as strings
 * and converted only once they are known good. `Number("")` is 0 and
 * `Number("abc")` is NaN, either of which would corrupt a total silently.
 */
const positiveNumeric = z
	.string()
	.trim()
	.refine((value) => {
		const parsed = Number(value.replace(",", "."));
		return Number.isFinite(parsed) && parsed > 0;
	}, localizationConstants.purchaseOrderValidationQuantity);

/** Step 1 — the object and its delivery address. */
export const orderObjectStepSchema = z.object({
	supplierId: required(
		localizationConstants.purchaseOrderValidationRequired,
	),
	projectNo: z.string().trim().default(""),
	projectName: z.string().trim().default(""),
	objectName: z.string().trim().default(""),
	blockName: z.string().trim().default(""),
	projectAddress: z.string().trim().default(""),
	projectPostalCode: z.string().trim().default(""),
	projectCity: z.string().trim().default(""),
	deliverySameAsProject: z.boolean().default(true),
	deliveryAddress: z.string().trim().default(""),
	deliveryPostalCode: z.string().trim().default(""),
	deliveryCity: z.string().trim().default(""),
});

/** Step 2 — the contact person. Only the first name is mandatory in the frame. */
export const orderContactStepSchema = z.object({
	contactId: z.string().trim().default(""),
	firstName: required(localizationConstants.purchaseOrderValidationRequired),
	lastName: z.string().trim().default(""),
	address: z.string().trim().default(""),
	postalCode: z.string().trim().default(""),
	email: z.string().trim().default(""),
	phone: z.string().trim().default(""),
	city: z.string().trim().default(""),
	role: z.string().trim().default(""),
});

export const orderSpecLineSchema = z.object({
	id: z.string(),
	articleNo: z.string().trim().default(""),
	supplierArticleNo: z.string().trim().default(""),
	designation: required(
		localizationConstants.purchaseOrderValidationRequired,
	),
	quantity: positiveNumeric,
	unit: z.string().trim().default(""),
	unitPrice: positiveNumeric,
});

/** Step 3 — supplier, order information and at least one specification line. */
export const orderSpecificationStepSchema = z.object({
	supplierCompany: z.string().trim().default(""),
	monitoringEnabled: z.boolean().default(false),
	monitoringDate: z.string().trim().default(""),
	desiredDelivery: z.string().trim().default(""),
	marking: z.string().trim().default(""),
	deliveryMethod: z.string().trim().default(""),
	comments: z.string().trim().max(2000).default(""),
	lines: z
		.array(orderSpecLineSchema)
		.min(1, localizationConstants.purchaseOrderValidationRequired),
});

export type OrderObjectStepInput = z.input<typeof orderObjectStepSchema>;
export type OrderContactStepInput = z.input<typeof orderContactStepSchema>;
export type OrderSpecificationStepInput = z.input<
	typeof orderSpecificationStepSchema
>;

/** Flattens a ZodError into `field -> message`, the shape the steps render. */
export function collectOrderErrors(
	error: z.ZodError,
	prefix = "",
): Record<string, string> {
	const collected: Record<string, string> = {};

	for (const issue of error.issues) {
		const path = [prefix, ...issue.path].filter(Boolean).join(".");
		if (path && !collected[path]) collected[path] = issue.message;
	}

	return collected;
}
