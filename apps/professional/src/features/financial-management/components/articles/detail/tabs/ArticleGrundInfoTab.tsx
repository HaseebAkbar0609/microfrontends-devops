"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleDetail } from "../../../../types/article.types";
import {
	ArticleDetailSectionCard,
	type ArticleDetailFieldItem,
} from "../ArticleDetailSectionCard";
import { ArticlePriceListTable } from "../ArticlePriceListTable";

interface ArticleGrundInfoTabProps {
	readonly article: ArticleDetail;
	readonly onUpdate: (updates: Partial<ArticleDetail>) => void;
}

export function ArticleGrundInfoTab({ article, onUpdate }: ArticleGrundInfoTabProps) {
	const basicItems: ArticleDetailFieldItem[] = [
		{
			key: "articleNo",
			label: localizationConstants.articleNrLabel,
			value: article.articleNo,
			readOnly: true,
		},
		{
			key: "benamning",
			label: localizationConstants.articleBenamningLabel,
			value: article.benamning,
		},
		{
			key: "ean",
			label: localizationConstants.articleEanLabel,
			value: article.ean,
		},
		{
			key: "leverantor",
			label: localizationConstants.articleLeverantorLabel,
			value: article.leverantor,
		},
		{
			key: "enhet",
			label: localizationConstants.articleEnhetLabel,
			value: article.enhet,
			type: "select",
			options: [
				{ label: "Styck (st)", value: "Styck" },
				{ label: "Timme (tim)", value: "Tim" },
				{ label: "Meter (m)", value: "Meter" },
				{ label: "Kilogram (kg)", value: "Kg" },
				{ label: "Liter (l)", value: "Liter" },
				{ label: "Månad (mån)", value: "Månad" },
			],
		},
		{
			key: "typAvArtikel",
			label: localizationConstants.articleTypAvArtikelLabel,
			value: article.typAvArtikel,
			type: "select",
			options: [
				{ label: "Vara", value: "Vara" },
				{ label: "Tjänst", value: "Tjänst" },
			],
		},
		{
			key: "status",
			label: localizationConstants.statusLabel,
			value:
				article.status === "active"
					? localizationConstants.activeStatus
					: localizationConstants.inactiveStatus,
			isBadge: true,
			badgeVariant: (article.status === "active" ? "success" : "secondary") as
				| "success"
				| "secondary",
			type: "select",
			options: [
				{ label: "Aktiv", value: "active" },
				{ label: "Inaktiv", value: "inactive" },
			],
		},
	];

	const accountingItems: ArticleDetailFieldItem[] = [
		{
			key: "forsaljning",
			label: localizationConstants.articleForsaljningLabel,
			value: article.forsaljning,
		},
		{
			key: "moms",
			label: localizationConstants.articleMomsLabel,
			value: article.moms,
			type: "select",
			options: [
				{ label: "25%", value: "25%" },
				{ label: "12%", value: "12%" },
				{ label: "6%", value: "6%" },
				{ label: "0% (Momsfri)", value: "0%" },
			],
		},
		{
			key: "forsaljningSE",
			label: localizationConstants.articleForsaljningSELabel,
			value: article.forsaljningSE,
		},
		{
			key: "forsaljningEU",
			label: localizationConstants.articleForsaljningEULabel,
			value: article.forsaljningEU,
		},
		{
			key: "lagerkonto",
			label: localizationConstants.articleLagerkontoLabel,
			value: article.lagerkonto,
		},
		{
			key: "inkop",
			label: localizationConstants.articleInkopLabel,
			value: article.inkop,
		},
	];

	return (
		<div className="flex flex-col gap-6 pt-4">
			<ArticleDetailSectionCard
				title={localizationConstants.createArticleGrundInfoSection}
				items={basicItems}
				onSave={onUpdate}
			/>

			<ArticlePriceListTable
				rows={article.priceListRows}
				onEdit={() => {}}
			/>

			<ArticleDetailSectionCard
				title={localizationConstants.createArticleBokforingsUppgifterSection}
				items={accountingItems}
				onSave={onUpdate}
			/>
		</div>
	);
}
