"use client";

import { Pencil } from "lucide-react";

import {
	InfoField,
	InfoFieldGrid,
} from "@/features/purchase/components/shared/InfoFieldGrid";
import { Button } from "@/components/ui/button";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	CONTACT_FIELDS,
	CUSTOMER_FIELDS,
	PROJECT_FIELDS,
	PROJECT_INFO_FIELDS,
	toInfoPairs,
} from "../../shared/projectInfoFields";
import type { ProjectInfoSectionKey, ProjectRecordInfo } from "../types";

export interface ProjectInfoCardsProps {
	info: ProjectRecordInfo;
	onEdit: (section: ProjectInfoSectionKey) => void;
}

/** The frame's 2x2 grid of read-only cards, each with a pencil. */
export function ProjectInfoCards({ info, onEdit }: ProjectInfoCardsProps) {
	const t = useTranslate();

	const cards: {
		key: ProjectInfoSectionKey;
		titleKey: TranslationKeys;
		pairs: [TranslationKeys, string | undefined][];
	}[] = [
		{
			key: "customer",
			titleKey: localizationConstants.orderKunduppgifterSection,
			pairs: toInfoPairs(CUSTOMER_FIELDS, info.customer),
		},
		{
			key: "contact",
			titleKey: localizationConstants.orderKontaktpersonSection,
			pairs: toInfoPairs(CONTACT_FIELDS, info.contactPerson),
		},
		{
			key: "project",
			titleKey: localizationConstants.projectLabel,
			pairs: toInfoPairs(PROJECT_FIELDS, info.details),
		},
		{
			key: "projectInfo",
			titleKey: localizationConstants.projectCreateInfoSection,
			pairs: toInfoPairs(PROJECT_INFO_FIELDS, info.details),
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{cards.map((card) => (
				<InfoFieldGrid
					key={card.key}
					titleKey={card.titleKey}
					columns={2}
					action={
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => onEdit(card.key)}
							/* Named per card — four unlabelled pencils are
							   indistinguishable to a screen reader. */
							aria-label={`${t(localizationConstants.actionEdit)} ${t(card.titleKey)}`}
							className="h-8 w-8 cursor-pointer rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
						>
							<Pencil className="h-3.5 w-3.5" />
						</Button>
					}
				>
					{card.pairs.map(([labelKey, value]) => (
						<InfoField key={labelKey} labelKey={labelKey} value={value} />
					))}
				</InfoFieldGrid>
			))}
		</div>
	);
}

export default ProjectInfoCards;
