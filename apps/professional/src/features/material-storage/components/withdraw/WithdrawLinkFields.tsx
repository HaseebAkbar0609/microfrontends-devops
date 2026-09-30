"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";
import { FormSelect } from "@/components/form";
import { FormField, FormItem } from "@/components/ui/form";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { WITHDRAWAL_LINK_OPTIONS, WITHDRAWAL_TARGET_TEXT } from "../../constants/materialStorage.constants";
import { useWithdrawalLinkOptions } from "../../hooks/useWithdrawalLinkOptions";
import { WITHDRAWAL_LINK_RULES } from "../../utils/materialWithdrawal";
import { MaterialNumberField } from "../common/MaterialNumberField";
import type { WithdrawMaterialFormValues } from "./withdrawMaterial.schema";

interface WithdrawLinkFieldsProps {
	form: UseFormReturn<WithdrawMaterialFormValues>;
}

/**
 * The right Figma column: what the material is taken out for. "Koppla till"
 * decides which fields follow (see WITHDRAWAL_LINK_RULES); Internt uttag needs none.
 */
export function WithdrawLinkFields({ form }: WithdrawLinkFieldsProps) {
	const t = useTranslate();
	const [linkType, linkId] = useWatch({ control: form.control, name: ["linkType", "linkId"] });
	const { targets, workSteps } = useWithdrawalLinkOptions(linkType, linkId);
	const rules = WITHDRAWAL_LINK_RULES[linkType];

	return (
		<div className="flex flex-col gap-5">
			<FormField
				control={form.control}
				name="linkType"
				render={({ field }) => (
					<FormItem className="grid gap-1">
						{/* The switch is named by aria-label; this is the visible label it matches. */}
						<p className="mb-1 flex items-center gap-2 text-sm leading-5 font-medium text-gray-700" aria-hidden>
							{t(localizationConstants.materialFieldLinkTo)}
							<span className="text-red-500">*</span>
						</p>
						<SegmentedToggle
							variant="boxed"
							options={WITHDRAWAL_LINK_OPTIONS}
							value={field.value}
							onChange={field.onChange}
							ariaLabel={t(localizationConstants.materialFieldLinkTo)}
							className="flex w-full"
							buttonClassName="flex-auto whitespace-nowrap px-2 sm:px-3"
						/>
					</FormItem>
				)}
			/>

			{linkType !== "internal" && (
				<FormSelect
					control={form.control}
					name="linkId"
					label={WITHDRAWAL_TARGET_TEXT[linkType].label}
					placeholder={WITHDRAWAL_TARGET_TEXT[linkType].placeholder}
					options={targets.map((target) => ({ value: target.id, label: `${target.reference} – ${target.name}` }))}
					required
				/>
			)}

			{rules.hasWorkStep && (
				<FormSelect
					control={form.control}
					name="workStepId"
					label={localizationConstants.materialFieldWorkStep}
					placeholder={localizationConstants.materialWorkStepPlaceholder}
					options={workSteps.map((step) => ({ value: step.id, label: step.name }))}
					disabled={!linkId}
				/>
			)}

			{rules.hasSalesPrice && (
				<MaterialNumberField
					control={form.control}
					name="salesPrice"
					label={localizationConstants.materialFieldSalesPrice}
					suffix={t(localizationConstants.materialCurrencySuffix)}
				/>
			)}
		</div>
	);
}
