"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	ArrowRight,
	Save,
	CircleFadingPlus,
	Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type {
	CreateOrderFormData,
	CustomerInfoData,
	ContactPersonData,
	OrderInfoData,
	OrderDocumentItem,
	ContractorOrganizationData,
	OrderOrganizationSummaryRow,
} from "./types";
import {
	createOrderAPIAction,
	saveOrderDraftAPIAction,
} from "./api/orderCreateApi";
import {
	customerInfoSchema,
	contactPersonSchema,
	orderInfoSchema,
	createOrderSchema,
} from "./schema";
import { Step1CustomerInfo } from "./steps/Step1CustomerInfo";
import { Step2OrderInfo } from "./steps/Step2OrderInfo";
import { Step3Documents } from "./steps/Step3Documents";
import { Step4Contractor } from "./steps/Step4Contractor";
import { Step5Preview } from "./steps/Step5Preview";

const TOTAL_STEPS = 5;

export function CreateOrderWizard() {
	const t = useTranslate();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSavingDraft, setIsSavingDraft] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [formData, setFormData] = useState<CreateOrderFormData>({
		customerInfo: {
			customer: "",
			address: "",
			postalCode: "",
			city: "",
			email: "",
			phone: "",
			orgOrPersonalNo: "",
		},
		contactPerson: {
			firstName: "",
			lastName: "",
			email: "",
			mobile: "",
			role: "Beställare",
		},
		orderInfo: {
			orderNo: "",
			orderName: "",
			blockName: "",
			orderAddress: "",
			postalCode: "",
			city: "",
			type: "",
			category: "",
			department: "",
			contractSum: "",
			offerNo: "",
			startDate: "",
			endDate: "",
		},
		documents: [],
		contractor: {
			contractorType: "",
			organizationName: "",
			address: "",
			postalCode: "",
			city: "",
			email: "",
			phone: "",
			selectedContactTags: [],
			contacts: [],
		},
		organizationsList: [],
	});

	const handleCustomerInfoChange = (data: Partial<CustomerInfoData>) => {
		setFormData((prev) => ({
			...prev,
			customerInfo: { ...prev.customerInfo, ...data },
		}));
		setErrors((prev) => {
			const updated = { ...prev };
			for (const key of Object.keys(data)) {
				delete updated[key];
			}
			return updated;
		});
	};

	const handleContactPersonChange = (data: Partial<ContactPersonData>) => {
		setFormData((prev) => ({
			...prev,
			contactPerson: { ...prev.contactPerson, ...data },
		}));
		setErrors((prev) => {
			const updated = { ...prev };
			for (const key of Object.keys(data)) {
				const errKey = key === "email" ? "contactEmail" : key;
				delete updated[errKey];
			}
			return updated;
		});
	};

	const handleOrderInfoChange = (data: Partial<OrderInfoData>) => {
		setFormData((prev) => ({
			...prev,
			orderInfo: { ...prev.orderInfo, ...data },
		}));
		setErrors((prev) => {
			const updated = { ...prev };
			for (const key of Object.keys(data)) {
				delete updated[key];
			}
			return updated;
		});
	};

	const handleDocumentsChange = (docs: OrderDocumentItem[]) => {
		setFormData((prev) => ({
			...prev,
			documents: docs,
		}));
	};

	const handleContractorChange = (data: Partial<ContractorOrganizationData>) => {
		setFormData((prev) => ({
			...prev,
			contractor: { ...prev.contractor, ...data },
		}));
	};

	const handleOrganizationsListChange = (list: OrderOrganizationSummaryRow[]) => {
		setFormData((prev) => ({
			...prev,
			organizationsList: list,
		}));
	};

	const handleSaveDraft = async () => {
		setIsSavingDraft(true);
		try {
			await saveOrderDraftAPIAction(formData);
			showToast("info", t(localizationConstants.draftSaved));
		} catch {
			showToast("error", t(localizationConstants.orderSaveDraftError));
		} finally {
			setIsSavingDraft(false);
		}
	};

	const handleNext = () => {
		if (currentStep === 1) {
			const resKund = customerInfoSchema.safeParse(formData.customerInfo);
			const resContact = contactPersonSchema.safeParse(formData.contactPerson);
			const newErrors: Record<string, string> = {};

			if (!resKund.success) {
				for (const issue of resKund.error.issues) {
					const field = issue.path[0];
					if (field && !newErrors[String(field)]) {
						newErrors[String(field)] = t(issue.message as TranslationKeys);
					}
				}
			}

			if (!resContact.success) {
				for (const issue of resContact.error.issues) {
					const field = issue.path[0];
					const errKey = field === "email" ? "contactEmail" : String(field);
					if (field && !newErrors[errKey]) {
						newErrors[errKey] = t(issue.message as TranslationKeys);
					}
				}
			}

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				showToast("error", Object.values(newErrors)[0]);
				return;
			}
			setErrors({});
		} else if (currentStep === 2) {
			const resOrder = orderInfoSchema.safeParse(formData.orderInfo);
			const newErrors: Record<string, string> = {};

			if (!resOrder.success) {
				for (const issue of resOrder.error.issues) {
					const field = issue.path[0];
					if (field && !newErrors[String(field)]) {
						newErrors[String(field)] = t(issue.message as TranslationKeys);
					}
				}
				setErrors(newErrors);
				showToast("error", Object.values(newErrors)[0]);
				return;
			}
			setErrors({});
		}

		if (currentStep < TOTAL_STEPS) {
			setCurrentStep((prev) => prev + 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else {
			router.push("/module/production/order/overview");
		}
	};

	const handleCancel = () => {
		router.push("/module/production/order/overview");
	};

	const handleCreateOrder = async () => {
		if (isSubmitting) return;

		const fullCheck = createOrderSchema.safeParse({
			customerInfo: formData.customerInfo,
			contactPerson: formData.contactPerson,
			orderInfo: formData.orderInfo,
		});

		if (!fullCheck.success) {
			const rawMsg = fullCheck.error.errors[0]?.message;
			const msg = rawMsg ? t(rawMsg as TranslationKeys) : t(localizationConstants.orderCreateError);
			showToast("error", msg);
			return;
		}

		setIsSubmitting(true);
		try {
			await createOrderAPIAction(formData);
			showToast("success", t(localizationConstants.orderCreateSuccess));
			router.push("/module/production/order/overview");
		} catch {
			showToast("error", t(localizationConstants.orderCreateError));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-slate-50">
			{/* Main Content Area */}
			<div className="flex-1 p-3">
				{/* Title with Back Arrow */}
				<div className="mb-1 flex items-center gap-2">
					<button
						type="button"
						aria-label={t(localizationConstants.orderGoBackLabel)}
						onClick={handleBack}
						className="rounded-md p-1 hover:bg-slate-100 cursor-pointer"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-xl font-semibold text-slate-900">
						{currentStep === 5
							? <Translate text={localizationConstants.orderPreviewTitle} />
							: <Translate text={localizationConstants.createOrderButton} />
						}
					</h1>
				</div>

				{/* Content below Title & Back Button with Left Gap */}
				<div className="pl-8 sm:pl-9">
					{/* Step Counter text */}
					<p className="mb-4 text-sm text-slate-500">
						<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
					</p>

					{/* Step Progress Card ABOVE Form on < xl screens */}
					{currentStep < 5 && (
						<div className="mb-4 rounded-lg border border-slate-200 bg-white p-3.5 xl:hidden">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
								</p>
								<span className="text-xs font-semibold text-slate-600">
									{Math.round((currentStep / TOTAL_STEPS) * 100)}%
								</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full bg-[#111721] transition-all duration-300 rounded-full"
									style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
								/>
							</div>
						</div>
					)}

					{/* Form Content + Right Sidebar for xl screens */}
					<div className="flex flex-col items-start gap-5 xl:flex-row">
					{/* Form Content */}
					<div className="w-full flex-1 min-w-0">
						{currentStep === 1 && (
							<Step1CustomerInfo
								customerInfo={formData.customerInfo}
								onCustomerInfoChange={handleCustomerInfoChange}
								contactPerson={formData.contactPerson}
								onContactPersonChange={handleContactPersonChange}
								onSaveCustomer={handleSaveDraft}
								errors={errors}
							/>
						)}

						{currentStep === 2 && (
							<Step2OrderInfo
								orderInfo={formData.orderInfo}
								onOrderInfoChange={handleOrderInfoChange}
								onSaveOrder={handleSaveDraft}
								errors={errors}
							/>
						)}

						{currentStep === 3 && (
							<Step3Documents
								documents={formData.documents}
								onDocumentsChange={handleDocumentsChange}
							/>
						)}

						{currentStep === 4 && (
							<Step4Contractor
								contractor={formData.contractor}
								onContractorChange={handleContractorChange}
								organizationsList={formData.organizationsList}
								onOrganizationsListChange={handleOrganizationsListChange}
							/>
						)}

						{currentStep === 5 && (
							<Step5Preview
								data={formData}
								onEditSection={(step) => setCurrentStep(step)}
								onOrganizationsListChange={handleOrganizationsListChange}
								onDocumentsChange={handleDocumentsChange}
							/>
						)}
					</div>

					{/* Step Progress Card on RIGHT side for xl screens (Spacer preserved on Step 5) */}
					<div className="hidden w-72 shrink-0 xl:block">
						{currentStep < 5 && (
							<div className="sticky top-[56px] rounded-lg border border-slate-200 bg-white p-4 space-y-3.5 shadow-none mt-[56px]">
								<div className="space-y-2.5">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium text-slate-900">
											<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
										</p>
										<span className="text-xs font-semibold text-slate-600">
											{Math.round((currentStep / TOTAL_STEPS) * 100)}%
										</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 mt-1">
										<div
											className="h-full bg-[#111721] transition-all duration-300 rounded-full"
											style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
										/>
									</div>
								</div>

								{/* Spara Button */}
								<Button
									type="button"
									variant="ghost"
									onClick={handleSaveDraft}
									disabled={isSavingDraft || isSubmitting}
									className="w-full h-9 gap-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-900 hover:bg-slate-200 cursor-pointer shadow-none"
								>
									{isSavingDraft ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Save className="h-4 w-4" />
									)}
									<span><Translate text={localizationConstants.saveDraftButton} /></span>
								</Button>

								{/* Step 4 Extra Action: Skapa nytt */}
								{currentStep === 4 && (
									<Button
										type="button"
										onClick={() => {
											handleContractorChange({
												address: "",
												postalCode: "",
												city: "",
												email: "",
												phone: "",
											});
											showToast(
												"info",
												t(localizationConstants.orderFormClearedInfo),
											);
										}}
										className="w-full h-9 gap-2 rounded-lg bg-[#111721] text-sm font-medium text-white hover:bg-slate-800 cursor-pointer shadow-none"
									>
										<CircleFadingPlus className="h-4 w-4" />
										<span><Translate text={localizationConstants.orderCreateNewButton} /></span>
									</Button>
								)}
							</div>
						)}
					</div>
				</div>
				</div>
			</div>

			{/* Sticky Bottom Action Bar */}
			<div className="sticky bottom-0 border-t border-slate-200 bg-white py-3 shadow-sm z-20">
				<div className="flex flex-wrap items-center justify-end gap-3 px-4 sm:px-6">
					{/* Avbryt button */}
					<Button
						type="button"
						variant="ghost"
						onClick={handleCancel}
						className="h-9 min-w-[100px] bg-transparent border border-slate-300 px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none cursor-pointer"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					{/* Tillbaka button (if step > 1) */}
					{currentStep > 1 && (
						<Button
							type="button"
							variant="ghost"
							onClick={handleBack}
							className="h-9 min-w-[120px] gap-2 bg-transparent border border-slate-300 px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none cursor-pointer"
						>
							<ArrowLeft className="h-4 w-4" />
							<span><Translate text={localizationConstants.orderCreateBackButton} /></span>
						</Button>
					)}

					{/* Next / Submit CTA */}
					{currentStep < 4 ? (
						<Button
							type="button"
							onClick={handleNext}
							className="h-9 min-w-[120px] gap-2 bg-[#111721] text-white hover:bg-slate-800 cursor-pointer shadow-none"
						>
							<span><Translate text={localizationConstants.nextButton} /></span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					) : currentStep === 4 ? (
						<Button
							type="button"
							onClick={handleNext}
							className="h-9 min-w-[160px] gap-2 bg-[#111721] text-white hover:bg-slate-800 cursor-pointer shadow-none"
						>
							<span><Translate text={localizationConstants.orderCreateSummaryButton} /></span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					) : (
						<Button
							type="button"
							disabled={isSubmitting || isSavingDraft}
							onClick={handleCreateOrder}
							className="h-9 min-w-[120px] gap-2 bg-[#111721] text-white hover:bg-slate-800 cursor-pointer shadow-none"
						>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Save className="h-4 w-4" />
							)}
							<span><Translate text={localizationConstants.orderCreateConfirmButton} /></span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
