"use client";

import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { MATERIAL_UNIT_LABELS } from "../../constants/materialStorage.constants";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import type { MaterialArticle } from "../../types/materialStorage.types";
import { grossMarginPercent, markupPercent } from "../../utils/materialStockEvents";
import { ArticleCard, ArticleCardRow } from "./ArticleCard";

/** Shown for a percentage that cannot be worked out (a price of 0). */
const NO_VALUE = "–";

/** "Pris": prices per unit, and Påslag and Bruttomarginal worked out from them. */
export function ArticlePriceCard({ article }: { article: MaterialArticle }) {
	const t = useTranslate();
	const { formatPrice, formatPercent } = useMaterialFormatters();
	const perUnit = (price: number) =>
		t(localizationConstants.materialPricePerUnit, { price: formatPrice(price), unit: t(MATERIAL_UNIT_LABELS[article.unit]) });
	const percent = (value: number | null) => (value === null ? NO_VALUE : formatPercent(value));

	return (
		<ArticleCard title={localizationConstants.materialPriceCard} className="h-full">
			<dl>
				<ArticleCardRow label={localizationConstants.materialColPurchasePrice}>{perUnit(article.purchasePrice)}</ArticleCardRow>
				<ArticleCardRow label={localizationConstants.materialColSalesPrice}>{perUnit(article.salesPrice)}</ArticleCardRow>
				<ArticleCardRow label={localizationConstants.materialMarkup}>
					{percent(markupPercent(article.purchasePrice, article.salesPrice))}
				</ArticleCardRow>
				<ArticleCardRow label={localizationConstants.materialGrossMargin}>
					{percent(grossMarginPercent(article.purchasePrice, article.salesPrice))}
				</ArticleCardRow>
			</dl>
		</ArticleCard>
	);
}
