"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Folder, Truck } from "lucide-react";

import { CustomerDetailsCard } from "@/components/form";
import { ModulePageHeader } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import type { CustomerDetails } from "@/lib/validation/contactSchema";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	PURCHASE_MODULE_BASE_URL,
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
} from "../data/purchaseNav.config";
import { createPurchaseObjectSchema } from "./schema";
import type {
	CreatePurchaseObjectFormData,
	PurchaseObjectDetails,
	PurchaseObjectLinkType,
} from "./types";

const OVERVIEW_URL = `${PURCHASE_MODULE_BASE_URL}/overview`;

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-gray-300 focus-visible:outline-none";

/**
 * The link type only swaps labels — Order nr / Order namn / Order adress
 * against their Projekt equivalents — so keep it as a lookup, not branching JSX.
 */
const LABELS: Record<
	PurchaseObjectLinkType,
	{ no: TranslationKeys; name: TranslationKeys; address: TranslationKeys }
> = {
	order: {
		no: localizationConstants.purchaseCreateOrderNo,
		name: localizationConstants.purchaseCreateOrderName,
		address: localizationConstants.purchaseCreateOrderAddress,
	},
	project: {
		no: localizationConstants.purchaseCreateProjectNo,
		name: localizationConstants.purchaseCreateProjectName,
		address: localizationConstants.purchaseCreateProjectAddress,
	},
};

/** Sample values for the read-only Information card. */
const INFO_PANEL = {
	purchaseNo: "I505",
	referenceNo: { order: "O2025-001", project: "P2025-001" },
	offerNo: "O1001",
	calculationNo: "K301",
};

/** Sample options for the "Koppla inköp" dropdown. */
const LINK_OPTIONS: Record<PurchaseObjectLinkType, string[]> = {
	order: ["Order P001", "Order P002"],
	project: ["Projekt 2025-001", "Projekt 2025-002"],
};

const EMPTY_CUSTOMER: CustomerDetails = {
	customer: "",
	address: "",
	postalCode: "",
	city: "",
	email: "",
	phone: "",
	orgOrPersonalNo: "",
};

const EMPTY_OBJECT: PurchaseObjectDetails = {
	referenceNo: "",
	referenceName: "",
	blockName: "",
	address: "",
	postalCode: "",
	city: "",
	deliverySameAsObject: false,
	deliveryAddress: "",
	deliveryPostalCode: "",
	deliveryCity: "",
};

export function CreatePurchaseObjectPage() {
	const t = useTranslate();
	const router = useRouter();

	const [formData, setFormData] = useState<CreatePurchaseObjectFormData>({
		linkType: "project",
		linkedTo: "",
		customer: EMPTY_CUSTOMER,
		object: EMPTY_OBJECT,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const labels = LABELS[formData.linkType];

	const patchCustomer = (patch: Partial<CustomerDetails>) =>
		setFormData((previous) => ({
			...previous,
			customer: { ...previous.customer, ...patch },
		}));

	const patchObject = (patch: Partial<PurchaseObjectDetails>) =>
		setFormData((previous) => ({
			...previous,
			object: { ...previous.object, ...patch },
		}));

	/** Delivery mirrors the object address while the checkbox is ticked. */
	const delivery = formData.object.deliverySameAsObject
		? {
				deliveryAddress: formData.object.address,
				deliveryPostalCode: formData.object.postalCode,
				deliveryCity: formData.object.city,
			}
		: {
				deliveryAddress: formData.object.deliveryAddress,
				deliveryPostalCode: formData.object.deliveryPostalCode,
				deliveryCity: formData.object.deliveryCity,
			};

	const customerErrors = useMemo(
		() =>
			Object.fromEntries(
				Object.entries(errors)
					.filter(([key]) => key.startsWith("customer."))
					.map(([key, message]) => [
						key.slice("customer.".length),
						message,
					]),
			),
		[errors],
	);

	const handleSubmit = () => {
		const result = createPurchaseObjectSchema.safeParse({
			...formData,
			object: { ...formData.object, ...delivery },
		});

		if (!result.success) {
			const nextErrors: Record<string, string> = {};
			for (const issue of result.error.issues) {
				nextErrors[issue.path.join(".")] = issue.message;
			}
			setErrors(nextErrors);
			return;
		}

		setErrors({});
		showToast("success", t(localizationConstants.purchaseCreateSuccess));
		router.push(OVERVIEW_URL);
	};

	const objectField = (
		key: keyof PurchaseObjectDetails,
		labelKey: TranslationKeys,
		options: { placeholder?: string; value?: string; disabled?: boolean } = {},
	) => {
		const errorKey = `object.${key}`;
		return (
			<div className="space-y-1">
				<Label className="text-sm font-medium text-slate-700">
					<Translate text={labelKey} />
				</Label>
				<Input
					value={options.value ?? (formData.object[key] as string)}
					disabled={options.disabled}
					onChange={(event) =>
						patchObject({
							[key]: event.target.value,
						} as Partial<PurchaseObjectDetails>)
					}
					placeholder={options.placeholder ?? t(labelKey)}
					className={cn(
						FIELD_CLASS,
						options.disabled && "bg-slate-50 text-slate-500",
						errors[errorKey] &&
							"border-red-500 focus-visible:border-red-500",
					)}
				/>
				{errors[errorKey] && (
					<p className="mt-1 text-xs font-normal text-red-500">
						{t(errors[errorKey] as TranslationKeys)}
					</p>
				)}
			</div>
		);
	};

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				record={{
					title: t(localizationConstants.purchaseCreateTitle),
					description: `${t(localizationConstants.purchaseColNumber)}: ${INFO_PANEL.purchaseNo}`,
					backHref: OVERVIEW_URL,
				}}
			/>

			<div className="flex flex-1 flex-col overflow-y-auto">
				<div className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8 sm:px-6 xl:flex-row">
					{/* Form column */}
					<div className="flex min-w-0 flex-1 flex-col gap-4">
						{/* Link card */}
						<Card className="rounded-lg border border-slate-200 bg-white pb-4 shadow-none">
							<CardContent className="space-y-4 px-4 py-4">
								<RadioGroup
									value={formData.linkType}
									onValueChange={(value) =>
										setFormData((previous) => ({
											...previous,
											linkType:
												value as PurchaseObjectLinkType,
											linkedTo: "",
										}))
									}
									className="grid grid-cols-1 gap-4 sm:grid-cols-2"
								>
									{(
										[
											[
												"order",
												localizationConstants.purchaseCreateLinkOrder,
											],
											[
												"project",
												localizationConstants.purchaseCreateLinkProject,
											],
										] as [PurchaseObjectLinkType, TranslationKeys][]
									).map(([value, labelKey]) => (
										<Label
											key={value}
											htmlFor={`link-${value}`}
											className="flex h-11 cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-900 has-[:checked]:border-slate-400"
										>
											<RadioGroupItem
												id={`link-${value}`}
												value={value}
											/>
											<Translate text={labelKey} />
										</Label>
									))}
								</RadioGroup>

								<div className="space-y-1">
									<Label className="text-base font-semibold text-slate-900">
										<Translate
											text={
												localizationConstants.purchaseCreateLinkSection
											}
										/>
									</Label>
									<Select
										value={formData.linkedTo}
										onValueChange={(linkedTo) =>
											setFormData((previous) => ({
												...previous,
												linkedTo,
											}))
										}
									>
										<SelectTrigger
											className={cn(
												"h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-700 shadow-none",
												errors.linkedTo &&
													"border-red-500",
											)}
										>
											<SelectValue
												placeholder={t(
													localizationConstants.purchaseCreateSelectPlaceholder,
												)}
											/>
										</SelectTrigger>
										<SelectContent className="bg-white">
											{LINK_OPTIONS[
												formData.linkType
											].map((option) => (
												<SelectItem
													key={option}
													value={option}
												>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.linkedTo && (
										<p className="mt-1 text-xs font-normal text-red-500">
											{t(
												errors.linkedTo as TranslationKeys,
											)}
										</p>
									)}
								</div>

								<div className="flex justify-end">
									<Button
										type="button"
										className="h-10 min-w-[120px] cursor-pointer bg-[#111721] text-sm font-medium text-white shadow-none hover:bg-slate-800"
									>
										<Translate
											text={
												localizationConstants.purchaseCreateLinkButton
											}
										/>
									</Button>
								</div>
							</CardContent>
						</Card>

						<CustomerDetailsCard
							value={formData.customer}
							onChange={patchCustomer}
							errors={customerErrors}
							customerLabelKey={
								localizationConstants.purchaseCreateCompanyLabel
							}
						/>

						{/* Object card */}
						<Card className="rounded-lg border border-slate-200 bg-white pb-4 shadow-none">
							<CardHeader className="flex h-12 flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
								<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
									<Folder className="h-5 w-5 text-slate-700" />
									<span>
										<Translate
											text={
												localizationConstants.purchaseCreateObjectSection
											}
										/>
										{formData.object.referenceName
											? ` / ${formData.object.referenceName}`
											: ""}
									</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 px-4 py-0">
								<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
									{objectField("referenceNo", labels.no)}
									{objectField("referenceName", labels.name)}
								</div>

								{objectField(
									"blockName",
									localizationConstants.purchaseCreateBlockName,
									{
										placeholder: t(
											localizationConstants.purchaseCreateBlockNamePlaceholder,
										),
									},
								)}

								<div className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900">
									<Truck className="h-4 w-4 text-slate-700" />
									<Translate
										text={
											localizationConstants.purchaseCreateDelivery
										}
									/>
								</div>

								{objectField("address", labels.address)}

								<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
									{objectField(
										"postalCode",
										localizationConstants.orderPostNrLabel,
										{
											placeholder: t(
												localizationConstants.placeholderPostalCode,
											),
										},
									)}
									{objectField(
										"city",
										localizationConstants.orderCityLabel,
										{
											placeholder: t(
												localizationConstants.placeholderCity,
											),
										},
									)}
								</div>

								<Label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900">
									<Checkbox
										checked={
											formData.object.deliverySameAsObject
										}
										onCheckedChange={(checked) =>
											patchObject({
												deliverySameAsObject:
													checked === true,
											})
										}
									/>
									<Translate
										text={
											localizationConstants.purchaseCreateDeliverySameAsObject
										}
									/>
								</Label>

								{objectField(
									"deliveryAddress",
									localizationConstants.purchaseCreateDeliveryAddress,
									{
										placeholder: t(
											localizationConstants.purchaseCreateDeliveryAddressPlaceholder,
										),
										value: delivery.deliveryAddress,
										disabled:
											formData.object
												.deliverySameAsObject,
									},
								)}

								<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
									{objectField(
										"deliveryPostalCode",
										localizationConstants.orderPostNrLabel,
										{
											placeholder: t(
												localizationConstants.placeholderPostalCode,
											),
											value: delivery.deliveryPostalCode,
											disabled:
												formData.object
													.deliverySameAsObject,
										},
									)}
									{objectField(
										"deliveryCity",
										localizationConstants.orderCityLabel,
										{
											placeholder: t(
												localizationConstants.placeholderCity,
											),
											value: delivery.deliveryCity,
											disabled:
												formData.object
													.deliverySameAsObject,
										},
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Information panel */}
					<div className="w-full shrink-0 xl:w-72">
						<div className="sticky top-4 space-y-3.5 rounded-lg border border-slate-200 bg-white p-4 shadow-none">
							<h2 className="text-base font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.purchaseCreateInfoSection
									}
								/>
							</h2>

							{(
								[
									[
										localizationConstants.purchaseColNumber,
										INFO_PANEL.purchaseNo,
									],
									[
										labels.no,
										INFO_PANEL.referenceNo[
											formData.linkType
										],
									],
									[
										localizationConstants.purchaseCreateInfoOfferNo,
										INFO_PANEL.offerNo,
									],
									[
										localizationConstants.purchaseCreateInfoCalcNo,
										INFO_PANEL.calculationNo,
									],
								] as [TranslationKeys, string][]
							).map(([labelKey, value]) => (
								<div key={labelKey} className="space-y-0.5">
									<p className="text-sm font-medium text-slate-900">
										<Translate text={labelKey} />
									</p>
									<p className="text-sm text-slate-500">
										{value}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Sticky action bar */}
				<div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white py-3 shadow-sm">
					<div className="flex flex-wrap items-center justify-end gap-3 px-4 sm:px-6">
						<Button
							type="button"
							variant="ghost"
							onClick={() => router.push(OVERVIEW_URL)}
							className="h-9 min-w-[100px] cursor-pointer border border-slate-300 bg-transparent px-5 text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
						>
							<Translate
								text={localizationConstants.cancelButton}
							/>
						</Button>
						<Button
							type="button"
							onClick={handleSubmit}
							className="h-9 min-w-[120px] cursor-pointer gap-2 bg-[#111721] text-white shadow-none hover:bg-slate-800"
						>
							<span>
								<Translate
									text={
										localizationConstants.purchaseCreateSubmit
									}
								/>
							</span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreatePurchaseObjectPage;
