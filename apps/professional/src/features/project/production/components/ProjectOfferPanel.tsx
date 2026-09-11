"use client";

import {
	InfoField,
	InfoFieldGrid,
} from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { AttachedDocumentsTable } from "../../create/components/AttachedDocumentsTable";
import { toInfoPairs } from "../../shared/projectInfoFields";
import {
	OFFER_COMPANY_FIELDS,
	OFFER_CUSTOMER_FIELDS,
	OFFER_DESCRIPTION_FIELDS,
	OFFER_ROT_SETTLED_LABEL,
	OFFER_TERM_FIELDS,
} from "../offerFields";
import type { ProjectRecordInfo } from "../types";

export interface ProjectOfferPanelProps {
	info: ProjectRecordInfo;
	onRenameDocument: (id: string, name: string) => void;
	onRemoveDocument: (id: string) => void;
}

/** Renders one card's `[label, value]` pairs. */
function OfferCard({
	titleKey,
	pairs,
	children,
}: {
	titleKey: TranslationKeys;
	pairs: [TranslationKeys, string | undefined][];
	children?: React.ReactNode;
}) {
	return (
		<InfoFieldGrid titleKey={titleKey} columns={2}>
			{pairs.map(([labelKey, value]) => (
				<InfoField key={labelKey} labelKey={labelKey} value={value} />
			))}
			{children}
		</InfoFieldGrid>
	);
}

/**
 * Offert — the offer as it stands for this project.
 *
 * Read-only, as the frame draws it: no card here carries the pencil that the
 * Projektuppgifter tab's cards do. Only the document list is interactive.
 *
 * The Order module's equivalent falls back to an inline dummy record when a
 * record has no offer — "Exempel Bygg AB", offer 1234, "10 000 kr" — so an
 * empty offer renders as a fabricated one. Here an absent field stays empty and
 * `InfoField` shows the missing-value mark.
 */
export function ProjectOfferPanel({
	info,
	onRenameDocument,
	onRemoveDocument,
}: ProjectOfferPanelProps) {
	const t = useTranslate();
	const { customer, company, projectDescription, offer, documents } = info;

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<OfferCard
					titleKey={localizationConstants.customerDetailsSection}
					pairs={toInfoPairs(OFFER_CUSTOMER_FIELDS, customer)}
				/>
				<OfferCard
					titleKey={localizationConstants.projectCompanyDetailsSection}
					pairs={toInfoPairs(OFFER_COMPANY_FIELDS, company)}
				/>
			</div>

			<OfferCard
				titleKey={localizationConstants.projectDescriptionSection}
				pairs={toInfoPairs(OFFER_DESCRIPTION_FIELDS, projectDescription)}
			/>

			<OfferCard
				titleKey={localizationConstants.offerTab}
				pairs={toInfoPairs(OFFER_TERM_FIELDS, offer)}
			>
				{/* A boolean rather than the literal "ja" the Order module stores,
				    so it reads correctly in both languages. */}
				<InfoField
					labelKey={OFFER_ROT_SETTLED_LABEL}
					value={t(
						offer.rotDeductionSettled
							? localizationConstants.commonYes
							: localizationConstants.commonNo,
					)}
				/>
			</OfferCard>

			<AttachedDocumentsTable
				documents={documents}
				onRename={onRenameDocument}
				onRemove={onRemoveDocument}
			/>
		</div>
	);
}

export default ProjectOfferPanel;
