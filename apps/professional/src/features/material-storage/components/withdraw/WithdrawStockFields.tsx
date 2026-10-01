"use client";

import { useId } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { FormSelect } from "@/components/form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { MATERIAL_UNIT_LABELS } from "../../constants/materialStorage.constants";
import { useDepotArticles } from "../../hooks/useDepotArticles";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import { useMaterialStockLevel } from "../../hooks/useMaterialStockLevel";
import type { MaterialArticle, MaterialDepot } from "../../types/materialStorage.types";
import { FIT_FIELD_CLASS, FIT_SELECT_TRIGGER_CLASS, fitOptionLabel } from "../common/materialFieldFit";
import { MaterialNumberField } from "../common/MaterialNumberField";
import { MaterialPicker } from "../common/MaterialPicker";
import type { WithdrawMaterialFormValues } from "./withdrawMaterial.schema";

const NO_ARTICLES: MaterialArticle[] = [];

interface WithdrawStockFieldsProps {
	form: UseFormReturn<WithdrawMaterialFormValues>;
	depots: MaterialDepot[];
	articles: MaterialArticle[];
	onSelectArticle: (article: MaterialArticle) => void;
	onClearArticle: () => void;
}

/** The left Figma column: what leaves which depot. The material list holds only what the depot carries. */
export function WithdrawStockFields({ form, depots, articles, onSelectArticle, onClearArticle }: WithdrawStockFieldsProps) {
	const t = useTranslate();
	const unitFieldId = useId();
	const { formatQuantity } = useMaterialFormatters();
	const [depotId, articleId] = useWatch({ control: form.control, name: ["depotId", "articleId"] });
	const depotArticles = useDepotArticles(depotId, articles);
	const stockLevel = useMaterialStockLevel(articleId, depotId);
	const unit = articles.find((article) => article.id === articleId)?.unit;

	return (
		<div className="flex flex-col gap-5">
			<FormSelect
				control={form.control}
				name="depotId"
				label={localizationConstants.materialDepotLabel}
				placeholder={localizationConstants.materialDepotPlaceholder}
				options={depots.map((depot) => ({ value: depot.id, label: fitOptionLabel(depot.name) }))}
				required
				className={FIT_FIELD_CLASS}
				triggerClassName={FIT_SELECT_TRIGGER_CLASS}
			/>

			<FormField
				control={form.control}
				name="articleId"
				render={({ fieldState }) => (
					<FormItem className={cn("grid gap-1", FIT_FIELD_CLASS)}>
						<FormLabel>
							{t(localizationConstants.materialFieldMaterial)}
							<span className="text-red-500" aria-hidden>
								*
							</span>
						</FormLabel>
						<FormControl>
							<MaterialPicker
								value={articleId}
								articles={depotArticles ?? NO_ARTICLES}
								onSelect={onSelectArticle}
								onClear={onClearArticle}
								disabled={!depotId || !depotArticles}
								hasError={Boolean(fieldState.error)}
								aria-required
							/>
						</FormControl>
						{unit && stockLevel && (
							<FormDescription className="text-xs text-slate-600">
								{t(localizationConstants.materialAvailableBalance, {
									quantity: formatQuantity(stockLevel.available, unit),
								})}
							</FormDescription>
						)}
						<FormMessage translate={t} />
					</FormItem>
				)}
			/>

			<MaterialNumberField
				control={form.control}
				name="quantity"
				label={localizationConstants.materialFieldQuantity}
				placeholder={localizationConstants.materialQuantityPlaceholder}
				required
			/>

			<div className="grid gap-1">
				<Label htmlFor={unitFieldId}>{t(localizationConstants.materialFieldUnit)}</Label>
				<Input id={unitFieldId} readOnly value={unit ? t(MATERIAL_UNIT_LABELS[unit]) : ""} className="bg-white" />
			</div>
		</div>
	);
}
