import { z } from "zod";
import { SWEDISH_VAT_RATES } from "../constants/expense.constants";
import type { SwedishVatRate } from "../types/expense.types";

/**
 * Zod Schema for individual Expense Line Item
 */
export const expenseLineItemSchema = z.object({
	id: z.string().min(1, "ID is required"),
	articleNo: z.string().optional(),
	description: z.string().trim().min(1, "registerExpenseErrorLineItemDesc"),
	quantity: z.number().gt(0, "Quantity must be greater than 0"),
	unit: z.string().default("st"),
	unitPrice: z.number().min(0, "Price cannot be negative"),
	vatRate: z.number().refine((val) => SWEDISH_VAT_RATES.includes(val as SwedishVatRate), {
		message: "Invalid VAT rate",
	}),
	accountNumber: z.string().optional().default("4010"),
	costCenter: z.string().optional(),
	total: z.number().default(0),
});

/**
 * Zod Schema for individual Time Report Item
 */
export const expenseTimeReportItemSchema = z.object({
	id: z.string().min(1, "ID is required"),
	date: z.string().min(1, "Date is required"),
	referenceName: z.string().trim().optional(),
	workedHours: z.number().min(0).default(0),
	unit: z.string().default("tim"),
	hourlyRate: z.number().min(0).default(650),
	ataHours: z.number().optional(),
	sumTime: z.number().optional(),
	costCenter: z.string().optional(),
	total: z.number().default(0),
	comments: z.string().optional(),
	included: z.boolean().default(true),
});

/**
 * Zod Schema for File Attachment metadata
 */
export const expenseAttachmentSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	size: z.number().nonnegative(),
	type: z.string().min(1),
	uploadedAt: z.string().min(1),
});

/**
 * Comprehensive Zod Schema for Register Expense Form Data
 * (Meets Technology Stack guidelines & Edwin's review checklist)
 */
export const registerExpenseFormSchema = z
	.object({
		supplier: z
			.string()
			.trim()
			.min(1, "registerExpenseErrorSupplierRequired"),
		fakturaNo: z
			.string()
			.trim()
			.min(1, "registerExpenseErrorInvoiceNoRequired"),
		date: z
			.string()
			.trim()
			.min(1, "registerExpenseErrorDateRequired"),
		dueDate: z
			.string()
			.trim()
			.min(1, "registerExpenseErrorDueDateRequired"),
		category: z.string().default("material"),
		currency: z.enum(["SEK", "EUR", "USD", "NOK", "DKK"]).default("SEK"),
		reference: z.string().optional().default(""),
		project: z.string().optional().default(""),
		costCenter: z.string().optional().default(""),
		lineItems: z.array(expenseLineItemSchema).default([]),
		attachments: z.array(expenseAttachmentSchema).default([]),
		notes: z.string().optional().default(""),
		timeReportItems: z.array(expenseTimeReportItemSchema).default([]),
		comments: z.string().optional().default(""),
	})
	.superRefine((data, ctx) => {
		const hasLineItems = data.lineItems.length > 0;
		const hasIncludedTimeReport = data.timeReportItems.some((tr) => tr.included);

		if (!hasLineItems && !hasIncludedTimeReport) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "registerExpenseErrorLineItemsRequired",
				path: ["lineItems"],
			});
		} else if (hasLineItems) {
			const hasInvalidLine = data.lineItems.some(
				(item) => !item.description.trim() || item.quantity <= 0 || item.unitPrice < 0
			);
			if (hasInvalidLine) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "registerExpenseErrorLineItemDesc",
					path: ["lineItems"],
				});
			}

			const lineItemsTotal = data.lineItems.reduce(
				(sum, item) => sum + item.quantity * item.unitPrice,
				0,
			);
			if (lineItemsTotal <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "registerExpenseErrorTotalRequired",
					path: ["lineItems"],
				});
			}
		}

		if (!hasLineItems && hasIncludedTimeReport) {
			const timeReportTotal = data.timeReportItems.reduce(
				(sum, item) => (item.included ? sum + item.workedHours * item.hourlyRate : sum),
				0,
			);
			if (timeReportTotal <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "registerExpenseErrorTotalRequired",
					path: ["lineItems"],
				});
			}
		}
	});

export type RegisterExpenseSchemaType = z.infer<typeof registerExpenseFormSchema>;
