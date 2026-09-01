"use client";

import { Folder, Truck } from "lucide-react";

import { SearchableSelect } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { OrderObjectStepInput } from "../schema";

export interface OrderObjectStepProps {
	purchaseNo: string;
	lineNo: string;
	calculationNo: string;
	value: OrderObjectStepInput;
	delivery: {
		deliveryAddress: string;
		deliveryPostalCode: string;
		deliveryCity: string;
	};
	errors: Record<string, string>;
	onChange: (patch: Partial<OrderObjectStepInput>) => void;
	supplierOptions: { value: string; label: string }[];
}

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-slate-400";

/**
 * Step 1: which supplier the order goes to, the object it belongs to, and where
 * it is delivered.
 *
 * The delivery block mirrors the project address while the checkbox is ticked —
 * a derived value rather than duplicated state, matching the purchase object
 * screen.
 */
export function OrderObjectStep({
	purchaseNo,
	lineNo,
	calculationNo,
	value,
	delivery,
	errors,
	onChange,
	supplierOptions,
}: OrderObjectStepProps) {
	const t = useTranslate();

	const field = (
		key: keyof OrderObjectStepInput,
		labelKey: TranslationKeys,
		options: { value?: string; disabled?: boolean } = {},
	) => (
		<div className="space-y-1">
			<Label className="text-sm font-medium text-slate-700">
				<Translate text={labelKey} />
			</Label>
			<Input
				value={options.value ?? ((value[key] as string) || "")}
				disabled={options.disabled}
				onChange={(event) =>
					onChange({
						[key]: event.target.value,
					} as Partial<OrderObjectStepInput>)
				}
				placeholder={t(labelKey)}
				className={cn(
					FIELD_CLASS,
					options.disabled && "bg-slate-50 text-slate-500",
					errors[key] && "border-red-500",
				)}
			/>
			{errors[key] && (
				<p className="mt-1 text-xs text-red-500">
					{t(errors[key] as TranslationKeys)}
				</p>
			)}
		</div>
	);

	return (
		<div className="space-y-4">
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className="flex h-14 flex-row items-center justify-between border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium text-slate-900">
						<Translate
							text={
								localizationConstants.purchaseOrderSupplierFromCalc
							}
						/>
					</CardTitle>
					<span className="text-sm font-medium text-slate-500">
						{calculationNo}
					</span>
				</CardHeader>

				<CardContent className="space-y-3 p-6">
					<SearchableSelect
						value={value.supplierId ?? ""}
						onChange={(next) => onChange({ supplierId: next })}
						options={supplierOptions}
						allowCustom={false}
						hasError={Boolean(errors.supplierId)}
						placeholder={t(
							localizationConstants.purchaseSupplierColName,
						)}
					/>
					{errors.supplierId && (
						<p className="text-xs text-red-500">
							{t(errors.supplierId as TranslationKeys)}
						</p>
					)}

					<div className="flex justify-end">
						<Button
							type="button"
							className="h-10 min-w-25 cursor-pointer bg-[#111721] text-sm font-medium text-white hover:bg-slate-800"
						>
							<Translate
								text={
									localizationConstants.purchaseOrderSelectAction
								}
							/>
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900">
				<Translate
					text={localizationConstants.purchaseOrderObjectHeading}
				/>{" "}
				{purchaseNo}
			</div>

			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Folder className="h-5 w-5 text-slate-700" />
						<span>
							<Translate
								text={localizationConstants.purchaseColNumber}
							/>
							: {lineNo}
						</span>
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4 p-6">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{field(
							"projectNo",
							localizationConstants.purchaseCreateProjectNo,
						)}
						{field(
							"projectName",
							localizationConstants.purchaseCreateProjectName,
						)}
						{field(
							"objectName",
							localizationConstants.purchaseGanttColObject,
						)}
						{field(
							"blockName",
							localizationConstants.purchaseCreateBlockName,
						)}
					</div>

					<div className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900">
						<Truck className="h-4 w-4 text-slate-700" />
						<Translate
							text={localizationConstants.purchaseCreateDelivery}
						/>
					</div>

					{field(
						"projectAddress",
						localizationConstants.purchaseCreateProjectAddress,
					)}

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{field(
							"projectPostalCode",
							localizationConstants.orderPostNrLabel,
						)}
						{field(
							"projectCity",
							localizationConstants.orderCityLabel,
						)}
					</div>

					<Label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900">
						<Checkbox
							checked={value.deliverySameAsProject}
							onCheckedChange={(checked) =>
								onChange({
									deliverySameAsProject: checked === true,
								})
							}
							className="border-slate-400 data-[state=checked]:border-black data-[state=checked]:bg-black"
						/>
						<Translate
							text={
								localizationConstants.purchaseCreateDeliverySameAsObject
							}
						/>
					</Label>

					{field(
						"deliveryAddress",
						localizationConstants.purchaseCreateDeliveryAddress,
						{
							value: delivery.deliveryAddress,
							disabled: value.deliverySameAsProject,
						},
					)}

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{field(
							"deliveryPostalCode",
							localizationConstants.orderPostNrLabel,
							{
								value: delivery.deliveryPostalCode,
								disabled: value.deliverySameAsProject,
							},
						)}
						{field(
							"deliveryCity",
							localizationConstants.orderCityLabel,
							{
								value: delivery.deliveryCity,
								disabled: value.deliverySameAsProject,
							},
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default OrderObjectStep;
