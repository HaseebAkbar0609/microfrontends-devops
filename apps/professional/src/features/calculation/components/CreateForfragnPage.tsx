"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Loader2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCreateForfragnForm } from "../hooks/useCreateForfragnForm";
import { ForfragnProjektStep } from "./steps/ForfragnProjektStep";
import { ForfragnKontaktStep } from "./steps/ForfragnKontaktStep";
import { ForfragnDokumentStep } from "./steps/ForfragnDokumentStep";
import { ForfragnLeverantorStep } from "./steps/ForfragnLeverantorStep";
import { ForfragnSuccessModal } from "./ForfragnSuccessModal";

const TABS = [
	{ key: 1, labelKey: localizationConstants.calcInquiryWizStep1 },
	{ key: 2, labelKey: localizationConstants.calcInquiryWizStep2 },
	{ key: 3, labelKey: localizationConstants.calcInquiryWizStep3 },
	{ key: 4, labelKey: localizationConstants.calcInquiryWizStep4 },
];

interface CreateForfragnPageProps {
	calcId?: string;
}

export function CreateForfragnPage({ calcId }: CreateForfragnPageProps) {
	const t = useTranslate();
	const {
		currentStep,
		totalSteps,
		isSubmitting,
		showErrors,
		isSuccessOpen,
		projekt,
		kontakt,
		leverantor,
		documents,
		gdprAccepted,
		setGdprAccepted,
		handleProjektChange,
		handleKontaktChange,
		handleLeverantorChange,
		handleAddDocument,
		handleRemoveDocument,
		handleNext,
		handleBack,
		handleTabClick,
		handleSaveDraft,
		handleSubmit,
		handleCancel,
		handleViewEnquiry,
		handleReturnDashboard,
	} = useCreateForfragnForm(calcId);

	const progressPercent = Math.round((currentStep / totalSteps) * 100);

	return (
		<div className="flex flex-1 flex-col bg-slate-50">
			<div className="flex-1 px-4 py-6 sm:px-6">
				{/* Sub-header */}
				<div className="mb-2">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={t(localizationConstants.backButton)}
							onClick={handleCancel}
							className="h-8 w-8 shrink-0 cursor-pointer p-0 text-slate-900 hover:bg-slate-200 hover:text-slate-900"
						>
							<ArrowLeft className="size-5 text-slate-900" />
						</Button>

						<h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
							<Translate text={localizationConstants.calcNewTitle} />
						</h1>
					</div>

					<p className="ml-10 text-xs text-slate-500 sm:text-sm">
						<Translate text={localizationConstants.stepLabel} /> {currentStep}/{totalSteps}
					</p>
				</div>

				{/* Reusable Step Tabs Bar */}
				<div className="mb-6 ml-0 sm:ml-10">
					<Tabs
						value={String(currentStep)}
						onValueChange={(val) => handleTabClick(Number(val))}
						className="w-full"
					>
						<TabsList variant="line" className="w-full overflow-y-hidden">
							{TABS.map((tab) => (
								<TabsTrigger
									key={tab.key}
									value={String(tab.key)}
								>
									<Translate text={tab.labelKey} />
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				{/* Progress card — small screens only */}
				<div className="mb-6 ml-0 rounded-lg border border-slate-200 bg-white p-4 shadow-none sm:ml-10 lg:hidden">
					<div className="mb-2 flex items-center justify-between">
						<p className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.stepLabel} /> {currentStep}/{totalSteps}
						</p>
						<span className="text-xs font-semibold text-slate-600">{progressPercent}%</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full bg-slate-900 transition-all duration-300"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>

					{/* Send button for Step 4 on small screens */}
					{currentStep === 4 && (
						<div className="mt-4">
							<Button
								type="button"
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="h-10 w-full cursor-pointer gap-2 rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
							>
								{isSubmitting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Send className="h-4 w-4" />
								)}
								<Translate text={localizationConstants.calcInquiryWizSkickaErbjudande} />
							</Button>
						</div>
					)}
				</div>

				{/* Main Layout */}
				<div className="ml-0 flex flex-col items-start gap-6 sm:ml-10 lg:flex-row">
					<div className="w-full flex-1">
						{currentStep === 1 && (
							<ForfragnProjektStep
								data={projekt}
								showErrors={showErrors}
								onChange={handleProjektChange}
							/>
						)}

						{currentStep === 2 && (
							<ForfragnKontaktStep
								data={kontakt}
								showErrors={showErrors}
								onChange={handleKontaktChange}
							/>
						)}

						{currentStep === 3 && (
							<ForfragnDokumentStep
								documents={documents}
								gdprAccepted={gdprAccepted}
								onGdprChange={setGdprAccepted}
								onAddDocument={handleAddDocument}
								onRemoveDocument={handleRemoveDocument}
							/>
						)}

						{currentStep === 4 && (
							<ForfragnLeverantorStep
								data={leverantor}
								onChange={handleLeverantorChange}
							/>
						)}
					</div>

					{/* Right Sidebar (Desktop) */}
					<div className="hidden w-64 shrink-0 lg:block xl:w-72">
						<div className="sticky top-6 w-full">
							<Card className="gap-0 rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
								<CardContent className="p-5">
									<p className="mb-2 text-sm font-semibold text-slate-900">
										<Translate text={localizationConstants.stepLabel} /> {currentStep}/{totalSteps}
									</p>

									{/* Progress Bar */}
									<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
										<div
											className="h-full bg-slate-900 transition-all duration-300"
											style={{ width: `${progressPercent}%` }}
										/>
									</div>

									{/* Sidebar Actions for Step 4 */}
									{currentStep === 4 && (
										<div className="mt-5">
											<Button
												type="button"
												onClick={handleSubmit}
												disabled={isSubmitting}
												className="h-10 w-full cursor-pointer gap-2 rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
											>
												{isSubmitting ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<Send className="h-4 w-4" />
												)}
												<Translate text={localizationConstants.calcInquiryWizSkickaErbjudande} />
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>

			{/* Sticky Bottom Navigation Bar */}
			<div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
				<div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:justify-end sm:gap-3">
					{/* Avbryt */}
					<Button
						type="button"
						variant="ghost"
						onClick={handleCancel}
						className="h-10 w-full cursor-pointer rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:h-10 sm:w-auto sm:min-w-24 sm:px-4 sm:text-sm"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					{/* Spara */}
					<Button
						type="button"
						variant="ghost"
						onClick={handleSaveDraft}
						className="h-10 w-full cursor-pointer gap-1.5 rounded-md bg-slate-900 px-3 text-xs font-medium text-white hover:bg-slate-800 sm:h-10 sm:w-auto sm:min-w-24 sm:px-4 sm:text-sm"
					>
						<Save className="h-4 w-4" />
						<Translate text={localizationConstants.calcNewSaveBtn} />
					</Button>

					{/* Tillbaka till */}
					{currentStep > 1 && (
						<Button
							type="button"
							variant="ghost"
							onClick={handleBack}
							className={`h-10 w-full cursor-pointer gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:h-10 sm:w-auto sm:min-w-24 sm:px-4 sm:text-sm ${
								currentStep === totalSteps ? "col-span-2 sm:col-span-1" : "col-span-1"
							}`}
						>
							<ArrowLeft className="h-4 w-4" />
							<Translate text={localizationConstants.calcNewBackTo} />
						</Button>
					)}

					{/* Nästa */}
					{currentStep < totalSteps && (
						<Button
							type="button"
							onClick={handleNext}
							className={`h-10 w-full cursor-pointer gap-1.5 rounded-md bg-slate-900 px-4 text-xs font-medium text-white hover:bg-slate-800 sm:h-10 sm:w-auto sm:min-w-24 sm:px-5 sm:text-sm ${
								currentStep === 1 ? "col-span-2 sm:col-span-1" : "col-span-1"
							}`}
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>

			{/* Success Confirmation Modal */}
			<ForfragnSuccessModal
				isOpen={isSuccessOpen}
				projectName={projekt.projektNamn}
				customerName={kontakt.kontaktperson || `${kontakt.fornamn} ${kontakt.efternamn}`.trim()}
				documentsCount={documents.length}
				suppliersCount={leverantor.suppliers.length}
				onViewEnquiry={handleViewEnquiry}
				onReturnDashboard={handleReturnDashboard}
			/>
		</div>
	);
}
