"use client";

import React from "react";
import { ArrowLeft, ArrowRight, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCreateKalkylForm } from "../hooks/useCreateKalkylForm";
import { KalkylKontaktStep } from "./steps/KalkylKontaktStep";
import { KalkylProjektStep } from "./steps/KalkylProjektStep";
import { KalkylDokumentStep } from "./steps/KalkylDokumentStep";

const TABS = [
	{ key: 1, labelKey: localizationConstants.calcNewStep1Tab },
	{ key: 2, labelKey: localizationConstants.calcNewStep2Tab },
	{ key: 3, labelKey: localizationConstants.calcNewStep3Tab },
];

export function CreateKalkylPage() {
	const t = useTranslate();
	const {
		currentStep,
		totalSteps,
		isSubmitting,
		isLoadingOffers,
		showErrors,
		offerOptions,
		kontakt,
		projekt,
		documents,
		datumFran,
		datumTill,
		gdprAccepted,
		setDatumFran,
		setDatumTill,
		setGdprAccepted,
		handleKontaktChange,
		handleProjektChange,
		handleKopplaOffert,
		handleAddDocument,
		handleRemoveDocument,
		handleNext,
		handleBack,
		handleTabClick,
		handleSubmit,
		handleCancel,
	} = useCreateKalkylForm();

	const progressPercent = Math.round((currentStep / totalSteps) * 100);

	const handleSaveSectionToast = () => {
		showToast("success", t(localizationConstants.save));
	};

	return (
		<div className="flex min-h-screen flex-col bg-slate-50">
			<div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
				{/* Sub-header */}
				<div className="mb-2">
					<div className="flex items-center gap-2">
						<button
							type="button"
							aria-label={t(localizationConstants.backButton)}
							onClick={handleCancel}
							className="cursor-pointer rounded-md p-1 text-slate-700 hover:bg-slate-200"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>

						<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
							<Translate text={localizationConstants.calcNewTitle} />
						</h1>
					</div>

					<p className="ml-9 text-xs text-slate-500 sm:text-sm">
						<Translate text={localizationConstants.stepLabel} /> {currentStep}/{totalSteps}
					</p>
				</div>

				{/* Step Tabs Bar with full-width bottom divider line */}
				<div className="mb-6 ml-9 border-b border-slate-200">
					<nav
						className="inline-flex items-center gap-1 sm:gap-2 -mb-[1px]"
						aria-label={t(localizationConstants.calcNewTitle)}
					>
						{TABS.map((tab) => {
							const isActive = currentStep === tab.key;
							return (
								<button
									key={tab.key}
									type="button"
									onClick={() => handleTabClick(tab.key)}
									className={cn(
										"relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap transition-colors cursor-pointer",
										isActive
											? "text-slate-950 font-bold"
											: "text-slate-600 hover:text-slate-900 font-medium",
									)}
								>
									<Translate text={tab.labelKey} />
									{isActive && (
										<span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-950 z-10" />
									)}
								</button>
							);
						})}
					</nav>
				</div>

				{/* Progress card — small screens only */}
				<div className="mb-6 ml-9 rounded-lg border border-slate-200 bg-white p-4 shadow-none lg:hidden">
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
				</div>

				{/* Main Layout: Form + Desktop Sidebar */}
				<div className="ml-9 flex flex-col items-start gap-6 lg:flex-row">
					<div className="w-full flex-1">
						{currentStep === 1 && (
							<KalkylKontaktStep
								data={kontakt}
								offerOptions={offerOptions}
								isLoadingOffers={isLoadingOffers}
								showErrors={showErrors}
								onChange={handleKontaktChange}
								onKoppla={handleKopplaOffert}
								onSaveSection={handleSaveSectionToast}
								onCancelSection={handleCancel}
							/>
						)}

						{currentStep === 2 && (
							<KalkylProjektStep
								data={projekt}
								showErrors={showErrors}
								onChange={handleProjektChange}
								onNext={handleNext}
								onChangeAction={handleSaveSectionToast}
							/>
						)}

						{currentStep === 3 && (
							<KalkylDokumentStep
								documents={documents}
								datumFran={datumFran}
								datumTill={datumTill}
								gdprAccepted={gdprAccepted}
								onDatumFranChange={setDatumFran}
								onDatumTillChange={setDatumTill}
								onGdprChange={setGdprAccepted}
								onAddDocument={handleAddDocument}
								onRemoveDocument={handleRemoveDocument}
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

									{/* Black Progress Bar */}
									<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
										<div
											className="h-full bg-slate-900 transition-all duration-300"
											style={{ width: `${progressPercent}%` }}
										/>
									</div>

									{/* Actions inside sidebar card */}
									<div className="mt-5 flex flex-col gap-2.5">
										<Button
											type="button"
											variant="ghost"
											onClick={handleCancel}
											className="h-10 w-full cursor-pointer rounded-md border-0 bg-[var(--color-bg-secondary,#F4F4F5)] text-sm font-medium text-slate-800 hover:bg-slate-200"
										>
											<Translate text={localizationConstants.cancelButton} />
										</Button>

										{currentStep === 1 ? (
											<Button
												type="button"
												onClick={handleNext}
												className="h-10 w-full cursor-pointer gap-2 rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
											>
												<Translate text={localizationConstants.nextButton} />
												<ArrowRight className="h-4 w-4" />
											</Button>
										) : currentStep === 2 ? (
											<Button
												type="button"
												onClick={handleNext}
												disabled={isSubmitting}
												className="h-10 w-full cursor-pointer gap-2 rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
											>
												<FileText className="h-4 w-4" />
												<Translate text={localizationConstants.calcNewCreateBtn} />
											</Button>
										) : (
											<Button
												type="button"
												onClick={handleSubmit}
												disabled={isSubmitting}
												className="h-10 w-full cursor-pointer gap-2 rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
											>
												{isSubmitting ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<FileText className="h-4 w-4" />
												)}
												<Translate text={localizationConstants.calcNewCreateBtn} />
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>

			{/* Sticky Bottom Navigation Bar */}
			<div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-6 py-4 sm:px-8">
				<div className="flex items-center justify-end gap-3">
					<Button
						type="button"
						variant="ghost"
						onClick={handleCancel}
						className="h-10 min-w-24 cursor-pointer rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					{currentStep > 1 && (
						<Button
							type="button"
							variant="ghost"
							onClick={handleBack}
							className="h-10 min-w-24 cursor-pointer gap-1.5 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
						>
							<ArrowLeft className="h-4 w-4" />
							<Translate text={localizationConstants.backButton} />
						</Button>
					)}

					{currentStep < totalSteps ? (
						<Button
							type="button"
							onClick={handleNext}
							className="h-10 min-w-24 cursor-pointer gap-1.5 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-4 w-4" />
						</Button>
					) : (
						<Button
							type="button"
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="h-10 min-w-28 cursor-pointer gap-1.5 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800"
						>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<FileText className="h-4 w-4" />
							)}
							<Translate text={localizationConstants.calcNewCreateBtn} />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
