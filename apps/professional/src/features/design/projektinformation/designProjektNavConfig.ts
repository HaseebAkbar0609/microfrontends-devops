import type { ModuleTabItem } from "@/types/navigation";
import localizationConstants from "@/utils/translation/constants";
import { DESIGN_MODULE_BASE_URL } from "../data/designNav.config";

export const designProjektRecordUrl = (id: string) =>
	`${DESIGN_MODULE_BASE_URL}/${encodeURIComponent(id)}`;

export function designProjektTabs(projektId: string): ModuleTabItem[] {
	const base = designProjektRecordUrl(projektId);

	return [
		{
			id: "projektinformation",
			labelKey: localizationConstants.agreementProjectInfo,
			href: `${base}/projektinformation`,
		},
		{
			id: "tidsplan",
			labelKey: localizationConstants.projectSectionTidsplan,
			href: `${base}/tidsplan`,
		},
		{
			id: "ekonomi",
			labelKey: localizationConstants.designEkonomiTab,
			href: `${base}/ekonomi`,
		},
		{
			id: "handlingar",
			labelKey: localizationConstants.designSidebarHandlingar,
			href: `${base}/handlingar`,
		},
		{
			id: "fraga-svar",
			labelKey: localizationConstants.projectQaTitle,
			href: `${base}/fraga-svar`,
		},
	];
}
