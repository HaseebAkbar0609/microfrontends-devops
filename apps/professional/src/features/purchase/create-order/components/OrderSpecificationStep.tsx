"use client";

import { Folder, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { PurchaseOrderSpecLine } from "../../types/purchase.types";
import type { OrderSpecificationStepInput } from "../schema";
import { SpecificationTable } from "./SpecificationTable";

export interface OrderSpecificationStepProps {
	value: OrderSpecificationStepInput;
	errors: Record<string, string>;
	onChange: (patch: Partial<OrderSpecificationStepInput>) => void;
	onUpdateLine: (id: string, patch: Partial<PurchaseOrderSpecLine>) => void;
	onAddLine: () => void;
	onRemoveLine: (id: string) => void;
	total: number;
	projectNo: string;
	invoiceEmail: string;
}

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-slate-400";

const DELIVERY_METHODS: { value: string; label: TranslationKeys }[] = [
	{
		value: "car",
		label: localizationConstants.purchaseOrderDeliveryByCar,
	},
	{
		value: "pickup",
		label: localizationConstants.purchaseOrderDeliveryPickup,
	},
];

/**
 * Step 3: the order's information block, its line items and free-text comments.
 *
 * Ticking Bevakning reveals the monitoring date and fills the Information
 * card's field, which is the transition the frames show between their two
 * Specifikation states.
 */
export function OrderSpecificationStep({
	value,
	errors,
	onChange,
	onUpdateLine,
	onAddLine,
	onRemoveLine,
	total,
	projectNo,
	invoiceEmail,
}: OrderSpecificationStepProps) {
	const t = useTranslate();

	const labelled = (labelKey: TranslationKeys, control: React.ReactNode) => (
		<div className="space-y-1">
			<Label className="text-sm font-medium text-slate-700">
				<Translate text={labelKey} />
			</Label>
			{control}
		</div>
	);

	return (
		<div className="space-y-4">
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Folder className="h-5 w-5 text-slate-700" />
						<Translate
							text={localizationConstants.purchaseSupplierColName}
						/>
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4 p-6">
					<p className="text-sm font-medium text-slate-900">
						<Translate
							text={
								localizationConstants.purchaseOrderInsuranceQuestion
							}
						/>
					</p>

					<div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-2">
						<Label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900">
							<Checkbox
								checked={value.monitoringEnabled}
								onCheckedChange={(checked) =>
									onChange({
										monitoringEnabled: checked === true,
									})
								}
								className="border-slate-400 data-[state=checked]:border-black data-[state=checked]:bg-black"
							/>
							<Translate
								text={
									localizationConstants.purchaseLineColMonitoring
								}
							/>
						</Label>

						{value.monitoringEnabled &&
							labelled(
								localizationConstants.purchaseLineColMonitoringDate,
								<Input
									type="date"
									value={value.monitoringDate}
									onChange={(event) =>
										onChange({
											monitoringDate: event.target.value,
										})
									}
									className={FIELD_CLASS}
								/>,
							)}
					</div>

					{labelled(
						localizationConstants.purchaseOrderSelectedSupplier,
						<Input
							value={value.supplierCompany}
							onChange={(event) =>
								onChange({ supplierCompany: event.target.value })
							}
							placeholder={t(
								localizationConstants.purchaseSupplierColName,
							)}
							className={FIELD_CLASS}
						/>,
					)}
				</CardContent>
			</Card>

			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Info className="h-5 w-5 text-slate-700" />
						<Translate
							text={
								localizationConstants.purchaseCreateInfoSection
							}
						/>
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4 p-6">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{labelled(
							localizationConstants.purchaseOrderDesiredDelivery,
							<Input
								type="date"
								value={value.desiredDelivery}
								onChange={(event) =>
									onChange({
										desiredDelivery: event.target.value,
									})
								}
								className={FIELD_CLASS}
							/>,
						)}

						{labelled(
							localizationConstants.purchaseLineColMonitoringDate,
							<Input
								value={value.monitoringDate || "-"}
								disabled
								className={`${FIELD_CLASS} bg-slate-50 text-slate-500`}
							/>,
						)}

						{labelled(
							localizationConstants.purchaseOrderMarking,
							<Input
								value={value.marking}
								onChange={(event) =>
									onChange({ marking: event.target.value })
								}
								className={FIELD_CLASS}
							/>,
						)}

						{labelled(
							localizationConstants.purchaseCreateProjectNo,
							<Input
								value={projectNo}
								disabled
								className={`${FIELD_CLASS} bg-slate-50 text-slate-500`}
							/>,
						)}

						{labelled(
							localizationConstants.deliveryMethodLabel,
							<Select
								value={value.deliveryMethod}
								onValueChange={(next) =>
									onChange({ deliveryMethod: next })
								}
							>
								<SelectTrigger
									className={`${FIELD_CLASS} w-full cursor-pointer text-sm font-normal text-slate-700`}
								>
									<SelectValue
										placeholder={t(
											localizationConstants.deliveryMethodLabel,
										)}
									/>
								</SelectTrigger>
								<SelectContent className="bg-white">
									{DELIVERY_METHODS.map((method) => (
										<SelectItem
											key={method.value}
											value={method.value}
											className="cursor-pointer"
										>
											<Translate text={method.label} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>,
						)}

						{labelled(
							localizationConstants.purchaseOrderQrLabel,
							<div className="flex h-24 items-center justify-start rounded-md border border-slate-200 bg-white px-3">
								{value.marking ? (
									<QRCodeSVG
										value={value.marking}
										size={72}
										level="M"
										title={`${t(localizationConstants.purchaseGoodsReceptionQrAlt)} ${value.marking}`}
										className="h-18 w-18"
									/>
								) : (
									<span className="text-sm text-slate-400">
										<Translate
											text={
												localizationConstants.purchaseOrderMarking
											}
										/>
									</span>
								)}
							</div>,
						)}
					</div>

					<p className="text-sm text-slate-700">
						<Translate
							text={localizationConstants.purchaseOrderInvoiceTo}
						/>
						: {invoiceEmail}
					</p>
				</CardContent>
			</Card>

			<div className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.purchaseModuleTitle} />
			</div>

			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium text-slate-900">
						<Translate
							text={
								localizationConstants.purchaseOrderTabSpecification
							}
						/>
					</CardTitle>
				</CardHeader>

				<CardContent className="p-6">
					<SpecificationTable
						lines={(value.lines ?? []) as PurchaseOrderSpecLine[]}
						errors={errors}
						onUpdateLine={onUpdateLine}
						onAddLine={onAddLine}
						onRemoveLine={onRemoveLine}
						total={total}
					/>
					{errors.lines && (
						<p className="mt-2 text-xs text-red-500">
							{t(errors.lines as TranslationKeys)}
						</p>
					)}
				</CardContent>
			</Card>

			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium text-slate-900">
						<Translate
							text={localizationConstants.purchaseOrderComments}
						/>
					</CardTitle>
				</CardHeader>

				<CardContent className="p-6">
					<Textarea
						value={value.comments}
						onChange={(event) =>
							onChange({ comments: event.target.value })
						}
						placeholder={t(
							localizationConstants.purchaseOrderCommentsPlaceholder,
						)}
						rows={3}
						className="min-h-20 rounded-md border-slate-200 shadow-none"
					/>
				</CardContent>
			</Card>
		</div>
	);
}

export default OrderSpecificationStep;
