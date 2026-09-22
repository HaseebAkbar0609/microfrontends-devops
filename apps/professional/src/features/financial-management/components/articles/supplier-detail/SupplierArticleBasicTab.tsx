"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierArticleDetail } from "../../../types/article.types";
import { ArticleDetailSectionCard } from "../detail/ArticleDetailSectionCard";
import { SupplierArticleImagesCard } from "./SupplierArticleImagesCard";

interface SupplierArticleBasicTabProps {
	readonly article: SupplierArticleDetail;
	readonly onEdit?: () => void;
}

export function SupplierArticleBasicTab({
	article,
	onEdit,
}: SupplierArticleBasicTabProps) {
	const basicItems = [
		{ label: localizationConstants.supplierArticleNoHeader, value: article.supplierArticleNo },
		{ label: localizationConstants.supplierHeader, value: article.supplierName },
		{ label: localizationConstants.supplierDescriptionHeader, value: article.supplierDescription },
		{ label: localizationConstants.purchasePriceHeader, value: article.purchasePrice },
		{ label: localizationConstants.linkedToArticleHeader, value: article.linkedToArticle },
		{
			label: localizationConstants.statusLabel,
			value:
				article.status === "mapped"
					? localizationConstants.mappedStatus
					: localizationConstants.unmappedStatus,
			isBadge: true,
			badgeVariant: (article.status === "mapped" ? "success" : "secondary") as
				| "success"
				| "secondary",
		},
	];

	const specItems = [
		{ label: localizationConstants.articleEanLabel, value: article.ean },
		{ label: localizationConstants.articleEnhetLabel, value: article.unit },
		{ label: localizationConstants.articleTypAvArtikelLabel, value: article.category },
		{ label: localizationConstants.articleViktLabel, value: article.weight },
		{ label: localizationConstants.dimensionsLabel, value: article.dimensions },
		{ label: localizationConstants.articleMaterialLabel, value: article.material },
	];

	return (
		<div className="flex flex-col gap-6 pt-4">
			<ArticleDetailSectionCard
				title={localizationConstants.basicInfoSectionTitle}
				items={basicItems}
				onEdit={onEdit}
			/>

			<SupplierArticleImagesCard images={article.images} />

			<ArticleDetailSectionCard
				title={localizationConstants.productSpecificationsSectionTitle}
				items={specItems}
				onEdit={onEdit}
			/>
		</div>
	);
}
