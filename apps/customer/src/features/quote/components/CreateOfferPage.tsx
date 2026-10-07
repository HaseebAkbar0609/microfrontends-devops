"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	Save,
	ArrowRight,
	Plus,
	Loader2,
	UsersRound,
	Info,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { projectMessages } from "@/constants/messages";
import { MODAL_CONSTANTS, type ModalType } from "@/constants/constant";
import {
	createOfferSchema,
	CreateOfferFormValues,
	DEFAULT_OFFER_FORM_VALUES,
	QuoteSupplier,
} from "../types/form";
import useModal from "@/features/auth/hooks/useModal";
import { CreateOfferForm } from "./CreateOfferForm";
import {
	NewInvitationForm,
	NewInvitationFormValues,
} from "./steps/NewInvitationForm";
import {
	getCustomerCategoriesListAPIAction,
	getProjectByIdAPIAction,
	getProfessionalsSubcategoriesListAPIAction,
	saveProjectAPIAction,
	saveProjectDraftAPIAction,
	type SaveProjectPayload,
} from "@/api-actions";
import { showToast } from "@/lib/toast";
import { mapProjectDetailToFormHydration } from "../utils/projectDetailToForm";
import type { FormSelectOption } from "@/components/form";
import type { CustomerCategory } from "@/types/category";

/** Fields validated per step (matches Next); step 5 uses full `trigger()` in save/next */
const CREATE_OFFER_STEP_VALIDATION_FIELDS: Record<
	number,
	(keyof CreateOfferFormValues)[]
> = {
	1: [
		"firstName",
		"lastName",
		"mobileNumber",
		"personalEmail",
		"address",
		"city",
		"pincode",
	],
	2: [
		"projectName",
		"isExpressJob",
		"category",
		"projectAddress",
		"projectCity",
		"projectPostalCode",
	],
	3: ["description", "documents"],
	4: ["invitedSuppliers"],
};

const CUSTOMER_CATEGORY_PAGE_SIZE = 40;

export default function CreateOfferPage() {
	const router = useRouter();
	const t = useTranslate();
	const searchParams = useSearchParams();
	const resumeProjectId = searchParams.get("projectId");
	const [resumeReady, setResumeReady] = useState(!resumeProjectId);
	const [currentStep, setCurrentStep] = useState(1);
	const [projectId, setProjectId] = useState<string | undefined>();
	const [isNextLoading, setIsNextLoading] = useState(false);
	const [isSaveLoading, setIsSaveLoading] = useState(false);
	const { isOpen, openModal, closeModal, type } = useModal<ModalType>();
	const totalSteps = 5;

	const [customerCategoryRows, setCustomerCategoryRows] = useState<
		FormSelectOption[]
	>([]);
	const [customerCategoryHasMore, setCustomerCategoryHasMore] =
		useState(false);
	const [customerCategoriesLoading, setCustomerCategoriesLoading] =
		useState(true);
	const [customerCategoriesLoadingMore, setCustomerCategoriesLoadingMore] =
		useState(false);
	const customerCategoryPageRef = useRef(1);
	const customerCategorySearchRef = useRef("");
	const categoryLabelsRef = useRef<Map<string, string>>(new Map());

	const [professionalSubcategoryOptions, setProfessionalSubcategoryOptions] =
		useState<FormSelectOption[]>([]);
	const [
		professionalSubcategoriesLoading,
		setProfessionalSubcategoriesLoading,
	] = useState(true);

	const mapCategoriesToOptions = (
		list: CustomerCategory[],
	): FormSelectOption[] => list.map((c) => ({ value: c.id, label: c.name }));

	const form = useForm<CreateOfferFormValues>({
		resolver: zodResolver(createOfferSchema),
		defaultValues: DEFAULT_OFFER_FORM_VALUES,
		mode: "onChange",
		reValidateMode: "onBlur",
	});

	const selectedCategoryIds = form.watch("category");

	const loadCustomerCategoriesPage = useCallback(
		async (page: number, search: string, append: boolean) => {
			const res = await getCustomerCategoriesListAPIAction({
				page,
				pageSize: CUSTOMER_CATEGORY_PAGE_SIZE,
				search: search.trim() || undefined,
			});
			if (!res.success || !res.data) {
				if (!append) {
					setCustomerCategoryRows([]);
					setCustomerCategoryHasMore(false);
				} else {
					setCustomerCategoryHasMore(false);
				}
				return;
			}
			const mapped = mapCategoriesToOptions(res.data);
			if (mapped.length === 0) {
				setCustomerCategoryHasMore(false);
				if (!append) setCustomerCategoryRows([]);
				return;
			}
			for (const o of mapped) {
				categoryLabelsRef.current.set(
					o.value,
					typeof o.label === "string" ? o.label : String(o.label),
				);
			}
			if (append) {
				setCustomerCategoryRows((prev) => {
					const seen = new Set(prev.map((p) => p.value));
					const next = [...prev];
					for (const o of mapped) {
						if (!seen.has(o.value)) {
							seen.add(o.value);
							next.push(o);
						}
					}
					const added = next.length - prev.length;
					setCustomerCategoryHasMore(
						added === 0
							? false
							: mapped.length >= CUSTOMER_CATEGORY_PAGE_SIZE,
					);
					return next;
				});
			} else {
				setCustomerCategoryRows(mapped);
				setCustomerCategoryHasMore(
					mapped.length >= CUSTOMER_CATEGORY_PAGE_SIZE,
				);
			}
			customerCategoryPageRef.current = page;
			customerCategorySearchRef.current = search;
		},
		[],
	);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			setProfessionalSubcategoriesLoading(true);
			const prof = await getProfessionalsSubcategoriesListAPIAction();
			if (!cancelled) {
				setProfessionalSubcategoriesLoading(false);
				if (prof.success && prof.data?.length) {
					setProfessionalSubcategoryOptions(
						mapCategoriesToOptions(prof.data),
					);
				}
			}
			if (cancelled) return;
			setCustomerCategoriesLoading(true);
			await loadCustomerCategoriesPage(1, "", false);
			if (!cancelled) setCustomerCategoriesLoading(false);
		})();
		return () => {
			cancelled = true;
		};
	}, [loadCustomerCategoriesPage]);

	const handleCategoryLoadMore = useCallback(async () => {
		if (!customerCategoryHasMore || customerCategoriesLoadingMore) return;
		setCustomerCategoriesLoadingMore(true);
		try {
			await loadCustomerCategoriesPage(
				customerCategoryPageRef.current + 1,
				customerCategorySearchRef.current,
				true,
			);
		} finally {
			setCustomerCategoriesLoadingMore(false);
		}
	}, [
		customerCategoryHasMore,
		customerCategoriesLoadingMore,
		loadCustomerCategoriesPage,
	]);

	const handleCategorySearchChange = useCallback(
		async (q: string) => {
			setCustomerCategoriesLoading(true);
			try {
				await loadCustomerCategoriesPage(1, q, false);
			} finally {
				setCustomerCategoriesLoading(false);
			}
		},
		[loadCustomerCategoriesPage],
	);

	const customerCategoryOptions = useMemo(() => {
		const byId = new Map<string, FormSelectOption>();
		for (const o of customerCategoryRows) {
			byId.set(o.value, o);
		}
		for (const id of selectedCategoryIds ?? []) {
			if (!id?.trim() || byId.has(id)) continue;
			const label = categoryLabelsRef.current.get(id) ?? id;
			byId.set(id, { value: id, label });
		}
		return Array.from(byId.values());
	}, [customerCategoryRows, selectedCategoryIds]);

	const invitedSuppliers = form.watch("invitedSuppliers") || [];
	const internalSuppliers = form.watch("internalSuppliers") || [];
	const supplierRecipientTotal =
		invitedSuppliers.length + internalSuppliers.length;
	const getSupplierCategory = (supplier: QuoteSupplier) =>
		supplier.category || professionalSubcategoryOptions[0]?.value || "";
	const mapSuppliersForSave = (suppliers: QuoteSupplier[] | undefined) => {
		const selected_supplier_ids: string[] = [];
		const newSuppliers: {
			company_name: string;
			category?: string;
			organization_number: string;
			first_name: string;
			last_name: string;
			email: string;
			mobile_number: string;
		}[] = [];
		const uuidPattern =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		const seenCompanyIds = new Set<string>();
		const seenEmails = new Set<string>();
		const seenOrgs = new Set<string>();

		suppliers?.forEach((supplier) => {
			if (uuidPattern.test(supplier.id)) {
				if (!seenCompanyIds.has(supplier.id)) {
					seenCompanyIds.add(supplier.id);
					selected_supplier_ids.push(supplier.id);
				}
			} else {
				const emailKey = supplier.emailAddress?.trim().toLowerCase();
				const orgKey = supplier.orgNumber?.trim();

				if (emailKey) {
					if (!seenEmails.has(emailKey)) {
						seenEmails.add(emailKey);
						if (orgKey) seenOrgs.add(orgKey);
						newSuppliers.push({
							company_name: supplier.companyName,
							category: getSupplierCategory(supplier) || undefined,
							organization_number: supplier.orgNumber,
							first_name: supplier.contactFirstName,
							last_name: supplier.contactLastName,
							email: supplier.emailAddress,
							mobile_number: supplier.mobileNumber,
						});
					}
				} else if (orgKey) {
					if (!seenOrgs.has(orgKey)) {
						seenOrgs.add(orgKey);
						newSuppliers.push({
							company_name: supplier.companyName,
							category: getSupplierCategory(supplier) || undefined,
							organization_number: supplier.orgNumber,
							first_name: supplier.contactFirstName,
							last_name: supplier.contactLastName,
							email: supplier.emailAddress,
							mobile_number: supplier.mobileNumber,
						});
					}
				} else {
					newSuppliers.push({
						company_name: supplier.companyName,
						category: getSupplierCategory(supplier) || undefined,
						organization_number: supplier.orgNumber,
						first_name: supplier.contactFirstName,
						last_name: supplier.contactLastName,
						email: supplier.emailAddress,
						mobile_number: supplier.mobileNumber,
					});
				}
			}
		});

		return {
			selected_supplier_ids,
			suppliers: newSuppliers,
		};
	};

	useEffect(() => {
		if (!resumeProjectId?.trim()) {
			setResumeReady(true);
			return;
		}
		let cancelled = false;
		setResumeReady(false);
		void (async () => {
			const result = await getProjectByIdAPIAction(
				resumeProjectId.trim(),
			);
			if (cancelled) return;
			if (!result.success || !result.data) {
				showToast("error", result.error || projectMessages.load.projectFailed);
				setResumeReady(true);
				return;
			}
			const { values, step } = mapProjectDetailToFormHydration(
				result.data,
			);
			setProjectId(resumeProjectId.trim());
			form.reset({
				...DEFAULT_OFFER_FORM_VALUES,
				...values,
			});
			setCurrentStep(step);
			setResumeReady(true);
		})();
		return () => {
			cancelled = true;
		};
	}, [resumeProjectId, form]);

	const onSubmit: SubmitHandler<CreateOfferFormValues> = async (_values) => {
		setIsNextLoading(true);
		try {
			const values = form.getValues();
			const payload: SaveProjectPayload = {
				project_id: projectId,
				step: 4,
				is_send: true,
				data: mapSuppliersForSave(values.invitedSuppliers),
			};

			const result = await saveProjectAPIAction(payload, {
				showSuccessToast: false,
			});

			if (result.success) {
				router.push("/business/offer");
			}
		} finally {
			setIsNextLoading(false);
		}
	};

	const handleNext = async () => {
		const rawNext = Number(currentStep);
		const activeStep =
			Number.isFinite(rawNext) && rawNext >= 1 && rawNext <= 5
				? Math.trunc(rawNext)
				: 1;

		const isValid =
			activeStep === 5
				? await form.trigger()
				: await form.trigger(
						CREATE_OFFER_STEP_VALIDATION_FIELDS[
							activeStep as keyof typeof CREATE_OFFER_STEP_VALIDATION_FIELDS
						] ?? [],
					);
		if (!isValid) {
			const fields =
				activeStep === 5
					? (Object.keys(form.getValues()) as (keyof CreateOfferFormValues)[])
					: CREATE_OFFER_STEP_VALIDATION_FIELDS[activeStep] ?? [];
			const firstInvalidField = fields.find(
				(field) => form.getFieldState(field).invalid,
			);
			if (firstInvalidField) form.setFocus(firstInvalidField);
			showToast("error", t(localizationConstants.validationCheckIncorrectFields));
			return;
		}

		if (isValid) {
			if (activeStep < totalSteps) {
				setIsNextLoading(true);
				const values = form.getValues();

				const getStepPayload = (step: number) => {
					switch (step) {
						case 1:
							return {
								first_name: values.firstName,
								last_name: values.lastName,
								mobile_number: values.mobileNumber,
								personal_email: values.personalEmail,
								address: values.address,
								city: values.city,
								postal_code: values.pincode,
							};
						case 2:
							return {
								project_name: values.projectName,
								is_express: values.isExpressJob === "express",
								client_no: values.clientNo,
								order_no: values.orderNo || undefined,
								object_no: values.objectNo || undefined,
								creation_mode: "quote_first",
								category_ids: Array.isArray(values.category)
									? values.category
									: values.category
									? [values.category]
									: [],
								project_address: values.projectAddress,
								project_contact_city: values.projectCity,
								project_contact_postal_code:
									values.projectPostalCode,
								directions: values.directions,
								project_type: values.isExpressJob as
									| "express"
									| "b2c",
							};
						case 3:
							return {
								project_description: values.description,
								media_ids: values.documents
									?.map((d) => d.id)
									.filter(Boolean),
							};
						case 4:
							return mapSuppliersForSave(
								values.invitedSuppliers,
							);
						default:
							return {};
					}
				};

				/** Next from invite step (4): is_send true; other steps stay draft */
				const payload: SaveProjectPayload = {
					project_id: projectId,
					step: activeStep,
					data: getStepPayload(activeStep),
					is_send: activeStep === 5,
				};

				try {
					const result = await saveProjectAPIAction(payload);

					if (result.success && result.data) {
						setProjectId(result.data.project_id);
						setCurrentStep(activeStep + 1);
					}
				} finally {
					setIsNextLoading(false);
				}
			} else {
				void form.handleSubmit(onSubmit, () => {
					showToast("error", t(localizationConstants.validationCheckIncorrectFields));
				})();
			}
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		} else {
			router.back();
		}
	};

	const handleEditStep = (step: number) => {
		setCurrentStep(step);
	};

	const handleSave = async () => {
		const raw = Number(currentStep);
		const saveStep =
			Number.isFinite(raw) && raw >= 1 && raw <= 5 ? Math.trunc(raw) : 1;

		const isValid =
			saveStep === 4
				? await form.trigger()
				: await form.trigger(
						CREATE_OFFER_STEP_VALIDATION_FIELDS[
							saveStep as keyof typeof CREATE_OFFER_STEP_VALIDATION_FIELDS
						] ?? [],
					);
		if (!isValid) return;

		const values = form.getValues();

		const getStepPayload = (step: number) => {
			switch (step) {
				case 1:
					return {
						first_name: values.firstName,
						last_name: values.lastName,
						mobile_number: values.mobileNumber,
						personal_email: values.personalEmail,
						address: values.address,
						city: values.city,
						postal_code: values.pincode,
					};
				case 2:
					return {
						project_name: values.projectName,
						is_express: values.isExpressJob === "express",
						client_no: values.clientNo,
						order_no: values.orderNo || undefined,
						object_no: values.objectNo || undefined,
						creation_mode: "quote_first",
						category_ids: Array.isArray(values.category)
							? values.category
							: values.category
							? [values.category]
							: [],
						project_address: values.projectAddress,
						project_contact_city: values.projectCity,
						project_contact_postal_code: values.projectPostalCode,
						directions: values.directions,
						project_type: values.isExpressJob as "express" | "b2c",
					};
				case 3:
					return {
						project_description: values.description,
						media_ids: values.documents
							?.map((d) => d.id)
							.filter(Boolean),
					};
				case 4:
					return mapSuppliersForSave(
						values.invitedSuppliers,
					);
				default:
					return {};
			}
		};

		const saveData = getStepPayload(saveStep);
		const payload: SaveProjectPayload = {
			project_id: projectId,
			step: saveStep === 5 ? 4 : saveStep,
			data: saveData,
		};

		setIsSaveLoading(true);
		const result = await saveProjectDraftAPIAction(payload);
		setIsSaveLoading(false);

		if (result.success && result.data) {
			setProjectId(result.data.project_id);
		}
	};
	const handleAddSupplier = async (
		newSupplier: NewInvitationFormValues,
	): Promise<boolean> => {
		const currentSuppliers = form.getValues("invitedSuppliers") || [];
		const supplierWithId: QuoteSupplier = {
			...newSupplier,
			id: Math.random().toString(36).substr(2, 9),
		};

		const updatedSuppliers = [...currentSuppliers, supplierWithId];

		// Save only the newly added supplier as per user request
		const payload: SaveProjectPayload = {
			project_id: projectId,
			step: 4,
			data: {
				suppliers: [
					{
						company_name: newSupplier.companyName,
						category: newSupplier.category || undefined,
						organization_number: newSupplier.orgNumber,
						first_name: newSupplier.contactFirstName,
						last_name: newSupplier.contactLastName,
						email: newSupplier.emailAddress,
						mobile_number: newSupplier.mobileNumber,
					},
				],
			},
		};

		setIsSaveLoading(true);
		try {
			const result = await saveProjectDraftAPIAction(payload);

			if (result.success && result.data) {
				const savedId = result.data.project_id;
				setProjectId(savedId);
				const freshProject = await getProjectByIdAPIAction(savedId);
				if (freshProject.success && freshProject.data) {
					const { values } = mapProjectDetailToFormHydration(freshProject.data);
					form.setValue("invitedSuppliers", values.invitedSuppliers ?? updatedSuppliers);
				} else {
					form.setValue("invitedSuppliers", updatedSuppliers);
				}
				return true;
			}
			return false;
		} finally {
			setIsSaveLoading(false);
		}
	};

	if (!resumeReady) {
		return (
			<div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center bg-slate-50">
				<Loader2 className="h-8 w-8 animate-spin text-slate-400" role="status" aria-label="Loading offer data" />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-slate-50 overflow-hidden">
			{/* Header */}
			<header className="px-6 pt-4 pb-0 flex items-center justify-between z-10">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ArrowLeft className="!h-6 !w-6" />
					</Button>
					<div>
						<h1 className="text-xl font-semibold text-slate-900 leading-tight">
							<Translate
								text={
									currentStep === 5
										? localizationConstants.offerOverview
										: localizationConstants.createNewOfferTitle
								}
							/>
						</h1>
						{currentStep < 5 && (
							<p className="text-sm text-slate-500">
								<Translate
									text={
										localizationConstants.createNewOfferSubtitle
									}
								/>
							</p>
						)}
					</div>
				</div>
			</header>

			{/* Content Area */}
			<main className="flex-1 px-4 md:px-6 lg:px-[60px] py-6 md:py-8 overflow-y-auto no-scrollbar">
				<div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
					{/* Main Form Section */}
					<div className="flex-1 w-full ">
						<CreateOfferForm
							form={form}
							step={currentStep}
							categoryOptions={customerCategoryOptions}
							categoriesLoading={customerCategoriesLoading}
							categoryHasMore={customerCategoryHasMore}
							categoryLoadingMore={customerCategoriesLoadingMore}
							onCategoryLoadMore={handleCategoryLoadMore}
							onCategorySearchChange={handleCategorySearchChange}
							onEditStep={handleEditStep}
						/>
					</div>

					{/* Progress Sidebar */}
					{currentStep < 5 && (
						<div className="w-full lg:w-80 shrink-0">
							<Card className="border shadow-sm p-0 bg-white">
								<CardContent className="p-5 space-y-2">
									<div className="flex items-center justify-between text-sm font-medium">
										<span className="text-slate-900">
											<Translate
												text={
													localizationConstants.step
												}
											/>{" "}
											{currentStep}/{totalSteps - 1}
										</span>
									</div>
									<Progress
										value={
											(currentStep / (totalSteps - 1)) *
											100
										}
										className="h-2 [&>div]:bg-slate-950"
									/>
								</CardContent>
							</Card>
							{currentStep === 4 && (
								<div className="mt-3 space-y-3">
									<Button
										type="button"
										className="h-11 w-full bg-slate-900 text-white hover:bg-slate-800 gap-2"
										onClick={() =>
											openModal(
												MODAL_CONSTANTS.NEW_INVITATION,
											)
										}
										disabled={invitedSuppliers.length >= 3}
									>
										<Plus className="h-4 w-4" />
										<Translate
											text={
												localizationConstants.newInvitationButton
											}
										/>
									</Button>

									<Card className="border shadow-sm p-0 bg-white">
										<CardContent className="p-4">
											<div className="flex items-start gap-3">
												<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
													<UsersRound className="h-5 w-5" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-semibold text-slate-900">
														<Translate
															text={
																localizationConstants.supplierSelectionSummaryLabel
															}
														/>
													</p>
													<div className="mt-4 flex items-center gap-5">
														<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[6px] border-slate-200 text-center">
															<div>
																<p className="text-lg font-semibold leading-none text-slate-900">
																	{
																		invitedSuppliers.length
																	}
																	/3
																</p>
																<p className="mt-1 text-[10px] font-medium text-slate-500">
																	<Translate
																		text={
																			localizationConstants.supplierSelectedCountLabel
																		}
																	/>
																</p>
															</div>
														</div>
														<div className="flex-1 space-y-3 text-xs">
															<div className="flex items-center justify-between gap-4">
																<span className="text-slate-500">
																	<Translate
																		text={
																			localizationConstants.selectedSuppliersLabel
																		}
																	/>
																</span>
																<span className="font-semibold text-slate-900">
																	{
																		invitedSuppliers.length
																	}
																</span>
															</div>
															<div className="flex items-center justify-between gap-4">
																<span className="text-slate-500">
																	<Translate
																		text={
																			localizationConstants.supplierInternalRecipientsLabel
																		}
																	/>
																</span>
																<span className="font-semibold text-slate-900">
																	{
																		internalSuppliers.length
																	}
																</span>
															</div>
															<div className="border-t border-slate-200 pt-3">
																<div className="flex items-center justify-between gap-4">
																	<span className="font-semibold text-slate-900">
																		<Translate
																			text={
																				localizationConstants.supplierTotalRecipientsLabel
																			}
																		/>
																	</span>
																	<span className="font-semibold text-slate-900">
																		{
																			supplierRecipientTotal
																		}
																	</span>
																</div>
															</div>
														</div>
													</div>
													<div className="mt-4 flex gap-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-slate-700">
														<Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
														<p>
															<Translate
																text={
																	localizationConstants.supplierRecipientCountInfo
																}
															/>
														</p>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							)}
						</div>
					)}
				</div>
			</main>

			{/* New Invitation slide-out form (step 4) */}
			<NewInvitationForm
				open={isOpen && type === MODAL_CONSTANTS.NEW_INVITATION}
				onOpenChange={(open) => {
					if (!open) closeModal();
				}}
				onSave={handleAddSupplier}
				categoryOptions={professionalSubcategoryOptions}
				categoriesLoading={professionalSubcategoriesLoading}
			/>

			{/* Sticky Footer */}
			<footer className="p-4 bg-white border-t z-10">
				<div className="flex items-center justify-end gap-3 px-2">
					<Button
						type="button"
						variant="outline"
						className="min-w-[160px] border-slate-200 text-slate-600 h-10 bg-transparent"
						onClick={() => router.back()}
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						variant="default"
						className="min-w-[160px] bg-slate-900 hover:bg-slate-800 text-white gap-2 h-10"
						onClick={handleSave}
						disabled={isSaveLoading || isNextLoading}
					>
						{isSaveLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
						<Translate text={localizationConstants.save} />
					</Button>
					<Button
						type="button"
						variant="default"
						className="min-w-[160px] bg-slate-900 hover:bg-slate-800 text-white gap-2 h-10"
						onClick={handleNext}
						disabled={isSaveLoading || isNextLoading}
					>
						<Translate
							text={
								currentStep === totalSteps
									? localizationConstants.sendLabel
									: localizationConstants.next
							}
						/>
						{isNextLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<ArrowRight className="h-4 w-4" />
						)}
					</Button>
				</div>
			</footer>
		</div>
	);
}
