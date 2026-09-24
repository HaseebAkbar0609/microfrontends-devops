"use client";

import { LayoutGrid } from "lucide-react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import { FormDatePicker, FormSelect } from "@/components/form";
import { initialsOf } from "@/components/common/qaThread";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RecordCollapsibleCard } from "../../../components/RecordCollapsibleCard";
import { constructionDay } from "../../diaryDates";
import type { DiaryProjectFacts } from "../../hooks/useDiaryProject";
import type { ProjectPerson } from "../../../hooks/useProjectPeople";
import type { DiaryWizardValues } from "../wizardSchema";

export interface WizardOverviewCardProps {
	form: UseFormReturn<DiaryWizardValues>;
	facts: DiaryProjectFacts;
	people: ProjectPerson[];
}

/** A field the project decides: shown as the frame draws it, disabled. */
function ReadOnlyField({ id, labelKey, value }: { id: string; labelKey: TranslationKeys; value: string }) {
	return (
		<div className="grid gap-1">
			<Label htmlFor={id}>
				<Translate text={labelKey} />
			</Label>
			<Input id={id} value={value || "—"} disabled className="h-10 bg-slate-100" />
		</div>
	);
}

/**
 * Step 1's "Övergripande information": what the project already knows, who is
 * writing the diary, and which day it covers. Byggdag follows the date.
 */
export function WizardOverviewCard({ form, facts, people }: WizardOverviewCardProps) {
	const t = useTranslate();
	const date = useWatch({ control: form.control, name: "date" });
	const day = date ? constructionDay(facts.startDate, facts.endDate, date) : null;

	const options = people.map((person) => ({
		value: person.name,
		searchLabel: `${person.name} ${person.handle}`,
		label: (
			<span className="flex items-center gap-2">
				<span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700">
					{initialsOf(person.name)}
				</span>
				<span className="text-slate-900">{person.name}</span>
				<span className="text-slate-500">{person.handle}</span>
			</span>
		),
	}));

	return (
		<RecordCollapsibleCard titleKey={localizationConstants.projectDiaryWizardOverview} icon={LayoutGrid} contentClassName="grid gap-4 sm:grid-cols-2">
			<ReadOnlyField id="diary-wizard-project" labelKey={localizationConstants.projectDiaryProjectLabel} value={facts.name} />
			<ReadOnlyField id="diary-wizard-project-no" labelKey={localizationConstants.projectDiaryProjectNo} value={facts.projectNo} />
			<ReadOnlyField id="diary-wizard-address" labelKey={localizationConstants.projectDiaryAddress} value={facts.address} />

			<FormSelect
				control={form.control}
				name="createdBy"
				label={localizationConstants.projectDiaryFieldCreatedBy}
				placeholder={localizationConstants.projectDiarySelectPlaceholder}
				options={options}
				searchable
				searchPlaceholder={t(localizationConstants.projectDiaryFieldCreatedBy)}
				translateError={(message) => t(message as TranslationKeys)}
			/>

			<FormDatePicker
				control={form.control}
				name="date"
				label={
					<>
						<Translate text={localizationConstants.projectDiaryDate} />
						<span aria-hidden className="text-red-500">
							*
						</span>
					</>
				}
				iconPosition="start"
				translateError={(message) => t(message as TranslationKeys)}
			/>

			<div className="grid gap-1">
				<span className="text-sm font-medium text-slate-900">
					<Translate text={localizationConstants.projectDiaryConstructionDay} />
				</span>
				<p aria-live="polite" className="flex h-10 items-center text-sm text-slate-500 tabular-nums">
					{day ? `${day.day}/${day.total}` : "—"}
				</p>
			</div>
		</RecordCollapsibleCard>
	);
}

export default WizardOverviewCard;
