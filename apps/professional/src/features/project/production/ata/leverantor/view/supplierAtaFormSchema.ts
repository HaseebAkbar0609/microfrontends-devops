import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { ataDocumentsSchema, ataLineItemsSchema } from "../../form/ataFormSchema";
import type { SupplierAta } from "../types";

/**
 * What the project may change on a supplier's ÄTA: its rows, its documents'
 * names and its link to one of the project's customer ÄTAs. Messages are
 * translation keys. The link must name an ÄTA the project has.
 */
export function buildSupplierAtaFormSchema(customerAtaIds: readonly string[]) {
	return z.object({
		lineItems: ataLineItemsSchema,
		documents: ataDocumentsSchema,
		linkedCustomerAtaId: z
			.string()
			.nullable()
			.refine((id) => id === null || customerAtaIds.includes(id), localizationConstants.projectAtaSupplierLinkInvalid),
	});
}

export type SupplierAtaFormValues = z.infer<ReturnType<typeof buildSupplierAtaFormSchema>>;

/** The form's starting values; an ÄTA that is not found gets an empty draft (the page 404s). */
export function supplierDraftOf(ata: SupplierAta | undefined): SupplierAtaFormValues {
	return {
		lineItems: ata
			? structuredClone(ata.lineItems)
			: { staff: [], material: [], machines: [], ue: [], supplierAta: [] },
		documents: (ata?.documents ?? []).map((doc) => ({
			id: doc.id,
			date: doc.date,
			documentName: doc.documentName,
			fileName: doc.fileName,
		})),
		linkedCustomerAtaId: ata?.linkedCustomerAtaId ?? null,
	};
}
