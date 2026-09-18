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
 * Only the sections that exist are listed. The one left in the frame —
 * Protokoll — has no project-scoped implementation yet. It joins this list as
 * its own ticket lands, rather than shipping as a dead tab, as Besiktning did
 * with TFS-704, ÄTA with TFS-705, Handlingar with TFS-707, Dagbok with TFS-708
 * and Garantiåtaganden with TFS-710.
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
			id: "betalningsplan",
			labelKey: localizationConstants.paymentPlanTitle,
			href: `${base}/betalningsplan`,
		},
		{
			id: "ata",
			labelKey: localizationConstants.ataTitle,
			href: `${base}/ata`,
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
		{
			id: "personalliggare",
			labelKey: localizationConstants.projectStaffLedgerTitle,
			href: `${base}/personalliggare`,
		},
		{
			id: "fraga-svar",
			labelKey: localizationConstants.projectQaTitle,
			href: `${base}/fraga-svar`,
		},
		{
			id: "dagbok",
			labelKey: localizationConstants.projectDiaryTitle,
			href: `${base}/dagbok`,
		},
		{
			id: "handlingar",
			labelKey: localizationConstants.projectDocumentsTitle,
			href: `${base}/handlingar`,
		},
		{
			id: "besiktning",
			labelKey: localizationConstants.projectInspectionTitle,
			href: `${base}/besiktning`,
		},
		{
			id: "garantiataganden",
			labelKey: localizationConstants.projectWarrantyCommitments,
			href: `${base}/garantiataganden`,
		},
	];
}
