"use client";

import { Suspense } from "react";
import { notFound, useSearchParams } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { StepRail } from "@/components/common";
import { ModulePageHeader } from "@/components/layout/navigation";
import { Form } from "@/components/ui/form";
import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_MODULE_BASE_URL, PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../data/projectNav.config";
import { ProjectRecordTitle } from "../../components/ProjectRecordTitle";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { isIsoDate } from "../diaryDates";
import { useDiaryProject, type DiaryProjectFacts } from "../hooks/useDiaryProject";
import { DIARY_DATE_PARAM, DIARY_WIZARD_STEPS } from "../projectDiary.config";
import { ConfirmationDialog } from "./components/ConfirmationDialog";
import { WizardFooter } from "./components/WizardFooter";
import { WizardOverviewCard } from "./components/WizardOverviewCard";
import { WizardRowsSection } from "./components/WizardRowsSection";
import { WizardWeatherCard } from "./components/WizardWeatherCard";
import { useDiaryPeople } from "./hooks/useDiaryPeople";
import { useNewDiaryWizard } from "./useNewDiaryWizard";

function Wizard({ projectId, facts }: { projectId: string; facts: DiaryProjectFacts }) {
	const searchParams = useSearchParams();
	const requested = searchParams.get(DIARY_DATE_PARAM);
	const people = useDiaryPeople(projectId, facts);
	const currentUser = useCurrentUserName(localizationConstants.projectDiaryYou);

	const wizard = useNewDiaryWizard(projectId, facts, isIsoDate(requested) ? requested : "", currentUser);

	return (
		<div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-8 sm:px-6 xl:flex-row xl:items-start">
			<Form {...wizard.form}>
				<div className="flex min-w-0 flex-1 flex-col gap-4">
					{wizard.step === 1 ? (
						<>
							<WizardOverviewCard form={wizard.form} facts={facts} people={people} />
							<WizardWeatherCard form={wizard.form} />
						</>
					) : (
						<WizardRowsSection form={wizard.form} onPut={wizard.putRow} onRemove={wizard.removeRow} />
					)}
					<WizardFooter step={wizard.step} onCancel={wizard.cancel} onBack={wizard.back} onNext={() => void wizard.next()} />
				</div>
			</Form>

			<StepRail current={wizard.step} steps={DIARY_WIZARD_STEPS} showList className="order-first xl:order-none xl:w-80" />

			{wizard.confirming && (
				<ConfirmationDialog signers={facts.signers} onSave={wizard.create} onClose={wizard.closeConfirm} />
			)}
			<ConfirmActionDialog
				open={wizard.leaving}
				onOpenChange={(open) => !open && wizard.closeLeaving()}
				title={localizationConstants.projectDiaryLeaveTitle}
				description={localizationConstants.projectDiaryLeaveBody}
				confirmLabel={localizationConstants.projectDiaryLeaveConfirm}
				destructive
				onConfirm={wizard.leave}
			/>
		</div>
	);
}

export interface NewDiaryWizardPageProps {
	projectId: string;
}

/**
 * "Ny dagbok" — the day's diary in two steps: what it covers and the weather,
 * then the day's rows, and a Bekräftelse that signs it.
 *
 * Spara creates the diary as a draft and opens that day, where it is published.
 * The ticket's description — a weather service, media uploads, a third step —
 * is not drawn and not built.
 */
export function NewDiaryWizardPage({ projectId }: NewDiaryWizardPageProps) {
	const facts = useDiaryProject(projectId);

	/* An id that matches no project is a 404. After the hooks: `notFound()` throws. */
	if (!facts) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: <ProjectRecordTitle projectNo={facts.projectNr} sectionKey={localizationConstants.projectDiaryNewDiary} />,
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>
			{/* The starting day comes from the query string, so it needs Suspense. */}
			<Suspense fallback={null}>
				<Wizard projectId={projectId} facts={facts} />
			</Suspense>
		</div>
	);
}

export default NewDiaryWizardPage;
