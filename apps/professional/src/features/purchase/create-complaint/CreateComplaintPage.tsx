"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Folder, Save, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	PURCHASE_MODULE_BASE_URL,
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
} from "../data/purchaseNav.config";
import { ComplaintCompanyCard } from "./components/ComplaintCompanyCard";
import { ComplaintContactCard } from "./components/ComplaintContactCard";
import { ComplaintDocumentsCard } from "./components/ComplaintDocumentsCard";
import {
	collectComplaintErrors,
	complaintContactStepSchema,
	complaintReportStepSchema,
} from "./schema";
import {
	EMPTY_COMPLAINT_COMPANY,
	EMPTY_COMPLAINT_CONTACT,
	type ComplaintCompany,
	type ComplaintContact,
	type ComplaintDraft,
	type ComplaintInfo,
	type ComplaintPriority,
	type ComplaintReport,
} from "./types";

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-gray-300 focus-visible:outline-none";

const TOTAL_STEPS = 2;

/** Sample values for the read-only summary, as printed in the design. */
const SAMPLE_INFO = {
	purchaseNo: "I501-05",
	name: "Kök",
	object: "Projekt 2025-001",
	complaintType: "damaged_on_delivery",
};

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
	{ value: "high", label: localizationConstants.complaintPriorityHigh },
	{ value: "medium", label: localizationConstants.complaintPriorityMedium },
	{ value: "low", label: localizationConstants.complaintPriorityLow },
];

const SUPPLIER_OPTIONS = [
	{ id: "beijer", name: "Beijer" },
	{ id: "byggmax", name: "ByggMax" },
	{ id: "fredells", name: "Fredells" },
];

const CONTACT_OPTIONS = [
	{ id: "anders", name: "Anders Svensson" },
	{ id: "karin", name: "Karin Lund" },
];

export function CreateComplaintPage() {
	const t = useTranslate();
	const { t: translate } = useTranslation();
	const router = useRouter();

	const [step, setStep] = useState<1 | 2>(1);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [draft, setDraft] = useState<ComplaintDraft>({
		info: SAMPLE_INFO,
		supplierId: "",
		supplier: { ...EMPTY_COMPLAINT_COMPANY },
		supplierContact: { ...EMPTY_COMPLAINT_CONTACT },
		reporter: { ...EMPTY_COMPLAINT_COMPANY },
		reporterContact: { ...EMPTY_COMPLAINT_CONTACT },
		report: {
			title: "",
			description: "",
			discoveredAt: "",
			deliveredAt: "",
			priority: "high",
			gdprAccepted: false,
		},
	});

	const listHref = `${PURCHASE_MODULE_BASE_URL}/complaints`;

	const patchCompany =
		(key: "supplier" | "reporter") => (patch: Partial<ComplaintCompany>) =>
			setDraft((previous) => ({
				...previous,
				[key]: { ...previous[key], ...patch },
			}));

	const patchContact =
		(key: "supplierContact" | "reporterContact") =>
		(patch: Partial<ComplaintContact>) =>
			setDraft((previous) => ({
				...previous,
				[key]: { ...previous[key], ...patch },
			}));

	const patchInfo = (patch: Partial<ComplaintInfo>) =>
		setDraft((previous) => ({
			...previous,
			info: { ...previous.info, ...patch },
		}));

	const patchReport = (patch: Partial<ComplaintReport>) =>
		setDraft((previous) => ({
			...previous,
			report: { ...previous.report, ...patch },
		}));

	const errorFor = (block: string, field: string) =>
		errors[`${block}.${field}`];

	const contactErrors = (block: "supplierContact" | "reporterContact") =>
		Object.fromEntries(
			Object.entries(errors)
				.filter(([key]) => key.startsWith(`${block}.`))
				.map(([key, message]) => [key.split(".")[1], message]),
		) as Partial<Record<keyof ComplaintContact, string>>;

	const companyErrors = (block: "supplier" | "reporter") =>
		Object.fromEntries(
			Object.entries(errors)
				.filter(([key]) => key.startsWith(`${block}.`))
				.map(([key, message]) => [key.split(".")[1], message]),
		) as Partial<Record<keyof ComplaintCompany, string>>;

	const validateStep1 = () => {
		const result = complaintContactStepSchema.safeParse({
			supplier: draft.supplier,
			supplierContact: draft.supplierContact,
			reporter: draft.reporter,
			reporterContact: draft.reporterContact,
		});

		if (result.success) {
			setErrors({});
			return true;
		}

		setErrors(collectComplaintErrors(result.error));
		return false;
	};

	const validateStep2 = () => {
		const result = complaintReportStepSchema.safeParse(draft.report);

		if (result.success) {
			setErrors({});
			return true;
		}

		setErrors(collectComplaintErrors(result.error, "report"));
		return false;
	};

	const handleNext = () => {
		if (validateStep1()) setStep(2);
	};

	const handleSend = () => {
		if (!validateStep1()) {
			setStep(1);
			return;
		}
		if (!validateStep2()) return;

		showToast(
			"success",
			translate(localizationConstants.complaintCreateSentToast),
		);
		router.push(listHref);
	};

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
											<Input
												value={draft.info.purchaseNo}
												onChange={(event) =>
													patchInfo({
														purchaseNo: event.target
															.value,
													})
												}
												placeholder={t(
													localizationConstants.purchaseColNumber,
												)}
												className={FIELD_CLASS}
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
													setDraft((previous) => ({
														...previous,
														info: {
															...previous.info,
															complaintType:
																value,
														},
													}))
												}
											>
												<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-900 shadow-none">
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
									selectOptions={SUPPLIER_OPTIONS}
									selectedId={draft.supplierId}
									onSelect={(supplierId) =>
										setDraft((previous) => ({
											...previous,
											supplierId,
										}))
									}
								/>

								<ComplaintContactCard
									titleKey={
										localizationConstants.complaintCreateSupplierContactSection
									}
									value={draft.supplierContact}
									onChange={patchContact("supplierContact")}
									errors={contactErrors("supplierContact")}
									contactOptions={CONTACT_OPTIONS}
								/>

								<ComplaintCompanyCard
									titleKey={
										localizationConstants.complaintCreateReporterSection
									}
									value={draft.reporter}
									onChange={patchCompany("reporter")}
									errors={companyErrors("reporter")}
								/>

								<ComplaintContactCard
									titleKey={
										localizationConstants.complaintCreateReporterContactSection
									}
									value={draft.reporterContact}
									onChange={patchContact("reporterContact")}
									errors={contactErrors("reporterContact")}
									contactOptions={CONTACT_OPTIONS}
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
									onGdprChange={(gdprAccepted) =>
										patchReport({ gdprAccepted })
									}
								/>
							</>
						)}
					</div>

					{/* Progress panel */}
					<div className="w-full shrink-0 xl:w-80">
						<div className="sticky top-4 space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-none">
							<div className="space-y-2.5">
								<p className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.complaintCreateStep
										}
									/>{" "}
									{step}/{TOTAL_STEPS}
								</p>
								<div
									className="h-1.5 w-full rounded-full bg-slate-200"
									role="progressbar"
									aria-valuenow={step}
									aria-valuemin={1}
									aria-valuemax={TOTAL_STEPS}
								>
									<div
										className="h-1.5 rounded-full bg-slate-900 transition-all"
										style={{
											width: `${(step / TOTAL_STEPS) * 100}%`,
										}}
									/>
								</div>
							</div>

							{step === 2 && (
								<Button
									type="button"
									onClick={handleSend}
									className="h-10 w-full cursor-pointer gap-2 rounded-md bg-[#111721] text-sm font-medium text-white hover:bg-slate-800"
								>
									<Send className="h-4 w-4" />
									<Translate
										text={
											localizationConstants.complaintCreateSend
										}
									/>
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Action bar */}
			<div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white py-3 shadow-sm">
				<div className="flex flex-wrap items-center justify-end gap-3 px-6">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push(listHref)}
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
							onClick={() =>
								showToast(
									"info",
									translate(
										localizationConstants.complaintCreatePreviewToast,
									),
								)
							}
							className="h-10 cursor-pointer border-slate-300 bg-white text-sm text-slate-700 shadow-none hover:bg-slate-100"
						>
							<Translate
								text={
									localizationConstants.complaintCreatePreview
								}
							/>
						</Button>
					)}

					<Button
						type="button"
						onClick={() =>
							showToast(
								"success",
								translate(
									localizationConstants.complaintCreateSavedToast,
								),
							)
						}
						className="h-10 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white shadow-none hover:bg-slate-800"
					>
						<Save className="h-4 w-4" />
						<Translate text={localizationConstants.confirmSave} />
					</Button>

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
