"use client";

import {
	QAThreadCreateDialog,
	type QAThreadCreateDialogLabels,
	type QAThreadOption,
} from "@/components/common/QAThreadCreateDialog";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { PurchaseQaDraft } from "../../hooks/usePurchaseQaBoard";

const TYPES: QAThreadOption[] = [
	{ value: "purchase", label: localizationConstants.purchaseQaTypePurchase },
	{ value: "order", label: localizationConstants.purchaseQaTypeOrder },
];

const SUBJECTS: QAThreadOption[] = [
	{ value: "delivery", label: localizationConstants.purchaseQaSubjectDelivery },
	{ value: "price", label: localizationConstants.purchaseQaSubjectPrice },
	{ value: "quality", label: localizationConstants.purchaseQaSubjectQuality },
];

const LABELS: QAThreadCreateDialogLabels = {
	title: localizationConstants.purchaseQaCreateTitle,
	type: localizationConstants.purchaseQaFieldType,
	subject: localizationConstants.purchaseQaFieldSubject,
	subjectPlaceholder: localizationConstants.purchaseQaSubjectPlaceholder,
	description: localizationConstants.purchaseQaFieldDescription,
	cancel: localizationConstants.cancelButton,
	send: localizationConstants.purchaseComplaintQaSend,
};

export interface PurchaseQaCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (draft: PurchaseQaDraft) => void;
}

/**
 * "Skapa ny fråga" on the purchase board: the shared `QAThreadCreateDialog`
 * with Inköp / Order and the Ämne list. The chosen subject is handed on as its
 * label, which the board prefixes to the message.
 */
export function PurchaseQaCreateDialog({
	open,
	onOpenChange,
	onSubmit,
}: PurchaseQaCreateDialogProps) {
	const t = useTranslate();

	return (
		<QAThreadCreateDialog
			open={open}
			onOpenChange={onOpenChange}
			typeOptions={TYPES}
			subjectOptions={SUBJECTS}
			labels={LABELS}
			onSubmit={(draft) => {
				const subject = SUBJECTS.find((item) => item.value === draft.subject);
				onSubmit({ ...draft, subject: subject ? t(subject.label) : "" });
			}}
		/>
	);
}

export default PurchaseQaCreateDialog;
