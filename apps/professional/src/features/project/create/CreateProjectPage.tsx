"use client";

import { ArrowLeft, ArrowRight, Save } from "lucide-react";

import { Form } from "@/components/form";
import { StepRail } from "@/components/common";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PROJECT_CREATE_CONSTANTS, type ProjectCreateStep } from "./constants";
import { useCreateProjectForm } from "./useCreateProjectForm";
import { Step1Customer } from "./steps/Step1Customer";
import { Step2ProjectInfo } from "./steps/Step2ProjectInfo";
import { Step3Documents } from "./steps/Step3Documents";
import { Step4Organisation } from "./steps/Step4Organisation";
import { Step5Summary } from "./steps/Step5Summary";

const STEP_LABELS: TranslationKeys[] = [
	localizationConstants.orderCreateStep1Tab,
	localizationConstants.projectCreateDetailsTab,
	localizationConstants.orderCreateStep3Tab,
	localizationConstants.orderOrganisationTab,
	localizationConstants.orderCreateStep5Tab,
];

/**
 * Registrera nytt projekt — the five-step wizard.
 *
 * Layout and wiring only; the state lives in `useCreateProjectForm`. The step
 * is deliberately NOT in the query string: `SectionTabs` would put it there,
 * and a step you can type into the URL is a step you can reach without passing
 * the validation in front of it.
 */
export function CreateProjectPage() {
	const t = useTranslate();
	const {
		form,
		currentStep,
		goToStep,
		goNext,
		documents,
		pendingFiles,
		hasPendingUploads,
		selectFiles,
		removePendingFile,
		uploadPendingFiles,
		renameDocument,
		removeDocument,
		setContacts,
		saveDraft,
		submit,
		cancel,
		isSubmitting,
	} = useCreateProjectForm();

	const isLastStep = currentStep === PROJECT_CREATE_CONSTANTS.TOTAL_STEPS;


	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<div className="flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-7">
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={cancel}
						aria-label={t(localizationConstants.goBackButton)}
						className="h-6 w-6 shrink-0 cursor-pointer rounded-lg p-0 text-slate-900 shadow-none hover:bg-slate-200/60"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h1 className="text-xl font-semibold tracking-[-0.6px] text-slate-900 sm:text-2xl">
							<Translate
								text={localizationConstants.projectCreateTitle}
							/>
						</h1>
						<p className="text-sm text-slate-500">
							<Translate text={localizationConstants.stepLabel} />{" "}
							{currentStep}/{PROJECT_CREATE_CONSTANTS.TOTAL_STEPS}
						</p>
					</div>
				</div>

				{/* Controlled step tabs. Forward jumps run the validation for
				    every step in between; going back is free. */}
				<div
					role="tablist"
					aria-label={t(localizationConstants.projectCreateTitle)}
					className="flex gap-6 overflow-x-auto border-b border-slate-200"
				>
					{STEP_LABELS.map((label, index) => {
						const step = (index + 1) as ProjectCreateStep;
						const isActive = step === currentStep;

						return (
							<button
								key={label}
								type="button"
								role="tab"
								aria-selected={isActive}
								onClick={() => void goToStep(step)}
								className={cn(
									"-mb-px cursor-pointer border-b-2 pb-3 text-sm whitespace-nowrap transition-colors",
									isActive
										? "border-slate-900 font-semibold text-slate-900"
										: "border-transparent text-slate-500 hover:text-slate-900",
								)}
							>
								<Translate text={label} />
							</button>
						);
					})}
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-8 sm:px-6 xl:flex-row">
				{/* The shared `Form*` fields read their error state through
				    `useFormContext`, so the provider has to wrap the steps. */}
				<Form {...form}>
				<div className="min-w-0 flex-1">
					{currentStep === 1 && <Step1Customer form={form} />}
					{currentStep === 2 && <Step2ProjectInfo form={form} />}
					{currentStep === 3 && (
						<Step3Documents
							documents={documents}
							pendingFiles={pendingFiles}
							onSelectFiles={selectFiles}
							onRemovePending={removePendingFile}
							onUpload={() => void uploadPendingFiles()}
							isUploading={isSubmitting}
							hasPendingUploads={hasPendingUploads}
							onRename={renameDocument}
							onRemove={removeDocument}
						/>
					)}
					{currentStep === 4 && (
						<Step4Organisation
							form={form}
							onContactsChange={setContacts}
						/>
					)}
					{currentStep === 5 && (
						<Step5Summary
							form={form}
							documents={documents}
							onEditSection={(step) => void goToStep(step)}
						/>
					)}

					<div className="mt-4 flex flex-col-reverse items-stretch justify-end gap-2 sm:flex-row sm:items-center sm:gap-3">
						{isLastStep ? (
							<Button
								type="button"
								onClick={() => void submit()}
								disabled={isSubmitting}
								className="h-11 w-full cursor-pointer gap-2 rounded-lg bg-slate-900 px-6 text-sm font-medium text-white shadow-none hover:bg-slate-800 sm:w-auto"
							>
								<Translate
									text={localizationConstants.projectCreateSubmit}
								/>
							</Button>
						) : (
							<Button
								type="button"
								onClick={() => void goNext()}
								disabled={isSubmitting}
								className="h-11 w-full cursor-pointer gap-2 rounded-lg bg-slate-900 px-6 text-sm font-medium text-white shadow-none hover:bg-slate-800 sm:w-auto"
							>
								<Translate text={localizationConstants.nextButton} />
								<ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
							</Button>
						)}
					</div>
				</div>
				</Form>

				<StepRail
					current={currentStep}
					steps={STEP_LABELS}
					className="order-first xl:order-none"
				>
					<Button
						type="button"
						variant="outline"
						onClick={cancel}
						className="h-11 w-full cursor-pointer rounded-lg border-slate-200 bg-slate-100 text-sm font-medium text-slate-900 shadow-none hover:bg-slate-200"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>
					<Button
						type="button"
						onClick={() => void saveDraft()}
						disabled={isSubmitting}
						className="h-11 w-full cursor-pointer gap-2 rounded-lg bg-[#111721] text-sm font-medium text-white shadow-none hover:bg-slate-800"
					>
						<Save className="h-4 w-4 shrink-0" aria-hidden />
						<Translate text={localizationConstants.saveDraftButton} />
					</Button>
				</StepRail>
			</div>
		</div>
	);
}

export default CreateProjectPage;
