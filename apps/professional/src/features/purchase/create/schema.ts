import { z } from "zod";

import {
	customerDetailsSchema,
	postalCodeRegex,
} from "@/lib/validation/contactSchema";
import localizationConstants from "@/utils/translation/constants";

const optionalPostalCode = z
	.string()
	.trim()
	.regex(postalCodeRegex, localizationConstants.orderValidationPostalCodeInvalid)
	.optional()
	.default("");

export const purchaseObjectSchema = z.object({
	referenceNo: z
		.string()
		.trim()
		.min(1, localizationConstants.purchaseCreateValidationRefNoRequired),
	referenceName: z
		.string()
		.trim()
		.min(1, localizationConstants.purchaseCreateValidationRefNameRequired),
	blockName: z.string().optional().default(""),
	address: z.string().optional().default(""),
	postalCode: optionalPostalCode,
	city: z.string().optional().default(""),
	deliverySameAsObject: z.boolean().default(false),
	deliveryAddress: z.string().optional().default(""),
	deliveryPostalCode: optionalPostalCode,
	deliveryCity: z.string().optional().default(""),
});

export const createPurchaseObjectSchema = z.object({
	linkType: z.enum(["order", "project"]),
	linkedTo: z
		.string()
		.trim()
		.min(1, localizationConstants.purchaseCreateValidationLinkRequired),
	customer: customerDetailsSchema,
	object: purchaseObjectSchema,
});

export type CreatePurchaseObjectInput = z.input<
	typeof createPurchaseObjectSchema
>;
