"use client";

import { Info } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { initialsOf } from "@/components/common/QAThreadCard";
import { FormDatePicker, FormSelect, FormTextarea } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { TimeplanDetails } from "../types";
import { TIMEPLAN_DESCRIPTION_MAX_LENGTH } from "./schema";
import { TimeplanSectionCard } from "./TimeplanSectionCard";

export interface TimeplanOtherInfoCardProps {
	form: UseFormReturn<TimeplanDetails>;
	/** The project's own number, without the list's leading `#`. */
	projectNo: string;
	customer: string;
	authorName: string;
}

/** A value shown for context, not edited — grey-filled, as the frame draws it. */
function ReadOnlyField({ id, labelKey, value }: { id: string; labelKey: TranslationKeys; value: string }) {
	return (
		<div className="flex flex-col">
			<Label htmlFor={id}>
				<Translate text={labelKey} />
			</Label>
			<Input
				id={id}
				value={value}
				readOnly
				className="h-10 border-slate-200 bg-slate-100 text-slate-500 shadow-none"
			/>
		</div>
	);
}

/**
 * "Annan information" — the frame's "infomation" typo corrected.
 *
 * Order nr keeps the frame's label, as directed, though a project has no order
 * number: it shows the project's own number. Both it and Kund are read from the
 * project row so they cannot disagree with the record. "Skapat av" is written
 * Skapad av, matching the list column — *tidsplan* is an en-word.
 */
export function TimeplanOtherInfoCard({ form, projectNo, customer, authorName }: TimeplanOtherInfoCardProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);

	return (
		<TimeplanSectionCard
			icon={<Info className="h-5 w-5" />}
			titleKey={localizationConstants.projectTimeplanOtherInfoSection}
		>
			<ReadOnlyField id="timeplan-order-no" labelKey={localizationConstants.orderNrLabel} value={projectNo} />
			<ReadOnlyField id="timeplan-customer" labelKey={localizationConstants.orderKundLabel} value={customer} />

			<FormSelect
				control={form.control}
				name="createdById"
				label={localizationConstants.lblSkapadAv}
				options={[{
					value: authorName,
					label: (
						<span className="flex items-center gap-2">
							<span
								aria-hidden
								className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700"
							>
								{initialsOf(authorName)}
							</span>
							<span className="text-slate-900">{authorName}</span>
						</span>
					),
				}]}
				translateError={translateError}
			/>
			<span className="hidden sm:block" aria-hidden />

			<FormDatePicker
				control={form.control}
				name="createdDate"
				label={localizationConstants.dateHeaderLabel}
				placeholder={localizationConstants.pickDatePlaceholder}
				iconPosition="start"
				translateError={translateError}
			/>
			<FormDatePicker
				control={form.control}
				name="revisedDate"
				label={localizationConstants.projectTimeplanRevisedDate}
				placeholder={localizationConstants.pickDatePlaceholder}
				iconPosition="start"
				translateError={translateError}
			/>

			<div className="sm:col-span-2">
				<FormTextarea
					control={form.control}
					name="description"
					label={localizationConstants.projectTimeplanDescription}
					placeholder={localizationConstants.projectTimeplanDescriptionPlaceholder}
					rows={3}
					textareaProps={{ maxLength: TIMEPLAN_DESCRIPTION_MAX_LENGTH }}
				/>
			</div>
		</TimeplanSectionCard>
	);
}

export default TimeplanOtherInfoCard;
