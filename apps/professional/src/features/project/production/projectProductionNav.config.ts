import type { ModuleTabItem } from "@/types/navigation";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_MODULE_BASE_URL } from "../data/projectNav.config";

/** Where a project record's own sections live. */
export const projectRecordUrl = (projectId: string) =>
	`${PROJECT_MODULE_BASE_URL}/${encodeURIComponent(projectId)}`;

/**
 * The record's sections, as a route-based tab row.
 *
 * The frames draw these as a twelve-item left sidebar under a "Projekt-
 * produktion" heading. TFS-910 removed the Production sub-sidebars on purpose
 * and every screen since has navigated through `ModulePageHeader`, so these are
 * `secondaryTabs` on the record variant instead — the slot that exists for
 * exactly this and had no caller until now. Flagged on the ticket.
 *
 * Only the sections that exist are listed. The other nine in the frame — ÄTA,
 * Personal-liggare, Betalningsplan, Fråga/Svar, Dagbok, Handlingar, Protokoll,
 * Besiktning, Garantiåtaganden — have no project-scoped implementation, and
 * three of them have none anywhere in the app. Each joins this list as its own
 * ticket lands, rather than shipping as a dead tab.
 */
export function projectProductionTabs(projectId: string): ModuleTabItem[] {
	const base = projectRecordUrl(projectId);

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
			id: "organisation",
			labelKey: localizationConstants.orderOrganisationTab,
			href: `${base}/organisation`,
		},
	];
}
