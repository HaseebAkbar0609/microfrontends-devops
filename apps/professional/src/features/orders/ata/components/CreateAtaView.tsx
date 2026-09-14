"use client";

import React from "react";
import {
	ArrowLeft,
	ArrowRight,
	Save,
	Send,
	Map,
	MapPin,
	Users,
	Info,
	CircleUser,
	Container,
	Wrench,
	Workflow,
	WalletCards,
	ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { ATA_CONSTANTS } from "../constants/ata.constants";
import { useCreateAta } from "../hooks/useCreateAta";
import { formatAtaCurrency, formatAtaCount } from "../utils/ata.utils";
import { AtaLineItemsTable } from "./create/AtaLineItemsTable";
import { AtaDocumentsSection } from "./create/AtaDocumentsSection";

function InfoItem({ label, value }: { label: string; value?: string | number }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
				{label}
			</span>
			<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
				{value !== undefined && value !== null && String(value).trim() !== "" ? String(value) : "—"}
			</span>
		</div>
	);
}

export interface CreateAtaViewProps {
	orderId?: string;
	onBack: () => void;
	onSaved?: () => void;
}

export function CreateAtaView({
	orderId = ATA_CONSTANTS.DEFAULT_ORDER_ID,
	onBack,
	onSaved,
}: CreateAtaViewProps) {
	const t = useTranslate();

	const {
		currentStep,
		formData,
		errors,
		isSubmitting,
		summary,
		staffItems,
		materialItems,
		machineItems,
		ueItems,
		supplierAtaItems,
		attachedDocs,
		expandedSections,
		toggleSection,
		updateField,
		handleNextStep,
		handlePrevStep,
		handleSaveDraft,
		handleSendApproval,
		handleAddDocument,
		handleDeleteDocument,
	} = useCreateAta({
		orderId,
		onSuccess: (actionType) => {
			if (actionType === "send") {
				showToast("success", t(localizationConstants.createAtaSentSuccess));
			} else {
				showToast("success", t(localizationConstants.createAtaSavedDraftSuccess));
			}
			onSaved?.();
			onBack();
		},
		onCancel: onBack,
	});

	const onSave = async () => {
		await handleSaveDraft();
	};

	const onSend = async () => {
		await handleSendApproval();
	};

	const isStep1 = currentStep === ATA_CONSTANTS.STEPS.STEP_1;
	const progressPercentage = (currentStep / ATA_CONSTANTS.STEPS.TOTAL_STEPS) * 100;

	return (
		<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px -mb-4 px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between">
			<div className="space-y-4 w-full pb-8">
				{/* Top Header matching Figma: Back arrow + Title "Skapa ÄTA" */}
				<div className="flex items-center gap-1.5 sm:gap-2 w-full pb-3">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onBack}
						className="size-7 rounded-md text-slate-900 hover:bg-slate-200/60 cursor-pointer p-0 shrink-0"
						aria-label={t(localizationConstants.goBackButton)}
					>
						<ArrowLeft className="size-5" />
					</Button>
					<h1 className="font-sans font-semibold text-xl sm:text-2xl leading-8 text-slate-900">
						<Translate text={localizationConstants.createAtaTitle} />
					</h1>
				</div>

				{/* Main 2-column Layout */}
				<div className="w-full flex flex-col lg:flex-row gap-6 items-start pl-0 sm:pl-7">
				{/* Left Column: Forms and Tables */}
				<div className="flex-1 min-w-0 w-full flex flex-col gap-6 order-2 lg:order-1">
					{isStep1 ? (
						/* STEP 1: Editable Forms */
						<div className="w-full flex flex-col gap-6">
							{/* Card 1: Beställare (Orderer) */}
							<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full flex flex-col">
								<div className="flex h-14 min-h-14 w-full items-center border-b border-slate-200 bg-white px-5 sm:px-6">
									<div className="flex items-center gap-2.5 min-w-0">
										<Users className="size-6 text-slate-700 shrink-0" />
										<span className="font-sans text-base font-medium text-slate-900">
											<Translate text={localizationConstants.createAtaOrderer} />
										</span>
									</div>
								</div>
								<div className="p-5 sm:p-6 flex flex-col gap-4">
									{/* Orderer input */}
									<div className="flex flex-col gap-1.5 w-full sm:w-1/2 pr-0 sm:pr-2">
										<Label htmlFor="orderer" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
											<Translate text={localizationConstants.createAtaOrderer} />
											<span className="text-rose-500 ml-0.5">*</span>
										</Label>
										<Input
											id="orderer"
											value={formData.orderer}
											onChange={(e) => updateField("orderer", e.target.value)}
											placeholder={t(localizationConstants.createAtaOrderer)}
											className={`h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900 ${
												errors.orderer ? "border-rose-500 ring-1 ring-rose-500" : ""
											}`}
										/>
										{errors.orderer && (
											<span className="text-xs text-rose-500 font-normal">
												{errors.orderer}
											</span>
										)}
									</div>

									{/* Name and Address grid */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="ordererName" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaOrdererName} />
											</Label>
											<Input
												id="ordererName"
												value={formData.ordererName}
												onChange={(e) => updateField("ordererName", e.target.value)}
												placeholder={t(localizationConstants.createAtaOrdererName)}
												className="h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="address" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaAddress} />
											</Label>
											<Input
												id="address"
												value={formData.address}
												onChange={(e) => updateField("address", e.target.value)}
												placeholder={t(localizationConstants.createAtaAddress)}
												className="h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
									</div>

									{/* Postal Code and City grid */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="postalCode" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaPostalCode} />
											</Label>
											<Input
												id="postalCode"
												value={formData.postalCode}
												onChange={(e) => updateField("postalCode", e.target.value)}
												placeholder={t(localizationConstants.createAtaPostalCode)}
												className="h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="city" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaCity} />
											</Label>
											<Input
												id="city"
												value={formData.city}
												onChange={(e) => updateField("city", e.target.value)}
												placeholder={t(localizationConstants.createAtaCity)}
												className="h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Card 2: Order Information */}
							<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full flex flex-col">
								<div className="flex h-14 min-h-14 w-full items-center border-b border-slate-200 bg-white px-5 sm:px-6">
									<div className="flex items-center gap-2.5 min-w-0">
										<Info className="size-6 text-slate-700 shrink-0" />
										<span className="font-sans text-base font-medium text-slate-900">
											<Translate text={localizationConstants.createAtaOrderInformation} />
										</span>
									</div>
								</div>
								<div className="p-5 sm:p-6 flex flex-col gap-4">
									{/* Eating Number */}
									<div className="flex flex-col gap-1.5 w-full sm:w-1/2 pr-0 sm:pr-2">
										<Label htmlFor="eatingNumber" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
											<Translate text={localizationConstants.createAtaEatingNumber} />
											<span className="text-rose-500 ml-0.5">*</span>
										</Label>
										<Input
											id="eatingNumber"
											value={formData.eatingNumber}
											onChange={(e) => updateField("eatingNumber", e.target.value)}
											placeholder={t(localizationConstants.createAtaEatingNumber)}
											className={`h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900 ${
												errors.eatingNumber ? "border-rose-500 ring-1 ring-rose-500" : ""
											}`}
										/>
										{errors.eatingNumber && (
											<span className="text-xs text-rose-500 font-normal">
												{errors.eatingNumber}
											</span>
										)}
									</div>

									{/* Title and Subtitle grid */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="title" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaFieldTitle} />
												<span className="text-rose-500 ml-0.5">*</span>
											</Label>
											<Input
												id="title"
												value={formData.title}
												onChange={(e) => updateField("title", e.target.value)}
												placeholder={t(localizationConstants.createAtaFieldTitle)}
												className={`h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900 ${
													errors.title ? "border-rose-500 ring-1 ring-rose-500" : ""
												}`}
											/>
											{errors.title && (
												<span className="text-xs text-rose-500 font-normal">
													{errors.title}
												</span>
											)}
										</div>
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="subTitle" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaFieldTitle} />
											</Label>
											<Input
												id="subTitle"
												value={formData.subTitle}
												onChange={(e) => updateField("subTitle", e.target.value)}
												placeholder={t(localizationConstants.createAtaFieldTitle)}
												className="h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
									</div>

									{/* Proposed Action and Action textareas */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="proposedAction" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaProposedAction} />
											</Label>
											<Textarea
												id="proposedAction"
												value={formData.proposedAction}
												onChange={(e) => updateField("proposedAction", e.target.value)}
												placeholder={t(localizationConstants.createAtaDescriptionPlaceholder)}
												className="min-h-[88px] resize-y bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="action" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaAction} />
											</Label>
											<Textarea
												id="action"
												value={formData.action}
												onChange={(e) => updateField("action", e.target.value)}
												placeholder={t(localizationConstants.createAtaDescriptionPlaceholder)}
												className="min-h-[88px] resize-y bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
									</div>

									{/* Quality Status and Reason grid */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="qualityStatus" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaQualityStatus} />
											</Label>
											<Input
												id="qualityStatus"
												value={formData.qualityStatus}
												onChange={(e) => updateField("qualityStatus", e.target.value)}
												placeholder="-"
												className="h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="reason" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaReason} />
											</Label>
											<Input
												id="reason"
												value={formData.reason}
												onChange={(e) => updateField("reason", e.target.value)}
												placeholder="-"
												className="h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
									</div>

									{/* Economic Status and Location grid */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="economicStatus" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaEconomicStatus} />
											</Label>
											<Input
												id="economicStatus"
												value={formData.economicStatus}
												onChange={(e) => updateField("economicStatus", e.target.value)}
												placeholder="-"
												className="h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<Label htmlFor="location" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.createAtaLocation} />
											</Label>
											<Input
												id="location"
												value={formData.location}
												onChange={(e) => updateField("location", e.target.value)}
												placeholder="-"
												className="h-10 bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
											/>
										</div>
									</div>

									{/* Description textarea */}
									<div className="flex flex-col gap-1.5 w-full">
										<Label htmlFor="description" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
											<Translate text={localizationConstants.createAtaDescription} />
										</Label>
										<Textarea
											id="description"
											value={formData.description}
											onChange={(e) => updateField("description", e.target.value)}
											placeholder={t(localizationConstants.createAtaDescriptionPlaceholder)}
											className="min-h-[88px] resize-y bg-white border-slate-200 text-slate-900 text-sm focus-visible:ring-1 focus-visible:ring-slate-900"
										/>
									</div>
								</div>
							</div>
						</div>
					) : (
						/* STEP 2: Collapsible Summaries & Detailed Information */
						<div className="w-full flex flex-col gap-6">
							{/* Collapsible Beställare Card */}
							<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
								<Button
									type="button"
									variant="ghost"
									onClick={() => toggleSection("orderer")}
									className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-5 sm:px-6 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
									aria-expanded={expandedSections.orderer}
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<Users className="size-6 text-slate-700 shrink-0" />
										<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
											<Translate text={localizationConstants.createAtaOrderer} />
										</span>
									</div>
									<ChevronUp
										size={18}
										className={cn(
											"text-zinc-500 transition-transform duration-200 shrink-0",
											!expandedSections.orderer && "rotate-180"
										)}
										aria-hidden={true}
									/>
								</Button>
								{expandedSections.orderer && (
									<CardContent className="border-t border-slate-200 px-5 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
										<InfoItem label={t(localizationConstants.createAtaOrderer)} value={formData.orderer} />
										<InfoItem label={t(localizationConstants.createAtaOrdererName)} value={formData.ordererName} />
										<InfoItem label={t(localizationConstants.createAtaAddress)} value={formData.address} />
										<InfoItem label={t(localizationConstants.createAtaPostalCode)} value={formData.postalCode} />
										<InfoItem label={t(localizationConstants.createAtaCity)} value={formData.city} />
									</CardContent>
								)}
							</Card>

							{/* Collapsible Order Information Card */}
							<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
								<Button
									type="button"
									variant="ghost"
									onClick={() => toggleSection("orderInfo")}
									className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-5 sm:px-6 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
									aria-expanded={expandedSections.orderInfo}
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<Info className="size-6 text-slate-700 shrink-0" />
										<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
											<Translate text={localizationConstants.createAtaOrderInformation} />
										</span>
									</div>
									<ChevronUp
										size={18}
										className={cn(
											"text-zinc-500 transition-transform duration-200 shrink-0",
											!expandedSections.orderInfo && "rotate-180"
										)}
										aria-hidden={true}
									/>
								</Button>
								{expandedSections.orderInfo && (
									<CardContent className="border-t border-slate-200 px-5 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
										<InfoItem label={t(localizationConstants.createAtaQualityStatus)} value={formData.qualityStatus} />
										<InfoItem label={t(localizationConstants.createAtaFinancialStatus)} value={formData.economicStatus} />
										<InfoItem label={t(localizationConstants.createAtaLocation)} value={formData.location} />
										<InfoItem label={t(localizationConstants.createAtaCustomField)} value={formData.subTitle} />
										<InfoItem label={t(localizationConstants.createAtaCreatedBy)} value={formData.responsible} />
										<InfoItem label={t(localizationConstants.createAtaColDate)} value={formData.date} />
										<InfoItem label={t(localizationConstants.createAtaRevisedDate)} value={formData.responsible} />
										<InfoItem label={t(localizationConstants.createAtaDescription)} value={formData.description} />
										<InfoItem label={t(localizationConstants.createAtaProposedAction)} value={formData.proposedAction} />
										<InfoItem label={t(localizationConstants.createAtaAction)} value={formData.action} />
									</CardContent>
								)}
							</Card>

							{/* Section: Detaljerad information */}
							<div className="pt-2 flex flex-col gap-4">
								<h2 className="font-sans font-semibold text-lg text-slate-900">
									<Translate text={localizationConstants.createAtaDetailedInfo} />
								</h2>

								{/* 1. Egen personal */}
								<AtaLineItemsTable
									title={t(localizationConstants.createAtaOwnStaff)}
									icon={<CircleUser className="size-6 text-slate-700 shrink-0" />}
									secondColHeaderKey="createAtaColPerson"
									sixthColHeaderKey="createAtaColQuantity"
									items={staffItems}
									totalLabel={t(localizationConstants.createAtaOwnStaff)}
									totalValue={formatAtaCount(staffItems.length)}
									isExpanded={expandedSections.staff}
									onToggleExpand={() => toggleSection("staff")}
								/>

								{/* 2. Material */}
								<AtaLineItemsTable
									title={t(localizationConstants.createAtaTotalMaterial)}
									icon={<Container className="size-6 text-slate-700 shrink-0" />}
									secondColHeaderKey="createAtaColSupplier"
									sixthColHeaderKey="createAtaColInvoice"
									items={materialItems}
									totalLabel={t(localizationConstants.createAtaTotalMaterial)}
									totalValue={summary.totalMaterial}
									secondaryTotalLabel={t(localizationConstants.createAtaPurchaseSumIncVat)}
									secondaryTotalValue={summary.totalMaterial * (1 + ATA_CONSTANTS.VAT_RATE)}
									isExpanded={expandedSections.material}
									onToggleExpand={() => toggleSection("material")}
								/>

								{/* 3. Maskiner */}
								<AtaLineItemsTable
									title={t(localizationConstants.createAtaTotalMachines)}
									icon={<Wrench className="size-6 text-slate-700 shrink-0" />}
									secondColHeaderKey="createAtaColSupplier"
									sixthColHeaderKey="createAtaColInvoice"
									items={machineItems}
									totalLabel={t(localizationConstants.createAtaTotalMachines)}
									totalValue={summary.totalMachines}
									secondaryTotalLabel={t(localizationConstants.createAtaPurchaseSumIncVat)}
									secondaryTotalValue={summary.totalMachines * (1 + ATA_CONSTANTS.VAT_RATE)}
									isExpanded={expandedSections.machine}
									onToggleExpand={() => toggleSection("machine")}
								/>

								{/* 4. UE */}
								<AtaLineItemsTable
									title={t(localizationConstants.createAtaTotalUe)}
									icon={<Workflow className="size-6 text-slate-700 shrink-0" />}
									secondColHeaderKey="createAtaColSupplier"
									sixthColHeaderKey="createAtaColInvoice"
									items={ueItems}
									totalLabel={t(localizationConstants.createAtaTotalUe)}
									totalValue={summary.totalUe}
									secondaryTotalLabel={t(localizationConstants.createAtaPurchaseSumIncVat)}
									secondaryTotalValue={summary.totalUe * (1 + ATA_CONSTANTS.VAT_RATE)}
									isExpanded={expandedSections.ue}
									onToggleExpand={() => toggleSection("ue")}
								/>

								{/* 5. ÄTA leverantör */}
								<AtaLineItemsTable
									title={t(localizationConstants.createAtaTotalAtaSupplier)}
									icon={<WalletCards className="size-6 text-slate-700 shrink-0" />}
									secondColHeaderKey="createAtaColSupplier"
									sixthColHeaderKey="createAtaColInvoice"
									items={supplierAtaItems}
									totalLabel={t(localizationConstants.createAtaTotalAtaSupplier)}
									totalValue={summary.totalAtaSupplier}
									secondaryTotalLabel={t(localizationConstants.createAtaPurchaseSumIncVat)}
									secondaryTotalValue={summary.totalAtaSupplier * (1 + ATA_CONSTANTS.VAT_RATE)}
									isExpanded={expandedSections.supplierAta}
									onToggleExpand={() => toggleSection("supplierAta")}
								/>

								{/* 6. Dokument */}
								<AtaDocumentsSection
									attachedDocs={attachedDocs}
									supplierInvoices={formData.supplierInvoices || []}
									timeReports={formData.timeReports || []}
									onSupplierInvoicesChange={(invs) => updateField("supplierInvoices", invs)}
									onTimeReportsChange={(reps) => updateField("timeReports", reps)}
									onUploadFiles={handleAddDocument}
									onDeleteDoc={handleDeleteDocument}
									isExpanded={expandedSections.documents}
									onToggleExpand={() => toggleSection("documents")}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Right Sidebar (order-1 on mobile so it appears on top of cards, order-2 on lg) */}
				<div className="w-full lg:w-[333px] shrink-0 flex flex-col order-1 lg:order-2">
					{/* Unified Summary Card (width: 333px, height: 396px, border-radius: 8px, border-width: 1px) */}
					<div className="w-full lg:w-[333px] h-[396px] overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
						{/* Top Step Progress Bar Section */}
						<div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-2">
							<span className="font-sans text-sm font-semibold text-slate-900">
								{t(localizationConstants.createAtaStepProgress)} {currentStep}/{ATA_CONSTANTS.STEPS.TOTAL_STEPS}
							</span>
							<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-slate-900 transition-all duration-300 rounded-full"
									style={{ width: `${progressPercentage}%` }}
								/>
							</div>
						</div>

						{/* Middle Summary Details Section */}
						<div className="px-4 py-2 flex flex-col gap-2.5 flex-1 justify-center">
							<div className="flex items-center justify-between">
								<h3 className="font-sans font-semibold text-lg leading-7 tracking-normal text-slate-900">
									{t(localizationConstants.createAtaNumberPrefix)} {summary.ataNr}
								</h3>
								<Badge
									variant="outline"
									className="bg-white text-slate-800 border-slate-200 font-sans text-xs px-2 py-0.5 rounded-md shadow-2xs font-semibold"
								>
									{summary.projectCode}
								</Badge>
							</div>

							{/* Location Badges */}
							<div className="flex items-center gap-2 flex-wrap">
								<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800">
									<Map className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
									<span>{summary.locations[0] || t(localizationConstants.createAtaLocationFallbackStockholm)}</span>
								</span>
								<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800">
									<MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
									<span>{summary.locations[1] || t(localizationConstants.createAtaLocationFallbackJarfalla)}</span>
								</span>
							</div>

							{/* Breakdown totals */}
							<div className="flex flex-col gap-2.5 pt-1">
								<div className="flex items-center justify-between">
									<span className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500">
										<Translate text={localizationConstants.createAtaOwnStaff} />
									</span>
									<span className="font-sans font-medium text-base leading-6 tracking-normal text-slate-900">
										{formatAtaCount(summary.ownStaffCount)}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500">
										<Translate text={localizationConstants.createAtaTotalMaterial} />
									</span>
									<span className="font-sans font-medium text-base leading-6 tracking-normal text-slate-900">
										{formatAtaCurrency(summary.totalMaterial)}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500">
										<Translate text={localizationConstants.createAtaTotalMachines} />
									</span>
									<span className="font-sans font-medium text-base leading-6 tracking-normal text-slate-900">
										{formatAtaCurrency(summary.totalMachines)}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500">
										<Translate text={localizationConstants.createAtaTotalUe} />
									</span>
									<span className="font-sans font-medium text-base leading-6 tracking-normal text-slate-900">
										{formatAtaCurrency(summary.totalUe)}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500">
										<Translate text={localizationConstants.createAtaTotalAtaSupplier} />
									</span>
									<span className="font-sans font-medium text-base leading-6 tracking-normal text-slate-900">
										{formatAtaCurrency(summary.totalAtaSupplier)}
									</span>
								</div>
							</div>
						</div>

						{/* Bottom Skicka Button Section */}
						<div className="p-4 border-t border-slate-100">
							<Button
								type="button"
								onClick={onSend}
								disabled={isSubmitting}
								className="w-full h-10 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm gap-2 shadow-sm cursor-pointer"
							>
								<Send className="h-4 w-4" />
								<Translate text={localizationConstants.createAtaBtnSend} />
							</Button>
						</div>
					</div>
				</div>
			</div>
			</div>

			{/* Sticky Bottom Action Bar (bottom-0 matching Protocol pages) */}
			<div className="mt-auto sticky -bottom-4 -mx-3 sm:-mx-6 -mb-4 px-4 sm:px-6 py-3 bg-white border-t border-slate-200 z-30 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2.5 sm:gap-3 shadow-md">
				{!isStep1 && (
					<Button
						type="button"
						variant="ghost"
						onClick={handlePrevStep}
						disabled={isSubmitting}
						className="flex-1 sm:flex-none sm:min-w-[120px] h-10 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-slate-900 text-sm font-medium border-0 cursor-pointer shadow-none gap-2 flex items-center justify-center shrink-0"
					>
						<ArrowLeft className="h-4 w-4" />
						<Translate text={localizationConstants.createAtaBtnBack} />
					</Button>
				)}

				<Button
					type="button"
					variant={isStep1 ? "ghost" : "outline"}
					onClick={onBack}
					disabled={isSubmitting}
					className={cn(
						"flex-1 sm:flex-none sm:min-w-[120px] h-10 px-6 rounded-lg text-slate-900 text-sm font-medium cursor-pointer shadow-none flex items-center justify-center shrink-0",
						isStep1
							? "bg-zinc-100 hover:bg-zinc-200 border-0"
							: "border border-slate-200 bg-white hover:bg-slate-50"
					)}
				>
					<Translate text={localizationConstants.createAtaBtnCancel} />
				</Button>

				{isStep1 && (
					<Button
						type="button"
						variant="outline"
						onClick={onSave}
						disabled={isSubmitting}
						className="flex-1 sm:flex-none sm:min-w-[120px] h-10 px-5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-sm font-medium gap-2 cursor-pointer shadow-none flex items-center justify-center shrink-0"
					>
						<Save className="h-4 w-4 text-slate-900" />
						<Translate text={localizationConstants.createAtaBtnSave} />
					</Button>
				)}

				{isStep1 ? (
					<Button
						type="button"
						onClick={handleNextStep}
						disabled={isSubmitting}
						className="flex-1 sm:flex-none sm:min-w-[140px] h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium gap-2 shadow-none cursor-pointer flex items-center justify-center shrink-0"
					>
						<Translate text={localizationConstants.createAtaBtnPreview} />
						<ArrowRight className="h-4 w-4" />
					</Button>
				) : (
					<Button
						type="button"
						onClick={onSend}
						disabled={isSubmitting}
						className="flex-1 sm:flex-none sm:min-w-[140px] h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium gap-2 shadow-none cursor-pointer flex items-center justify-center shrink-0"
					>
						<Send className="h-4 w-4" />
						<Translate text={localizationConstants.createAtaBtnSend} />
					</Button>
				)}
			</div>
		</div>
	);
}

export default CreateAtaView;
