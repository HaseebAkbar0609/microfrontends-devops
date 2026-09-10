"use client";

import { useState } from "react";
import { ChevronDown, Pencil } from "lucide-react";

import {
	InfoField,
	InfoFieldGrid,
} from "@/features/purchase/components/shared/InfoFieldGrid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { ProjectCreateStep } from "../constants";
import { buildSummarySections } from "../summarySections";
import type { CreateProjectFormData, ProjectContactPerson } from "../types";
import { OrganisationInfoDialog } from "../components/OrganisationInfoDialog";
import { SummaryDocumentsCard } from "../components/SummaryDocumentsCard";
import { SummaryOrganisationCard } from "../components/SummaryOrganisationCard";

export interface Step5SummaryProps {
	data: CreateProjectFormData;
	onEditSection: (step: ProjectCreateStep) => void;
}

/**
 * Sammanställning — everything collected, read-only, one collapsible card per
 * section with a pencil back to the step that owns it.
 *
 * Built on the shared `InfoFieldGrid`, so an empty field renders the em-dash
 * with an `sr-only` "Saknas" rather than a literal "-" that a screen reader
 * announces as a hyphen.
 */
export function Step5Summary({ data, onEditSection }: Step5SummaryProps) {
	const t = useTranslate();
	const [closedSections, setClosedSections] = useState<Record<string, boolean>>(
		{},
	);
	const [infoContact, setInfoContact] = useState<ProjectContactPerson | null>(
		null,
	);
	const [isInfoOpen, setIsInfoOpen] = useState(false);

	const isOpen = (key: string) => !closedSections[key];

	const toggle = (key: string) =>
		setClosedSections((previous) => ({
			...previous,
			[key]: !previous[key],
		}));

	/** The pencil and chevron every section header carries. */
	const sectionActions = (
		key: string,
		step: ProjectCreateStep,
		labelKey: TranslationKeys,
	) => (
		<div className="flex items-center gap-1">
			<Button
				type="button"
				variant="outline"
				size="icon"
				onClick={() => onEditSection(step)}
				aria-label={`${t(localizationConstants.actionEdit)} ${t(labelKey)}`}
				className="h-8 w-8 cursor-pointer rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
			>
				<Pencil className="h-3.5 w-3.5" />
			</Button>
			<Button
				type="button"
				variant="outline"
				size="icon"
				onClick={() => toggle(key)}
				aria-expanded={isOpen(key)}
				aria-label={t(labelKey)}
				className="h-8 w-8 cursor-pointer rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
			>
				<ChevronDown
					className={cn(
						"h-3.5 w-3.5 transition-transform",
						isOpen(key) && "rotate-180",
					)}
				/>
			</Button>
		</div>
	);

	return (
		<div className="space-y-4">
			{buildSummarySections(data).map((section) => (
				<InfoFieldGrid
					key={section.key}
					titleKey={section.titleKey}
					columns={2}
					collapsed={!isOpen(section.key)}
					action={sectionActions(
						section.key,
						section.step,
						section.titleKey,
					)}
				>
					{section.fields.map(([labelKey, value]) => (
						<InfoField key={labelKey} labelKey={labelKey} value={value} />
					))}
				</InfoFieldGrid>
			))}

			<SummaryDocumentsCard
				documents={data.documents}
				isOpen={isOpen("documents")}
				action={sectionActions(
					"documents",
					3,
					localizationConstants.orderDokumentSection,
				)}
			/>

			<SummaryOrganisationCard
				organisation={data.organisation}
				isOpen={isOpen("organisation")}
				action={sectionActions(
					"organisation",
					4,
					localizationConstants.orderOrganisationTab,
				)}
				onShowInfo={(contact) => {
					setInfoContact(contact);
					setIsInfoOpen(true);
				}}
			/>

			<OrganisationInfoDialog
				isOpen={isInfoOpen}
				organisation={data.organisation}
				contact={infoContact}
				onClose={() => setIsInfoOpen(false)}
			/>
		</div>
	);
}

export default Step5Summary;
