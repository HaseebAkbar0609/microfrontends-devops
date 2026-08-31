"use client";

import { Boxes, Coins } from "lucide-react";

import { SearchableSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { GoodsReceptionInput } from "../schema";

export interface GoodsInfoCardsProps {
	draft: GoodsReceptionInput;
	errors: Record<string, string>;
	onPatch: (patch: Partial<GoodsReceptionInput>) => void;
	supplierOptions: string[];
}

const CATEGORY_OPTIONS: {
	value: GoodsReceptionInput["category"];
	label: TranslationKeys;
}[] = [
	{
		value: "spare_parts",
		label: localizationConstants.purchaseGoodsCategorySpareParts,
	},
	{
		value: "raw_materials",
		label: localizationConstants.purchaseGoodsCategoryRawMaterials,
	},
	{
		value: "machinery",
		label: localizationConstants.purchaseGoodsCategoryMachinery,
	},
];

const ORDER_TYPE_OPTIONS: {
	value: NonNullable<GoodsReceptionInput["orderType"]>;
	label: TranslationKeys;
}[] = [
	{
		value: "normal",
		label: localizationConstants.purchaseGoodsReceptionOrderTypeNormal,
	},
	{
		value: "partial",
		label: localizationConstants.purchaseGoodsReceptionOrderTypePartial,
	},
	{
		value: "backorder",
		label: localizationConstants.purchaseGoodsReceptionOrderTypeBackorder,
	},
];

const CARD_HEADER_CLASS =
	"flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0";
const CARD_TITLE_CLASS = "flex items-center gap-2 text-base font-medium";
const FIELD_CLASS = "flex flex-col gap-2";
const LABEL_CLASS = "text-sm font-medium text-slate-900";
const INPUT_CLASS = "h-10 border-slate-200 bg-white";

/**
 * The ticket description's "General Info" and "Pricing & Logistics" blocks.
 * Item name, category and unit price are its mandatory fields; the rest feed the
 * list columns and the detail drawer.
 */
export function GoodsInfoCards({
	draft,
	errors,
	onPatch,
	supplierOptions,
}: GoodsInfoCardsProps) {
	const t = useTranslate();

	const errorFor = (field: keyof GoodsReceptionInput) =>
		errors[field] ? t(errors[field] as TranslationKeys) : null;

	const renderError = (field: keyof GoodsReceptionInput) => {
		const message = errorFor(field);
		if (!message) return null;
		return <p className="text-sm text-red-600">{message}</p>;
	};

	const required = <span className="text-red-500">*</span>;

	return (
		<>
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className={CARD_HEADER_CLASS}>
					<CardTitle className={CARD_TITLE_CLASS}>
						<Boxes className="h-5 w-5 text-slate-700" />
						<Translate
							text={localizationConstants.purchaseGoodsGeneralInfo}
						/>
					</CardTitle>
				</CardHeader>

				<CardContent className="grid gap-4 p-6 sm:grid-cols-2">
					<div className={FIELD_CLASS}>
						<Label htmlFor="goods-name" className={LABEL_CLASS}>
							<Translate
								text={localizationConstants.purchaseColName}
							/>{" "}
							{required}
						</Label>
						<Input
							id="goods-name"
							value={draft.name}
							onChange={(event) =>
								onPatch({ name: event.target.value })
							}
							aria-invalid={Boolean(errors.name) || undefined}
							className={INPUT_CLASS}
						/>
						{renderError("name")}
					</div>

					<div className={FIELD_CLASS}>
						<Label htmlFor="goods-sku" className={LABEL_CLASS}>
							<Translate
								text={localizationConstants.purchaseGoodsColSku}
							/>
						</Label>
						<Input
							id="goods-sku"
							value={draft.sku}
							onChange={(event) =>
								onPatch({ sku: event.target.value })
							}
							className={INPUT_CLASS}
						/>
						{renderError("sku")}
					</div>

					<div className={`${FIELD_CLASS} sm:col-span-2`}>
						<Label
							htmlFor="goods-description"
							className={LABEL_CLASS}
						>
							<Translate
								text={
									localizationConstants.purchaseGoodsColDescription
								}
							/>
						</Label>
						<Textarea
							id="goods-description"
							value={draft.description}
							onChange={(event) =>
								onPatch({ description: event.target.value })
							}
							className="min-h-20 border-slate-200 bg-white"
						/>
						{renderError("description")}
					</div>

					<div className={FIELD_CLASS}>
						<Label htmlFor="goods-category" className={LABEL_CLASS}>
							<Translate
								text={
									localizationConstants.purchaseGoodsColCategory
								}
							/>{" "}
							{required}
						</Label>
						<Select
							value={draft.category}
							onValueChange={(value) =>
								onPatch({
									category:
										value as GoodsReceptionInput["category"],
								})
							}
						>
							<SelectTrigger
								id="goods-category"
								aria-invalid={
									Boolean(errors.category) || undefined
								}
								className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm font-normal text-slate-700"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{CATEGORY_OPTIONS.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="cursor-pointer"
									>
										<Translate text={option.label} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{renderError("category")}
					</div>

					<div className={FIELD_CLASS}>
						<Label className={LABEL_CLASS}>
							<Translate
								text={
									localizationConstants.purchaseSupplierColName
								}
							/>{" "}
							{required}
						</Label>
						<SearchableSelect
							value={draft.supplier ?? ""}
							onChange={(value) => onPatch({ supplier: value })}
							options={supplierOptions}
							hasError={Boolean(errors.supplier)}
						/>
						{renderError("supplier")}
					</div>

					<div className={`${FIELD_CLASS} sm:col-span-2`}>
						<Label htmlFor="goods-object" className={LABEL_CLASS}>
							<Translate
								text={localizationConstants.purchaseColObject}
							/>
						</Label>
						<Input
							id="goods-object"
							value={draft.object}
							onChange={(event) =>
								onPatch({ object: event.target.value })
							}
							className={INPUT_CLASS}
						/>
						{renderError("object")}
					</div>
				</CardContent>
			</Card>

			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className={CARD_HEADER_CLASS}>
					<CardTitle className={CARD_TITLE_CLASS}>
						<Coins className="h-5 w-5 text-slate-700" />
						<Translate
							text={
								localizationConstants.purchaseGoodsPricingLogistics
							}
						/>
					</CardTitle>
				</CardHeader>

				<CardContent className="grid gap-4 p-6 sm:grid-cols-2">
					<div className={FIELD_CLASS}>
						<Label
							htmlFor="goods-unit-price"
							className={LABEL_CLASS}
						>
							<Translate
								text={
									localizationConstants.purchaseGoodsColUnitPrice
								}
							/>{" "}
							{required}
						</Label>
						<Input
							id="goods-unit-price"
							type="number"
							inputMode="decimal"
							min={0}
							step="1"
							value={draft.unitPrice}
							onChange={(event) =>
								onPatch({ unitPrice: event.target.value })
							}
							aria-invalid={
								Boolean(errors.unitPrice) || undefined
							}
							className={INPUT_CLASS}
						/>
						{renderError("unitPrice")}
					</div>

					<div className={FIELD_CLASS}>
						<Label htmlFor="goods-lead-time" className={LABEL_CLASS}>
							<Translate
								text={
									localizationConstants.purchaseGoodsColLeadTime
								}
							/>
						</Label>
						<Input
							id="goods-lead-time"
							type="number"
							inputMode="numeric"
							min={0}
							step="1"
							value={draft.leadTimeDays}
							onChange={(event) =>
								onPatch({ leadTimeDays: event.target.value })
							}
							aria-invalid={
								Boolean(errors.leadTimeDays) || undefined
							}
							className={INPUT_CLASS}
						/>
						{renderError("leadTimeDays")}
					</div>

					<div className={FIELD_CLASS}>
						<Label htmlFor="goods-moq" className={LABEL_CLASS}>
							<Translate
								text={localizationConstants.purchaseGoodsColMoq}
							/>
						</Label>
						<Input
							id="goods-moq"
							type="number"
							inputMode="numeric"
							min={0}
							step="1"
							value={draft.minimumOrderQuantity}
							onChange={(event) =>
								onPatch({
									minimumOrderQuantity: event.target.value,
								})
							}
							aria-invalid={
								Boolean(errors.minimumOrderQuantity) ||
								undefined
							}
							className={INPUT_CLASS}
						/>
						{renderError("minimumOrderQuantity")}
					</div>

					<div className={FIELD_CLASS}>
						<Label htmlFor="goods-delivery" className={LABEL_CLASS}>
							<Translate
								text={
									localizationConstants.purchaseGoodsReceptionColExpectedDelivery
								}
							/>
						</Label>
						<Input
							id="goods-delivery"
							type="date"
							value={draft.expectedDelivery}
							onChange={(event) =>
								onPatch({
									expectedDelivery: event.target.value,
								})
							}
							className={INPUT_CLASS}
						/>
						{renderError("expectedDelivery")}
					</div>

					<div className={FIELD_CLASS}>
						<Label
							htmlFor="goods-order-type"
							className={LABEL_CLASS}
						>
							<Translate
								text={
									localizationConstants.purchaseGoodsReceptionColOrderType
								}
							/>
						</Label>
						<Select
							value={draft.orderType}
							onValueChange={(value) =>
								onPatch({
									orderType:
										value as GoodsReceptionInput["orderType"],
								})
							}
						>
							<SelectTrigger
								id="goods-order-type"
								className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm font-normal text-slate-700"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{ORDER_TYPE_OPTIONS.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="cursor-pointer"
									>
										<Translate text={option.label} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>
		</>
	);
}

export default GoodsInfoCards;
