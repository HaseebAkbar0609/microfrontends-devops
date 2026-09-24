"use client";

import { notFound } from "next/navigation";

import { Form } from "@/components/form";
import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "../../../data/projectNav.config";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { timeplanUrls } from "../timeplanNav";
import { TimeplanDetailsCard } from "./TimeplanDetailsCard";
import { TimeplanFormFooter } from "./TimeplanFormFooter";
import { TimeplanOtherInfoCard } from "./TimeplanOtherInfoCard";
import { useTimeplanForm } from "./useTimeplanForm";

export interface ProjectTimeplanFormPageProps {
	projectId: string;
	/** Set for Redigera; absent for Skapa ny tidsplan. */
	planId?: string;
}

/**
 * Skapa ny tidsplan, and Redigera tidsplan — one form for both.
 *
 * The record's section tabs stay visible, as on every other Tidsplan screen, so
 * the reader can leave for another section without first going back.
 */
export function ProjectTimeplanFormPage({ projectId, planId }: ProjectTimeplanFormPageProps) {
	const t = useTranslate();
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);
	const { form, isEdit, missing, save, cancel } = useTimeplanForm(projectId, planId);

	/* An unknown project, or an edit link to a plan that is gone, is a 404.
	   After the hooks: `notFound()` throws. */
	if (!project || missing) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: t(
						isEdit
							? localizationConstants.projectTimeplanEditTitle
							: localizationConstants.projectTimeplanCreateTitle,
					),
					backHref: timeplanUrls.list(projectId),
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<Form {...form}>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						save("list");
					}}
					noValidate
					className="flex flex-1 flex-col"
				>
					<div className="flex w-full max-w-3xl flex-1 flex-col gap-4 p-6">
						<TimeplanDetailsCard form={form} />
						<TimeplanOtherInfoCard
							form={form}
							projectNo={project.projectNr.replace(/^#/, "")}
							customer={project.customer}
						/>
					</div>

					<TimeplanFormFooter
						onCancel={cancel}
						onSave={() => save("list")}
						onOpenPlan={() => save("view")}
						disabled={form.formState.isSubmitting}
					/>
				</form>
			</Form>
		</div>
	);
}

export default ProjectTimeplanFormPage;
