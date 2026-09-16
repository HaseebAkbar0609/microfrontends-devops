"use client";

import { useWatch } from "react-hook-form";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ATA_SECTIONS } from "../../projectAta.config";
import type { AtaSection } from "../../types";
import { AtaDocumentsCard, type AtaDocumentsCardProps } from "../documents/AtaDocumentsCard";
import { AtaLineItemsCard } from "./AtaLineItemsCard";

export interface AtaDetailSectionsProps extends AtaDocumentsCardProps {
	onEditSection: (section: AtaSection) => void;
}

/** "Detaljerad information": the five line-item sections, then Dokument. */
export function AtaDetailSections({ onEditSection, ...documentsCard }: AtaDetailSectionsProps) {
	const lineItems = useWatch({ control: documentsCard.form.control, name: "lineItems" });

	return (
		<section className="flex flex-col gap-4">
			<h2 className="pt-4 text-xl font-semibold text-slate-900">
				<Translate text={localizationConstants.createAtaDetailedInfo} />
			</h2>
			{ATA_SECTIONS.map((section) => (
				<AtaLineItemsCard
					key={section}
					section={section}
					items={lineItems[section]}
					editReason={documentsCard.lockReason}
					onEdit={onEditSection}
				/>
			))}
			<AtaDocumentsCard {...documentsCard} />
		</section>
	);
}

export default AtaDetailSections;
