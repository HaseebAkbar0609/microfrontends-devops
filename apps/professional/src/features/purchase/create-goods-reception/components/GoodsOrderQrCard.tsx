"use client";

import { Folders } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface GoodsOrderQrCardProps {
	orderOptions: string[];
	selectedOrder: string;
	onSelectOrder: (order: string) => void;
	/** Translation key of the validation message, when the order is missing. */
	error?: string;
}

/**
 * The frame's first card: the purchase order being received, and its QR code.
 *
 * The QR encodes the selected order, so scanning the printed sheet reaches the
 * right reception. It only renders once an order is chosen — a QR encoding an
 * empty string would scan to nothing.
 */
export function GoodsOrderQrCard({
	orderOptions,
	selectedOrder,
	onSelectOrder,
	error,
}: GoodsOrderQrCardProps) {
	const t = useTranslate();

	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Folders className="h-5 w-5 text-slate-700" />
					<Translate
						text={localizationConstants.agreementDocuments}
					/>
				</CardTitle>
			</CardHeader>

			<CardContent className="p-6">
				<Label
					htmlFor="goods-reception-order"
					className="mb-2 block text-sm font-medium text-slate-900"
				>
					<Translate
						text={
							localizationConstants.purchaseGoodsReceptionOrderLabel
						}
					/>{" "}
					<span className="text-red-500">*</span>
				</Label>
				<Select value={selectedOrder} onValueChange={onSelectOrder}>
					<SelectTrigger
						id="goods-reception-order"
						aria-invalid={Boolean(error) || undefined}
						className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm font-normal text-slate-700 shadow-2xs"
					>
						<SelectValue
							placeholder={t(
								localizationConstants.purchaseGoodsReceptionOrderLabel,
							)}
						/>
					</SelectTrigger>
					<SelectContent className="bg-white">
						{orderOptions.map((order) => (
							<SelectItem
								key={order}
								value={order}
								className="cursor-pointer"
							>
								{order}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{error && (
					<p className="mt-2 text-sm text-red-600">
						{t(error as TranslationKeys)}
					</p>
				)}

				<p className="mt-5 mb-2 text-sm font-medium text-slate-900">
					<Translate
						text={
							localizationConstants.purchaseGoodsReceptionQrLabel
						}
					/>
				</p>
				<div className="flex min-h-45 items-center justify-center rounded-md border border-slate-200 bg-white p-6">
					{selectedOrder ? (
						<QRCodeSVG
							value={selectedOrder}
							size={128}
							level="M"
							title={`${t(localizationConstants.purchaseGoodsReceptionQrAlt)} ${selectedOrder}`}
							className="h-32 w-32"
						/>
					) : (
						<p className="text-sm text-slate-400">
							<Translate
								text={
									localizationConstants.purchaseGoodsReceptionOrderLabel
								}
							/>
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export default GoodsOrderQrCard;
