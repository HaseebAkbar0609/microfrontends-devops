"use client";

import { useId } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { FormDatePicker, FormInput, FormSelect } from "@/components/form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { MATERIAL_TEXT_LIMITS, MATERIAL_UNIT_LABELS } from "../../constants/materialStorage.constants";
import type { MaterialArticle, MaterialDepot } from "../../types/materialStorage.types";
import { todayIso } from "../../utils/materialDates";
import { MaterialNumberField } from "../common/MaterialNumberField";
import { MaterialPicker } from "../common/MaterialPicker";
import type { ReceiveMaterialFormValues } from "./receiveMaterial.schema";

interface ReceiveMaterialFieldsProps {
	form: UseFormReturn<ReceiveMaterialFormValues>;
	depots: MaterialDepot[];
	articles: MaterialArticle[];
	suppliers: string[];
	onSelectArticle: (article: MaterialArticle) => void;
}

/**
 * The two Figma columns. Fields are listed row by row (left, right) so the
 * columns stay aligned when one side shows an error; items-start keeps the other
 * side from stretching to that row's height, which would push its input down.
 */
export function ReceiveMaterialFields({ form, depots, articles, suppliers, onSelectArticle }: ReceiveMaterialFieldsProps) {
	const t = useTranslate();
	const unitFieldId = useId();
	const articleId = useWatch({ control: form.control, name: "articleId" });
	const unit = articles.find((article) => article.id === articleId)?.unit;

	return (
		<div className="grid grid-cols-1 items-start gap-x-8 gap-y-4 sm:grid-cols-2">
			<FormSelect
				control={form.control}
				name="depotId"
				label={localizationConstants.materialDepotLabel}
				placeholder={localizationConstants.materialDepotPlaceholder}
				options={depots.map((depot) => ({ value: depot.id, label: depot.name }))}
				required
			/>
			<FormSelect
				control={form.control}
				name="supplierName"
				label={localizationConstants.materialFieldSupplier}
				placeholder={localizationConstants.materialSupplierPlaceholder}
				options={suppliers.map((supplier) => ({ value: supplier, label: supplier }))}
			/>

			<FormField
				control={form.control}
				name="articleId"
				render={({ fieldState }) => (
					<FormItem className="grid gap-1">
						<FormLabel>
							{t(localizationConstants.materialFieldMaterial)}
							<span className="text-red-500" aria-hidden>
								*
							</span>
						</FormLabel>
						<FormControl>
							<MaterialPicker
								value={articleId}
								articles={articles}
								onSelect={onSelectArticle}
								hasError={Boolean(fieldState.error)}
								aria-required
							/>
						</FormControl>
						<FormMessage translate={t} />
					</FormItem>
				)}
			/>
			<MaterialNumberField
				control={form.control}
				name="unitPrice"
				label={localizationConstants.materialFieldUnitPrice}
				suffix={t(localizationConstants.materialCurrencySuffix)}
			/>

			<MaterialNumberField
				control={form.control}
				name="quantity"
				label={localizationConstants.materialFieldQuantity}
				placeholder={localizationConstants.materialQuantityPlaceholder}
				required
			/>
			<FormDatePicker
				control={form.control}
				name="deliveryDate"
				label={localizationConstants.materialFieldDeliveryDate}
				iconPosition="start"
				maxDate={todayIso()}
			/>

			<div className="grid gap-1">
				<Label htmlFor={unitFieldId}>{t(localizationConstants.materialFieldUnit)}</Label>
				<Input id={unitFieldId} readOnly value={unit ? t(MATERIAL_UNIT_LABELS[unit]) : ""} className="bg-white" />
			</div>
			<FormInput
				control={form.control}
				name="supplierOrderNo"
				label={localizationConstants.materialFieldSupplierOrderNo}
				placeholder={localizationConstants.materialOrderNoPlaceholder}
				inputProps={{ maxLength: MATERIAL_TEXT_LIMITS.supplierOrderNo, autoComplete: "off" }}
			/>
		</div>
	);
}
