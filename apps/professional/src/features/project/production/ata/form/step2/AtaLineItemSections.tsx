"use client";

import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ATA_SECTIONS } from "../../projectAta.config";
import type { AtaLineItems, AtaSection } from "../../types";
import { AtaLineItemsCard } from "./AtaLineItemsCard";

export interface AtaLineItemSectionsProps {
	lineItems: AtaLineItems;
	/** Why Ändra is unavailable (a settled ÄTA), or `null`. */
	editReason: TranslationKeys | null;
	onEditSection: (section: AtaSection) => void;
	/** The Dokument card, which differs between the project's and a supplier's ÄTA. */
	children?: React.ReactNode;
}

/** "Detaljerad information": the five line-item sections, then whatever documents card follows. */
export function AtaLineItemSections({ lineItems, editReason, onEditSection, children }: AtaLineItemSectionsProps) {
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
					editReason={editReason}
					onEdit={onEditSection}
				/>
			))}
			{children}
		</section>
	);
}

export default AtaLineItemSections;
