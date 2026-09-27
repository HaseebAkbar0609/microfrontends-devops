"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleDetail } from "../../../../types/article.types";
import {
	ArticleDetailSectionCard,
	type ArticleDetailFieldItem,
} from "../ArticleDetailSectionCard";

interface ArticleStruktureradInfoTabProps {
	readonly article: ArticleDetail;
	readonly onUpdate: (updates: Partial<ArticleDetail>) => void;
}

export function ArticleStruktureradInfoTab({
	article,
	onUpdate,
}: ArticleStruktureradInfoTabProps) {
	const pricesItems: ArticleDetailFieldItem[] = [
		{ key: "priserA", label: localizationConstants.articlePriserA, value: article.priserA },
		{ key: "europrislista", label: localizationConstants.articleEuroprislista, value: article.europrislista },
		{ key: "kampanj", label: localizationConstants.articleKampanj, value: article.kampanj },
		{ key: "vipPriser", label: localizationConstants.articleVipPriser, value: article.vipPriser },
		{ key: "kalkylkostnad", label: localizationConstants.articleKalkylkostnad, value: article.kalkylkostnad },
	];

	const orderWarehouseItems: ArticleDetailFieldItem[] = [
		{ key: "bestallningspunkt", label: localizationConstants.articleBestallningspunkt, value: article.bestallningspunkt },
		{ key: "iLager", label: localizationConstants.articleILager, value: article.iLager },
		{ key: "vikt", label: localizationConstants.articleViktLabel, value: article.vikt },
		{ key: "langd", label: localizationConstants.articleLangdLabel, value: article.langd },
		{ key: "bredd", label: localizationConstants.articleBreddLabel, value: article.bredd },
		{ key: "hojd", label: localizationConstants.articleHojdLabel, value: article.hojd },
		{ key: "material", label: localizationConstants.articleMaterialLabel, value: article.material },
	];

	const accountingItems: ArticleDetailFieldItem[] = [
		{
			key: "forsaljningSESkattskyldighet",
			label: localizationConstants.articleForsaljningSELabel,
			value: article.forsaljningSESkattskyldighet,
		},
		{
			key: "momsSESkattskyldighet",
			label: localizationConstants.articleMomsLabel,
			value: article.momsSESkattskyldighet,
		},
		{
			key: "forsaljningEUSkattskyldighet",
			label: localizationConstants.articleForsaljningEULabel,
			value: article.forsaljningEUSkattskyldighet,
		},
		{
			key: "lagerforandring",
			label: localizationConstants.articleLagerforandringLabel,
			value: article.lagerforandring,
		},
	];

	return (
		<div className="flex flex-col gap-6 pt-4">
			<ArticleDetailSectionCard
				title={localizationConstants.createArticlePriserSection}
				items={pricesItems}
				onSave={onUpdate}
			/>

			<ArticleDetailSectionCard
				title={localizationConstants.createArticleLagerplatsSection}
				items={orderWarehouseItems}
				onSave={onUpdate}
			/>

			<ArticleDetailSectionCard
				title={localizationConstants.createArticleBokforingsUppgifterSection}
				items={accountingItems}
				onSave={onUpdate}
			/>
		</div>
	);
}
