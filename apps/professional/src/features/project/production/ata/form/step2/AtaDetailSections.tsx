"use client";

import { useWatch } from "react-hook-form";

import type { AtaSection } from "../../types";
import { AtaDocumentsCard, type AtaDocumentsCardProps } from "../documents/AtaDocumentsCard";
import { AtaLineItemSections } from "./AtaLineItemSections";

export interface AtaDetailSectionsProps extends AtaDocumentsCardProps {
	onEditSection: (section: AtaSection) => void;
}

/** Step 2's "Detaljerad information" on the project's own ÄTA: the five sections, then Dokument. */
export function AtaDetailSections({ onEditSection, ...documentsCard }: AtaDetailSectionsProps) {
	const lineItems = useWatch({ control: documentsCard.form.control, name: "lineItems" });

	return (
		<AtaLineItemSections lineItems={lineItems} editReason={documentsCard.lockReason} onEditSection={onEditSection}>
			<AtaDocumentsCard {...documentsCard} />
		</AtaLineItemSections>
	);
}

export default AtaDetailSections;
