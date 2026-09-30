"use client";

import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { MATERIAL_CATEGORY_LABELS, MATERIAL_UNIT_LABELS } from "../../constants/materialStorage.constants";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import type { MaterialArticle, MaterialDepot } from "../../types/materialStorage.types";
import { ArticleCard } from "./ArticleCard";

/** "Artikelinformation": the article's register fields, labels in a column on the left as in Figma. */
export function ArticleInfoCard({ article, depots }: { article: MaterialArticle; depots: MaterialDepot[] }) {
	const t = useTranslate();
	const { formatQuantity } = useMaterialFormatters();

	const rows: [TranslationKeys, string][] = [
		[localizationConstants.materialColCategory, t(MATERIAL_CATEGORY_LABELS[article.categoryId])],
		[localizationConstants.materialFieldUnit, t(MATERIAL_UNIT_LABELS[article.unit])],
		[localizationConstants.materialFieldDescription, article.description],
		[localizationConstants.materialFieldSupplier, article.supplierName],
		[localizationConstants.materialFieldSupplierArticleNo, article.supplierArticleNo],
		[localizationConstants.materialFieldEan, article.ean],
		[localizationConstants.materialKpiReorderPoint, formatQuantity(article.reorderPoint, article.unit)],
		[
			localizationConstants.materialFieldDefaultDepot,
			depots.find((depot) => depot.id === article.defaultDepotId)?.name ?? "",
		],
	];

	return (
		<ArticleCard title={localizationConstants.materialArticleInfo} className="h-full">
			<dl>
				{rows.map(([label, value]) => (
					<div
						key={label}
						className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 border-b border-slate-100 py-2.5 text-sm last:border-b-0"
					>
						<dt className="text-slate-600">
							<Translate text={label} />
						</dt>
						<dd className="break-words text-slate-900">{value}</dd>
					</div>
				))}
			</dl>
		</ArticleCard>
	);
}
