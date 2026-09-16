"use client";

import { useMemo, useState } from "react";
import { FilePlus } from "lucide-react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { AtaDocument, AtaDocumentInput, AtaReferenceOption } from "../../types";
import type { AtaFormValues } from "../ataFormSchema";
import { AtaCollapsibleCard } from "../step2/AtaCollapsibleCard";
import { AtaDocumentsTable } from "./AtaDocumentsTable";
import { AtaReferenceSelect } from "./AtaReferenceSelect";
import { AtaUploadRow } from "./AtaUploadRow";
import type { AtaDocumentsState } from "./useAtaDocuments";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a menu item closes; defer by a macrotask. */
const defer = (fn: () => void) => setTimeout(fn, 0);

export interface AtaDocumentsCardProps {
	form: UseFormReturn<AtaFormValues>;
	documents: AtaDocumentsState;
	/** The saved ÄTA's documents, for the URLs the store gave them. */
	stored: AtaDocument[];
	invoiceOptions: AtaReferenceOption[];
	timeReportOptions: AtaReferenceOption[];
	lockReason: TranslationKeys | null;
	translateError: (message: string) => string;
}

/**
 * Dokument: upload, the supplier invoices and time reports the ÄTA rests on,
 * and the attached files. Removing a file takes effect when the ÄTA is saved.
 */
export function AtaDocumentsCard({ form, documents, stored, invoiceOptions, timeReportOptions, lockReason, translateError }: AtaDocumentsCardProps) {
	const attached = useWatch({ control: form.control, name: "documents" });
	const [deleting, setDeleting] = useState<AtaDocumentInput | null>(null);
	const locked = Boolean(lockReason);
	const urls = useMemo(
		() => new Map(stored.flatMap((doc) => (doc.url ? [[doc.id, doc.url] as const] : []))),
		[stored],
	);

	return (
		<AtaCollapsibleCard titleKey={localizationConstants.createAtaDocuments} icon={FilePlus}>
			<div className="flex flex-col gap-5">
				{lockReason && (
					<p role="status" className="text-sm text-slate-500">
						<Translate text={lockReason} />
					</p>
				)}
				<AtaUploadRow documents={documents} disabled={locked} />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AtaReferenceSelect
						control={form.control}
						name="supplierInvoiceIds"
						labelKey={localizationConstants.projectAtaSupplierInvoices}
						chooseKey={localizationConstants.projectAtaChooseInvoices}
						options={invoiceOptions}
						disabled={locked}
					/>
					<AtaReferenceSelect
						control={form.control}
						name="timeReportIds"
						labelKey={localizationConstants.projectAtaTimeReports}
						chooseKey={localizationConstants.projectAtaChooseTimeReports}
						options={timeReportOptions}
						disabled={locked}
					/>
				</div>
				<AtaDocumentsTable
					control={form.control}
					documents={attached}
					urls={urls}
					lockReason={lockReason}
					translateError={translateError}
					onFocusName={(index) => form.setFocus(`documents.${index}.documentName`)}
					onDelete={(document) => defer(() => setDeleting(document))}
				/>
			</div>

			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.projectAtaDocumentDeleteTitle}
				description={localizationConstants.projectAtaDocumentDeleteBody}
				confirmLabel={localizationConstants.ataActionDelete}
				subject={deleting?.fileName}
				destructive
				onConfirm={() => {
					if (deleting) documents.remove(deleting.id);
					setDeleting(null);
				}}
			/>
		</AtaCollapsibleCard>
	);
}

export default AtaDocumentsCard;
