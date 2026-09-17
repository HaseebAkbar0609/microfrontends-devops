"use client";

import { Timer } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { FormDatePicker, FormSelect } from "@/components/form";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { TIMEPLAN_KINDS, TIMEPLAN_TYPES } from "../timeplan.config";
import type { TimeplanDetails } from "../types";
import { TimeplanSectionCard } from "./TimeplanSectionCard";

export interface TimeplanDetailsCardProps {
	form: UseFormReturn<TimeplanDetails>;
}

/**
 * The "Tidsplan" card: which plan, its type, and the range it covers.
 *
 * Typ is enabled, as the Swedish frame draws it; the variant with Typ greyed out
 * and English labels is treated as a stale duplicate. Slut datum's picker starts
 * at the chosen start date, and the schema rejects an inverted range anyway,
 * since the value can arrive by other routes than the picker.
 */
export function TimeplanDetailsCard({ form }: TimeplanDetailsCardProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);
	const startDate = form.watch("startDate");

	return (
		<TimeplanSectionCard
			icon={<Timer className="h-5 w-5" />}
			titleKey={localizationConstants.projectSectionTidsplan}
		>
			<FormSelect
				control={form.control}
				name="kind"
				label={localizationConstants.projectSectionTidsplan}
				options={TIMEPLAN_KINDS.map((kind) => ({
					value: kind.value,
					label: <Translate text={kind.labelKey} />,
				}))}
				translateError={translateError}
			/>
			<FormSelect
				control={form.control}
				name="type"
				label={localizationConstants.orderTypLabel}
				options={TIMEPLAN_TYPES.map((type) => ({
					value: type.value,
					label: <Translate text={type.labelKey} />,
				}))}
				translateError={translateError}
			/>
			<FormDatePicker
				control={form.control}
				name="startDate"
				label={localizationConstants.orderStartDatumLabel}
				placeholder={localizationConstants.pickDatePlaceholder}
				iconPosition="start"
				translateError={translateError}
			/>
			<FormDatePicker
				control={form.control}
				name="endDate"
				label={localizationConstants.orderSlutDatumLabel}
				placeholder={localizationConstants.pickDatePlaceholder}
				iconPosition="start"
				minDate={startDate}
				translateError={translateError}
			/>
		</TimeplanSectionCard>
	);
}

export default TimeplanDetailsCard;
