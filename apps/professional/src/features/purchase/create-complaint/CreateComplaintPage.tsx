"use client";

import { ArrowRight, Folder, Save } from "lucide-react";

import { PermissionGate } from "@/components/common/PermissionGate";
import { SearchableSelect } from "@/components/form";
import { ModulePageHeader } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
} from "../data/purchaseNav.config";
import type { ComplaintPriority } from "./types";
import {
	COMPLAINT_ACCEPT_EXTENSIONS,
	useCreateComplaintForm,
} from "./useCreateComplaintForm";
import { ComplaintCompanyCard } from "./components/ComplaintCompanyCard";
import { ContactPersonCard } from "../components/shared/ContactPersonCard";
import { ComplaintDocumentsCard } from "./components/ComplaintDocumentsCard";
import { ComplaintStepRail } from "./components/ComplaintStepRail";

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-gray-300 focus-visible:outline-none";

const TOTAL_STEPS = 2;

const COMPLAINT_TYPES: { value: string; label: TranslationKeys }[] = [
	{
		value: "damaged_on_delivery",
		label: localizationConstants.complaintTypeDamagedOnDelivery,
	},
	{
		value: "wrong_delivery",
		label: localizationConstants.complaintTypeWrongDelivery,
	},
	{
		value: "missing_parts",
		label: localizationConstants.complaintTypeMissingParts,
	},
];

const PRIORITIES: { value: ComplaintPriority; label: TranslationKeys }[] = [
	{ value: "high", label: localizationConstants.purchaseComplaintPriorityHigh },
	{ value: "medium", label: localizationConstants.purchaseComplaintPriorityMedium },
	{ value: "low", label: localizationConstants.purchaseComplaintPriorityLow },
];

export interface CreateComplaintPageProps {
	/**
	 * Purchase the complaint is being raised against, when the wizard was
	 * opened from that record. Already validated and resolved by the route.
	 */
	prefillPurchaseNo?: string;
}

export function CreateComplaintPage({
	prefillPurchaseNo,
}: CreateComplaintPageProps) {
	const t = useTranslate();
	const {
		purchaseOptions,
		supplierOptions,
		contactOptions,
		step,
		setStep,
		draft,
		errors,
		blockErrors,
		listHref,
		patchInfo,
		patchCompany,
		patchContact,
		patchReport,
		setSupplierId,
		selectPurchase,
		goNext,
		submit,
		saveDraft,
		documents,
		cancel,
	} = useCreateComplaintForm(prefillPurchaseNo);

	const errorFor = (block: string, field: string) =>
		errors[`${block}.${field}`];

	const contactErrors = blockErrors.contact;
	const companyErrors = blockErrors.company;
	const handlePurchasePick = selectPurchase;
	const handleNext = goNext;
	const handleSend = submit;

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				record={{
					title: t(localizationConstants.complaintCreateTitle),
					description: `${t(localizationConstants.complaintCreateStep)} ${step}/${TOTAL_STEPS}`,
					backHref: listHref,
				}}
			/>

			<div className="flex flex-1 flex-col overflow-y-auto">
				{/* Step navigation, doubling as the design's two tabs. */}
				<div className="flex items-center gap-6 border-b border-slate-200 bg-white px-6 pt-2">
					{(
						[
							[1, localizationConstants.complaintCreateTabContact],
							[2, localizationConstants.complaintCreateTabReport],
						] as const
					).map(([value, label]) => (
						<button
							key={value}
							type="button"
							onClick={() => setStep(value)}
							className={cn(
								"relative cursor-pointer pb-3 text-sm font-medium transition-colors",
								step === value
									? "font-semibold text-slate-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-slate-900"
									: "text-slate-500 hover:text-slate-800",
							)}
						>
							<Translate text={label} />
						</button>
					))}
				</div>

				<div className="flex flex-1 flex-col gap-6 px-6 py-5 xl:flex-row">
					<div className="flex-1 space-y-4">
						{step === 1 ? (
							<>
								<Card className="rounded-lg border border-slate-200 bg-white pb-4 shadow-none">
									<CardHeader className="flex h-12 flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
										<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
											<Folder className="h-5 w-5 text-slate-700" />
											<Translate
												text={
													localizationConstants.complaintCreateInfoSection
												}
											/>
										</CardTitle>
									</CardHeader>
									<CardContent className="grid grid-cols-1 items-start gap-4 px-4 py-0 lg:grid-cols-2">
										<div className="space-y-1">
											<Label className="text-sm font-medium text-slate-700">
												<Translate
													text={
														localizationConstants.purchaseColNumber
													}
												/>
											</Label>
											<SearchableSelect
												value={draft.info.purchaseNo}
												onChange={handlePurchasePick}
												options={purchaseOptions}
												placeholder={t(
													localizationConstants.purchaseColNumber,
												)}
												searchPlaceholder={t(
													localizationConstants.search,
												)}
											/>
										</div>
										<div className="space-y-1">
											<Label className="text-sm font-medium text-slate-700">
												<Translate
													text={
														localizationConstants.purchaseColName
													}
												/>
											</Label>
											<Input
												value={draft.info.name}
												onChange={(event) =>
													patchInfo({
														name: event.target
															.value,
													})
												}
												placeholder={t(
													localizationConstants.purchaseColName,
												)}
												className={FIELD_CLASS}
											/>
										</div>
										<div className="space-y-1">
											<Label className="text-sm font-medium text-slate-700">
												<Translate
													text={
														localizationConstants.purchaseColObject
													}
												/>
											</Label>
											<Input
												value={draft.info.object}
												onChange={(event) =>
													patchInfo({
														object: event.target
															.value,
													})
												}
												placeholder={t(
													localizationConstants.purchaseColObject,
												)}
												className={FIELD_CLASS}
											/>
										</div>
										<div className="space-y-1">
											<Label className="text-sm font-medium text-slate-700">
												<Translate
													text={
														localizationConstants.complaintFieldType
													}
												/>
											</Label>
											<Select
												value={
													draft.info.complaintType
												}
												onValueChange={(value) =>
													patchInfo({
														complaintType: value,
													})
												}
											>
												<SelectTrigger
													className={cn(
														"h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-900 shadow-none",
														errorFor(
															"info",
															"complaintType",
														) && "border-red-500",
													)}
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="bg-white">
													{COMPLAINT_TYPES.map(
														(option) => (
															<SelectItem
																key={
																	option.value
																}
																value={
																	option.value
																}
															>
																<Translate
																	text={
																		option.label
																	}
																/>
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											{errorFor(
												"info",
												"complaintType",
											) && (
												<p className="mt-1 text-xs font-normal text-red-500">
													{t(
														errorFor(
															"info",
															"complaintType",
														) as TranslationKeys,
													)}
												</p>
											)}
										</div>
									</CardContent>
								</Card>

								<ComplaintCompanyCard
									titleKey={
										localizationConstants.complaintCreateSupplierSection
									}
									value={draft.supplier}
									onChange={patchCompany("supplier")}
									errors={companyErrors("supplier")}
									selectOptions={supplierOptions}
									selectError={errors.supplierId}
									selectedId={draft.supplierId}
									onSelect={setSupplierId}
								/>

								<ContactPersonCard
									titleKey={
										localizationConstants.complaintCreateSupplierContactSection
									}
									value={draft.supplierContact}
									onChange={patchContact("supplierContact")}
									errors={contactErrors("supplierContact")}
									contactOptions={contactOptions}
								/>

								<ComplaintCompanyCard
									titleKey={
										localizationConstants.complaintCreateReporterSection
									}
									value={draft.reporter}
									onChange={patchCompany("reporter")}
									errors={companyErrors("reporter")}
								/>

								<ContactPersonCard
									titleKey={
										localizationConstants.complaintCreateReporterContactSection
									}
									value={draft.reporterContact}
									onChange={patchContact("reporterContact")}
									errors={contactErrors("reporterContact")}
									contactOptions={contactOptions}
								/>
							</>
						) : (
							<>
								<Card className="rounded-lg border border-slate-200 bg-white pb-4 shadow-none">
									<CardHeader className="flex h-12 flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
										<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
											<Folder className="h-5 w-5 text-slate-700" />
											<Translate
												text={
													localizationConstants.complaintCreateReportSection
												}
											/>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4 px-4 py-0">
										<div className="space-y-1">
											<Label className="text-sm font-medium text-slate-700">
												<Translate
													text={
														localizationConstants.complaintFieldShortTitle
													}
												/>
											</Label>
											<Input
												value={draft.report.title}
												onChange={(event) =>
													patchReport({
														title: event.target
															.value,
													})
												}
												placeholder={t(
													localizationConstants.complaintFieldShortTitle,
												)}
												className={cn(
													FIELD_CLASS,
													errorFor(
														"report",
														"title",
													) && "border-red-500",
												)}
											/>
											{errorFor("report", "title") && (
												<p className="mt-1 text-xs font-normal text-red-500">
													{t(
														errorFor(
															"report",
															"title",
														) as TranslationKeys,
													)}
												</p>
											)}
										</div>

										<div className="space-y-1">
											<Label className="text-sm font-medium text-slate-700">
												<Translate
													text={
														localizationConstants.complaintFieldDescription
													}
												/>
											</Label>
											<Textarea
												value={draft.report.description}
												onChange={(event) =>
													patchReport({
														description:
															event.target.value,
													})
												}
												placeholder={t(
													localizationConstants.complaintFieldDescription,
												)}
												className={cn(
													"min-h-24 rounded-md border-slate-200 shadow-none",
													errorFor(
														"report",
														"description",
													) && "border-red-500",
												)}
											/>
											{errorFor(
												"report",
												"description",
											) && (
												<p className="mt-1 text-xs font-normal text-red-500">
													{t(
														errorFor(
															"report",
															"description",
														) as TranslationKeys,
													)}
												</p>
											)}
										</div>

										<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
											<div className="space-y-1">
												<Label className="text-sm font-medium text-slate-700">
													<Translate
														text={
															localizationConstants.complaintFieldDiscoveredAt
														}
													/>
												</Label>
												<Input
													type="date"
													value={
														draft.report
															.discoveredAt
													}
													onChange={(event) =>
														patchReport({
															discoveredAt:
																event.target
																	.value,
														})
													}
													className={FIELD_CLASS}
												/>
											</div>
											<div className="space-y-1">
												<Label className="text-sm font-medium text-slate-700">
													<Translate
														text={
															localizationConstants.complaintFieldDeliveredAt
														}
													/>
												</Label>
												<Input
													type="date"
													value={
														draft.report
															.deliveredAt
													}
													onChange={(event) =>
														patchReport({
															deliveredAt:
																event.target
																	.value,
														})
													}
													className={FIELD_CLASS}
												/>
											</div>
										</div>

										<div className="space-y-1">
											<Label className="text-sm font-medium text-slate-700">
												<Translate
													text={
														localizationConstants.complaintFieldPriority
													}
												/>
											</Label>
											<Select
												value={draft.report.priority}
												onValueChange={(value) =>
													patchReport({
														priority:
															value as ComplaintPriority,
													})
												}
											>
												<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-900 shadow-none">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="bg-white">
													{PRIORITIES.map(
														(option) => (
															<SelectItem
																key={
																	option.value
																}
																value={
																	option.value
																}
															>
																<Translate
																	text={
																		option.label
																	}
																/>
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
										</div>
									</CardContent>
								</Card>

								<ComplaintDocumentsCard
									gdprAccepted={draft.report.gdprAccepted}
									onGdprChange={(accepted) =>
										patchReport({
											gdprAccepted: accepted,
										})
									}
									gdprError={errorFor(
										"report",
										"gdprAccepted",
									)}
									documents={documents}
									acceptExtensions={
										COMPLAINT_ACCEPT_EXTENSIONS
									}
								/>
							</>
						)}
					</div>

					<ComplaintStepRail
						step={step}
						totalSteps={TOTAL_STEPS}
						onSend={handleSend}
					/>
				</div>
			</div>

			{/* Action bar */}
			<div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white py-3 shadow-sm">
				<div className="flex flex-wrap items-center justify-end gap-3 px-6">
					<Button
						type="button"
						variant="outline"
						onClick={cancel}
						className="h-10 min-w-25 cursor-pointer border-slate-300 bg-white text-sm text-slate-700 shadow-none hover:bg-slate-100"
					>
						<Translate
							text={localizationConstants.cancelButton}
						/>
					</Button>

					{step === 2 && (
						<Button
							type="button"
							variant="outline"
							disabled
							title={t(
								localizationConstants.complaintCreateUnavailable,
							)}
							className="h-10 border-slate-300 bg-white text-sm text-slate-700 shadow-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Translate
								text={
									localizationConstants.complaintCreatePreview
								}
							/>
						</Button>
					)}

					{/* Saves whatever is filled in so far; a draft is
					    deliberately not validated. */}
					<PermissionGate permission="CREATE_PURCHASE">
						<Button
							type="button"
							onClick={saveDraft}
							className="h-10 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white shadow-none hover:bg-slate-800"
						>
							<Save className="h-4 w-4" aria-hidden />
							<Translate
								text={localizationConstants.confirmSave}
							/>
						</Button>
					</PermissionGate>

					{step === 1 && (
						<Button
							type="button"
							onClick={handleNext}
							className="h-10 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white shadow-none hover:bg-slate-800"
						>
							<Translate
								text={localizationConstants.nextButton}
							/>
							<ArrowRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

export default CreateComplaintPage;
