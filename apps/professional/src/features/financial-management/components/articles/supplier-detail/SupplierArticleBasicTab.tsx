"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierArticleDetail } from "../../../types/article.types";
import {
	ArticleDetailSectionCard,
	type ArticleDetailFieldItem,
} from "../detail/ArticleDetailSectionCard";
import { SupplierArticleImagesCard } from "./SupplierArticleImagesCard";

interface SupplierArticleBasicTabProps {
	readonly article: SupplierArticleDetail;
	readonly onUpdate: (updates: Partial<SupplierArticleDetail>) => void;
}

export function SupplierArticleBasicTab({
	article,
	onUpdate,
}: SupplierArticleBasicTabProps) {
	const basicItems: ArticleDetailFieldItem[] = [
		{
			key: "supplierArticleNo",
			label: localizationConstants.supplierArticleNoHeader,
			value: article.supplierArticleNo,
			readOnly: true,
		},
		{
			key: "supplierName",
			label: localizationConstants.supplierHeader,
			value: article.supplierName,
		},
		{
			key: "supplierDescription",
			label: localizationConstants.supplierDescriptionHeader,
			value: article.supplierDescription,
		},
		{
			key: "purchasePrice",
			label: localizationConstants.purchasePriceHeader,
			value: article.purchasePrice,
		},
		{
			key: "linkedToArticle",
			label: localizationConstants.linkedToArticleHeader,
			value: article.linkedToArticle,
		},
		{
			key: "status",
			label: localizationConstants.statusLabel,
			value:
				article.status === "mapped"
					? localizationConstants.mappedStatus
					: localizationConstants.unmappedStatus,
			isBadge: true,
			badgeVariant: (article.status === "mapped" ? "success" : "secondary") as
				| "success"
				| "secondary",
			type: "select",
			options: [
				{ label: "Mappad", value: "mapped" },
				{ label: "Omappad", value: "unmapped" },
			],
		},
	];

	const specItems: ArticleDetailFieldItem[] = [
		{ key: "ean", label: localizationConstants.articleEanLabel, value: article.ean },
		{
			key: "unit",
			label: localizationConstants.articleEnhetLabel,
			value: article.unit,
			type: "select",
			options: [
				{ label: "Styck (st)", value: "Styck" },
				{ label: "Timme (tim)", value: "Tim" },
				{ label: "Meter (m)", value: "Meter" },
				{ label: "Kilogram (kg)", value: "Kg" },
			],
		},
		{ key: "category", label: localizationConstants.articleTypAvArtikelLabel, value: article.category },
		{ key: "weight", label: localizationConstants.articleViktLabel, value: article.weight },
		{ key: "dimensions", label: localizationConstants.dimensionsLabel, value: article.dimensions },
		{ key: "material", label: localizationConstants.articleMaterialLabel, value: article.material },
	];

	return (
		<div className="flex flex-col gap-6 pt-4">
			<ArticleDetailSectionCard
				title={localizationConstants.basicInfoSectionTitle}
				items={basicItems}
				onSave={onUpdate}
			/>

			<SupplierArticleImagesCard images={article.images} />

			<ArticleDetailSectionCard
				title={localizationConstants.productSpecificationsSectionTitle}
				items={specItems}
				onSave={onUpdate}
			/>
		</div>
	);
}
