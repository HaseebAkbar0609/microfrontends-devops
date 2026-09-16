"use client";

import { notFound } from "next/navigation";

import { ModulePageHeader } from "@/components/layout/navigation";
import { Form } from "@/components/ui/form";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../data/projectNav.config";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { ataUrls } from "../ataNav";
import { ATA_FILE_RULES, ATA_LINE_LIMITS, ATA_STEP_KEYS } from "../projectAta.config";
import { AtaFormDialogs } from "./AtaFormDialogs";
import { AtaFormFooter } from "./AtaFormFooter";
import { AtaSummaryRail } from "./AtaSummaryRail";
import { useAtaDocuments } from "./documents/useAtaDocuments";
import { AtaClientCard } from "./step1/AtaClientCard";
import { AtaProjectInfoCard } from "./step1/AtaProjectInfoCard";
import { AtaDetailSections } from "./step2/AtaDetailSections";
import { AtaReadOnlyCards } from "./step2/AtaReadOnlyCards";
import { useAtaForm, type AtaStep } from "./useAtaForm";
import { useAtaFormActions } from "./useAtaFormActions";

export interface ProjectAtaFormPageProps {
	projectId: string;
	/** A saved ÄTA; omit for Skapa ÄTA. */
	ataId?: string;
	/** Visa detaljer opens on step 2, Redigera and Skapa on step 1. */
	initialStep: AtaStep;
}

/**
 * Skapa ÄTA, and a saved ÄTA opened from the list — one page, two steps, as the
 * frames draw them. Step 1 is Beställare and Projektinformation; step 2 reads
 * them back above the rows and documents. The rail keeps the totals and Skicka
 * in view on both.
 */
export function ProjectAtaFormPage({ projectId, ataId, initialStep }: ProjectAtaFormPageProps) {
	const t = useTranslate();
	const ata = useAtaForm({ projectId, ataId, initialStep });
	const documents = useAtaDocuments(ata.form);
	const actions = useAtaFormActions(projectId, ata, documents);

	/* An unknown project, or an ÄTA that is not this project's, is a 404. After the hooks. */
	if (!ata.project || ata.missing) notFound();

	const titleKey: TranslationKeys = !ata.existing
		? localizationConstants.createAtaTitle
		: initialStep === 2
			? localizationConstants.viewAtaTitle
			: localizationConstants.projectAtaEditTitle;
	const translateError = (message: string) =>
		t(message as TranslationKeys, { max: message === localizationConstants.projectAtaTooManyRows ? ATA_LINE_LIMITS.rows : ATA_FILE_RULES.maxCount });
	const label = t(localizationConstants.projectAtaLabel, { number: ata.number });

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{ title: <Translate text={titleKey} />, backHref: ataUrls.list(projectId) }}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<Form {...ata.form}>
				<form noValidate onSubmit={(event) => event.preventDefault()} className="flex flex-1 flex-col">
					<div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-8 sm:px-6 xl:flex-row xl:items-start">
						<div className="flex min-w-0 flex-1 flex-col gap-4">
							<h2 ref={ata.stepHeadingRef} tabIndex={-1} className="sr-only">
								{label} — <Translate text={ATA_STEP_KEYS[ata.step - 1]} />
							</h2>
							{ata.lockReason && (
								<p role="status" className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
									<Translate text={ata.lockReason} />
								</p>
							)}

							{ata.step === 1 ? (
								<fieldset disabled={ata.locked} className="flex min-w-0 flex-col gap-4">
									<AtaClientCard control={ata.form.control} translateError={translateError} />
									<AtaProjectInfoCard control={ata.form.control} number={ata.number} translateError={translateError} />
								</fieldset>
							) : (
								<>
									<AtaReadOnlyCards control={ata.form.control} meta={ata.meta} />
									<AtaDetailSections
										form={ata.form}
										documents={documents}
										stored={ata.existing?.documents ?? []}
										invoiceOptions={ata.invoiceOptions}
										timeReportOptions={ata.timeReportOptions}
										lockReason={ata.lockReason}
										translateError={translateError}
										onEditSection={actions.openLineItems}
									/>
								</>
							)}
						</div>

						<AtaSummaryRail
							control={ata.form.control}
							step={ata.step}
							number={ata.number}
							projectNo={ata.project.projectNr.replace(/^#/, "")}
							projectCity={ata.recordInfo?.details.city ?? ""}
							sendReason={actions.sendReason}
							onSend={() => void actions.requestSend()}
						/>
					</div>

					<AtaFormFooter
						step={ata.step}
						saveReason={ata.lockReason}
						onCancel={actions.cancel}
						onSave={actions.save}
						onPreview={() => void ata.goToPreview()}
						onBack={() => ata.showStep(1)}
					/>
				</form>
			</Form>

			<AtaFormDialogs form={ata.form} actions={actions} subject={label} />
		</div>
	);
}

export default ProjectAtaFormPage;
