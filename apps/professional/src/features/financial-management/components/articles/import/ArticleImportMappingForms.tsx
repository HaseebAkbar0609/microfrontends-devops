"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleImportMapping } from "../../../types/article.types";

interface ArticleImportMappingFormsProps {
	readonly columns: string[];
	readonly mapping: ArticleImportMapping;
	readonly basicInfoOpen: boolean;
	readonly measurementsOpen: boolean;
	readonly onToggleBasicInfo: () => void;
	readonly onToggleMeasurements: () => void;
	readonly onMappingChange: (field: string, col: string) => void;
}

const BASIC_FIELDS = [
	{ key: "articleNr", labelKey: localizationConstants.articleNrLabel },
	{ key: "benamning", labelKey: localizationConstants.articleBenamningLabel },
	{ key: "ean", labelKey: localizationConstants.articleEanLabel },
	{ key: "leverantor", labelKey: localizationConstants.articleLeverantorLabel },
	{ key: "enhet", labelKey: localizationConstants.articleEnhetLabel },
	{ key: "typAvArtikel", labelKey: localizationConstants.articleTypAvArtikelLabel },
	{ key: "forsaljning", labelKey: localizationConstants.articleForsaljningLabel },
	{ key: "moms", labelKey: localizationConstants.articleMomsLabel },
	{ key: "inkop", labelKey: localizationConstants.articleInkopLabel },
];

const MEASUREMENT_FIELDS = [
	{ key: "vikt", labelKey: localizationConstants.articleViktLabel },
	{ key: "langd", labelKey: localizationConstants.articleLangdLabel },
	{ key: "bredd", labelKey: localizationConstants.articleBreddLabel },
	{ key: "hojd", labelKey: localizationConstants.articleHojdLabel },
	{ key: "material", labelKey: localizationConstants.articleMaterialLabel },
];

export function ArticleImportMappingForms({
	columns,
	mapping,
	basicInfoOpen,
	measurementsOpen,
	onToggleBasicInfo,
	onToggleMeasurements,
	onMappingChange,
}: ArticleImportMappingFormsProps) {
	return (
		<div className="flex flex-col gap-6">
			{/* Section 1: Basic Info */}
			<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
				<button
					type="button"
					onClick={onToggleBasicInfo}
					className="w-full flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-900 cursor-pointer"
				>
					<span>
						<Translate text={localizationConstants.basicInfoSectionTitle} />
					</span>
					{basicInfoOpen ? (
						<ChevronUp className="h-4 w-4 text-slate-500" />
					) : (
						<ChevronDown className="h-4 w-4 text-slate-500" />
					)}
				</button>

				{basicInfoOpen && (
					<div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{BASIC_FIELDS.map((field) => (
							<div key={field.key} className="flex flex-col gap-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={field.labelKey} />
								</label>
								<Select
									value={mapping[field.key] || "unmapped"}
									onValueChange={(val) =>
										onMappingChange(field.key, val === "unmapped" ? "" : val)
									}
								>
									<SelectTrigger className="h-10 text-xs border-slate-200 bg-white">
										<SelectValue placeholder="Välj kolumn" />
									</SelectTrigger>
									<SelectContent className="bg-white border-slate-200 shadow-md">
										<SelectItem value="unmapped" className="text-xs text-slate-400">
											<Translate text={localizationConstants.customerDetailNone} />
										</SelectItem>
										{columns.map((col) => (
											<SelectItem key={col} value={col} className="text-xs">
												{col}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Section 2: Measurements */}
			<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
				<button
					type="button"
					onClick={onToggleMeasurements}
					className="w-full flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-900 cursor-pointer"
				>
					<span>
						<Translate text={localizationConstants.measurementsSection} />
					</span>
					{measurementsOpen ? (
						<ChevronUp className="h-4 w-4 text-slate-500" />
					) : (
						<ChevronDown className="h-4 w-4 text-slate-500" />
					)}
				</button>

				{measurementsOpen && (
					<div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{MEASUREMENT_FIELDS.map((field) => (
							<div key={field.key} className="flex flex-col gap-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={field.labelKey} />
								</label>
								<Select
									value={mapping[field.key] || "unmapped"}
									onValueChange={(val) =>
										onMappingChange(field.key, val === "unmapped" ? "" : val)
									}
								>
									<SelectTrigger className="h-10 text-xs border-slate-200 bg-white">
										<SelectValue placeholder="Välj kolumn" />
									</SelectTrigger>
									<SelectContent className="bg-white border-slate-200 shadow-md">
										<SelectItem value="unmapped" className="text-xs text-slate-400">
											<Translate text={localizationConstants.customerDetailNone} />
										</SelectItem>
										{columns.map((col) => (
											<SelectItem key={col} value={col} className="text-xs">
												{col}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
