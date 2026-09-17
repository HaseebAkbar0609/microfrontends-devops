import type { FieldPath } from "react-hook-form";
import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { fileRejection } from "../../../shared/recordFiles";
import type { ProjectRecordInfo } from "../../types";
import {
	ATA_DOCUMENT_NAME_MAX_LENGTH,
	ATA_FILE_RULES,
	ATA_LINE_LIMITS,
	ATA_LONG_TEXT_MAX_LENGTH,
	ATA_TEXT_MAX_LENGTH,
} from "../projectAta.config";
import type { AtaLineItems, ProjectAta } from "../types";

const POSTAL_CODE = /^\d{3}\s?\d{2}$/;

const text = (max: number = ATA_TEXT_MAX_LENGTH) =>
	z.string().trim().max(max, localizationConstants.projectAtaTooLong);

/** `File` checked at runtime, so the schema module is safe to load on the server. */
const fileSchema = z.custom<File>((value) => typeof File !== "undefined" && value instanceof File);

const lineItemSchema = z.object({
	id: z.string().min(1),
	date: z.string(),
	party: z.string(),
	resourceNo: z.string(),
	description: z.string(),
	quantity: z.number().positive(),
	invoiceNo: z.string(),
	unit: z.string(),
	netPrice: z.number().int().nonnegative(),
	markupPercent: z.number().int().min(0).max(ATA_LINE_LIMITS.percent),
	secondaryPercent: z.number().min(0).max(ATA_LINE_LIMITS.percent).nullable(),
	activity: z.string(),
	location: z.string(),
});

const section = z.array(lineItemSchema).max(ATA_LINE_LIMITS.rows, localizationConstants.projectAtaTooManyRows);

/** The five sections' rows, shared by the customer and the supplier ÄTA forms. */
export const ataLineItemsSchema = z.object({ staff: section, material: section, machines: section, ue: section, supplierAta: section });

/** Attached documents: names required, picked files re-checked by type and size. */
export const ataDocumentsSchema = z
	.array(
		z.object({
			id: z.string().min(1),
			date: z.string(),
			documentName: text(ATA_DOCUMENT_NAME_MAX_LENGTH).min(1, localizationConstants.projectAtaDocumentNameRequired),
			fileName: z.string().min(1),
			file: fileSchema.optional(),
		}),
	)
	.max(ATA_FILE_RULES.maxCount, localizationConstants.projectAtaTooManyFiles)
	.superRefine((documents, ctx) => {
		const refused = documents.find((doc) => doc.file && fileRejection(doc.file, ATA_FILE_RULES));
		if (!refused?.file) return;
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message:
				fileRejection(refused.file, ATA_FILE_RULES) === "size"
					? localizationConstants.projectAtaFileSizeError
					: localizationConstants.projectAtaFileTypeError,
		});
	});

/**
 * "Skapa ÄTA", both steps. Messages are translation keys.
 *
 * Beställare and Rubrik are required — the frame marks nothing, but an ÄTA with
 * neither cannot be told apart. Rows arrive already validated by the row
 * dialog; they are re-checked here as numbers. Files are re-checked by type
 * and size, since `accept` only filters the OS dialog.
 */
export const ataFormSchema = z.object({
	client: z.object({
		client: text().min(1, localizationConstants.projectAtaClientRequired),
		name: text(),
		address: text(),
		postalCode: z
			.string()
			.trim()
			.refine((value) => value === "" || POSTAL_CODE.test(value), localizationConstants.projectAtaPostalCodeInvalid),
		city: text(),
	}),
	info: z.object({
		heading: text().min(1, localizationConstants.projectAtaHeadingRequired),
		subheading: text(),
		proposedAction: text(ATA_LONG_TEXT_MAX_LENGTH),
		action: text(ATA_LONG_TEXT_MAX_LENGTH),
		qualityStatus: text(),
		reason: text(),
		economyStatus: text(),
		location: text(),
		description: text(ATA_LONG_TEXT_MAX_LENGTH),
	}),
	lineItems: ataLineItemsSchema,
	documents: ataDocumentsSchema,
	supplierInvoiceIds: z.array(z.string()),
	timeReportIds: z.array(z.string()),
});

export type AtaFormValues = z.infer<typeof ataFormSchema>;

/** Step 1's fields, validated before Förhandsgranska. */
export const ATA_STEP_ONE_FIELD_PATHS: FieldPath<AtaFormValues>[] = [
	"client.client",
	"client.name",
	"client.address",
	"client.postalCode",
	"client.city",
	"info.heading",
	"info.subheading",
	"info.proposedAction",
	"info.action",
	"info.qualityStatus",
	"info.reason",
	"info.economyStatus",
	"info.location",
	"info.description",
];

function emptyLineItems(): AtaLineItems {
	return { staff: [], material: [], machines: [], ue: [], supplierAta: [] };
}

/**
 * A new ÄTA's draft. Beställare comes from the project record — the client, its
 * contact person and address — so the reader only corrects what differs.
 */
export function emptyAtaDraft(recordInfo: ProjectRecordInfo | null): AtaFormValues {
	const customer = recordInfo?.customer;
	const contact = recordInfo?.contactPerson;
	return {
		client: {
			client: customer?.customer ?? "",
			name: [contact?.firstName, contact?.lastName].filter(Boolean).join(" "),
			address: customer?.address ?? "",
			postalCode: customer?.postalCode ?? "",
			city: customer?.city ?? "",
		},
		info: {
			heading: "",
			subheading: "",
			proposedAction: "",
			action: "",
			qualityStatus: "",
			reason: "",
			economyStatus: "",
			location: "",
			description: "",
		},
		lineItems: emptyLineItems(),
		documents: [],
		supplierInvoiceIds: [],
		timeReportIds: [],
	};
}

/** A saved ÄTA's draft. Documents travel without their URL — only the store mints those. */
export function draftOf(ata: ProjectAta): AtaFormValues {
	return {
		client: { ...ata.client },
		info: { ...ata.info },
		lineItems: structuredClone(ata.lineItems),
		documents: ata.documents.map((doc) => ({
			id: doc.id,
			date: doc.date,
			documentName: doc.documentName,
			fileName: doc.fileName,
		})),
		supplierInvoiceIds: [...ata.supplierInvoiceIds],
		timeReportIds: [...ata.timeReportIds],
	};
}
