"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleDetail } from "../../../../types/article.types";
import { ArticleDetailSectionCard } from "../ArticleDetailSectionCard";

interface ArticleStruktureradInfoTabProps {
	readonly article: ArticleDetail;
	readonly onEdit: () => void;
}

export function ArticleStruktureradInfoTab({
	article,
	onEdit,
}: ArticleStruktureradInfoTabProps) {
	const pricesItems = [
		{ label: localizationConstants.articlePriserA, value: article.priserA },
		{ label: localizationConstants.articleEuroprislista, value: article.europrislista },
		{ label: localizationConstants.articleKampanj, value: article.kampanj },
		{ label: localizationConstants.articleVipPriser, value: article.vipPriser },
		{ label: localizationConstants.articleKalkylkostnad, value: article.kalkylkostnad },
	];

	const orderWarehouseItems = [
		{ label: localizationConstants.articleBestallningspunkt, value: article.bestallningspunkt },
		{ label: localizationConstants.articleILager, value: article.iLager },
		{ label: localizationConstants.articleViktLabel, value: article.vikt },
		{ label: localizationConstants.articleLangdLabel, value: article.langd },
		{ label: localizationConstants.articleBreddLabel, value: article.bredd },
		{ label: localizationConstants.articleHojdLabel, value: article.hojd },
		{ label: localizationConstants.articleMaterialLabel, value: article.material },
	];

	const accountingItems = [
		{
			label: localizationConstants.articleForsaljningSELabel,
			value: article.forsaljningSESkattskyldighet,
		},
		{
			label: localizationConstants.articleMomsLabel,
			value: article.momsSESkattskyldighet,
		},
		{
			label: localizationConstants.articleForsaljningEULabel,
			value: article.forsaljningEUSkattskyldighet,
		},
		{
			label: localizationConstants.articleLagerforandringLabel,
			value: article.lagerforandring,
		},
	];

	return (
		<div className="flex flex-col gap-6 pt-4">
			<ArticleDetailSectionCard
				title={localizationConstants.createArticlePriserSection}
				items={pricesItems}
				onEdit={onEdit}
			/>

			<ArticleDetailSectionCard
				title={localizationConstants.createArticleLagerplatsSection}
				items={orderWarehouseItems}
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
