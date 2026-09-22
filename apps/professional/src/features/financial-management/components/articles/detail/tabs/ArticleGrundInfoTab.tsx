"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleDetail } from "../../../../types/article.types";
import { ArticleDetailSectionCard } from "../ArticleDetailSectionCard";
import { ArticlePriceListTable } from "../ArticlePriceListTable";

interface ArticleGrundInfoTabProps {
	readonly article: ArticleDetail;
	readonly onEdit: () => void;
}

export function ArticleGrundInfoTab({ article, onEdit }: ArticleGrundInfoTabProps) {
	const basicItems = [
		{ label: localizationConstants.articleNrLabel, value: article.articleNo },
		{ label: localizationConstants.articleBenamningLabel, value: article.benamning },
		{ label: localizationConstants.articleEanLabel, value: article.ean },
		{ label: localizationConstants.articleLeverantorLabel, value: article.leverantor },
		{ label: localizationConstants.articleEnhetLabel, value: article.enhet },
		{ label: localizationConstants.articleTypAvArtikelLabel, value: article.typAvArtikel },
		{
			label: localizationConstants.statusLabel,
			value:
				article.status === "active"
					? localizationConstants.activeStatus
					: localizationConstants.inactiveStatus,
			isBadge: true,
			badgeVariant: (article.status === "active" ? "success" : "secondary") as
				| "success"
				| "secondary",
		},
	];

	const accountingItems = [
		{ label: localizationConstants.articleForsaljningLabel, value: article.forsaljning },
		{ label: localizationConstants.articleMomsLabel, value: article.moms },
		{ label: localizationConstants.articleForsaljningSELabel, value: article.forsaljningSE },
		{ label: localizationConstants.articleForsaljningEULabel, value: article.forsaljningEU },
		{ label: localizationConstants.articleLagerkontoLabel, value: article.lagerkonto },
		{ label: localizationConstants.articleInkopLabel, value: article.inkop },
	];

	return (
		<div className="flex flex-col gap-6 pt-4">
			<ArticleDetailSectionCard
				title={localizationConstants.createArticleGrundInfoSection}
				items={basicItems}
				onEdit={onEdit}
			/>

			<ArticlePriceListTable
				rows={article.priceListRows}
				onEdit={onEdit}
			/>

			<ArticleDetailSectionCard
				title={localizationConstants.createArticleBokforingsUppgifterSection}
				items={accountingItems}
				onEdit={onEdit}
			/>
		</div>
	);
}
