"use client";

import { Button } from "@/components/ui/button";
import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PROJECT_MODULE_BASE_URL,
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "../../data/projectNav.config";
import { ProjectRecordTitle } from "./ProjectRecordTitle";
import { useProjectIdentity } from "../hooks/useProjectIdentity";
import { projectProductionTabs } from "../projectProductionNav.config";

interface Props {
	projectId: string;
	sectionKey: TranslationKeys;
}

export function UnavailableProjectSectionPage({ projectId, sectionKey }: Props) {
	const project = useProjectIdentity(projectId);

	if (project.isLoading) {
		return <p role="status" className="p-6 text-sm text-slate-600"><Translate text={localizationConstants.genericLoading} /></p>;
	}
	if (project.isError || !project.data) {
		return <div role="alert" className="flex items-center gap-3 p-6 text-sm text-red-700">
			<Translate text={localizationConstants.genericError} />
			<Button type="button" variant="outline" onClick={() => void project.refetch()}><Translate text={localizationConstants.retry} /></Button>
		</div>;
	}

	return <div className="flex flex-1 flex-col bg-blue-gray-50">
		<ModulePageHeader
			title={PROJECT_MODULE_TITLE}
			tabs={PROJECT_MODULE_TABS}
			record={{
				title: <ProjectRecordTitle projectNo={project.data.projectNr} sectionKey={sectionKey} />,
				backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
			}}
			secondaryTabs={projectProductionTabs(projectId)}
		/>
		<div className="flex-1 px-6 py-8">
			<div className="border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-600">
				<Translate text={localizationConstants.projectSectionDataUnavailable} />
			</div>
		</div>
	</div>;
}
