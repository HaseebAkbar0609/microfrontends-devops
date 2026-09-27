"use client";

import React from "react";
import { UserPlus } from "lucide-react";
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
	// Card 1: Grund information (4 columns matching Figma Image 1)
	const basicItems: ArticleDetailFieldItem[] = [
		{
			key: "supplierArticleNo",
			label: localizationConstants.supplierArticleArtikelnr,
			value: article.supplierArticleNo || "info",
			readOnly: true,
		},
		{
			key: "supplierNo",
			label: localizationConstants.supplierArticleLeverantorNr,
			value: article.supplierNo || "info",
		},
		{
			key: "supplierName",
			label: localizationConstants.supplierArticleLeverantorensNamn,
			value: article.supplierName || "info",
		},
		{
			key: "purchasePrice",
			label: localizationConstants.supplierArticleInkopskostnad,
			value: article.purchasePrice || "info",
		},
		{
			key: "linkedToArticle",
			label: localizationConstants.supplierArticleKoppladTillArtikel,
			value: article.linkedToArticle || "info",
		},
		{
			key: "supplierDescription",
			label: localizationConstants.supplierArticleBeskrivning,
			value: article.supplierDescription || article.description || "info",
		},
	];

	// Card 2: Artikelinformation (4 columns matching Figma Image 1)
	const articleInfoItems: ArticleDetailFieldItem[] = [
		{
			key: "weight",
			label: localizationConstants.supplierArticleVikt,
			value: article.weight || article.vikt || "info",
		},
		{
			key: "length",
			label: localizationConstants.supplierArticleLangd,
			value: article.length || article.langd || "info",
		},
		{
			key: "width",
			label: localizationConstants.supplierArticleBredd,
			value: article.width || article.bredd || "info",
		},
		{
			key: "height",
			label: localizationConstants.supplierArticleHojd,
			value: article.height || article.hojd || "info",
		},
		{
			key: "material",
			label: localizationConstants.supplierArticleMaterial,
			value: article.material || "info",
		},
	];

	return (
		<div className="flex flex-col gap-5 pt-3">
			{/* Card 1: Grund information */}
			<ArticleDetailSectionCard
				title={localizationConstants.supplierArticleGrundInfoCard}
				icon={<UserPlus className="h-4 w-4" />}
				items={basicItems}
				columns={4}
				onSave={onUpdate}
			/>

			{/* Card 2: Artikelinformation */}
			<ArticleDetailSectionCard
				title={localizationConstants.supplierArticleArtikelinfoCard}
				icon={<UserPlus className="h-4 w-4" />}
				items={articleInfoItems}
				columns={4}
				onSave={onUpdate}
			/>

			{/* Card 3: Bilder */}
			<SupplierArticleImagesCard images={article.images} />
		</div>
	);
}

