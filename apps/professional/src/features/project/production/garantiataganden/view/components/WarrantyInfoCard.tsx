"use client";

import { Info } from "lucide-react";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants from "@/utils/translation/constants";
import { ProjectSectionCard } from "../../../components/ProjectSectionCard";
import type { WarrantyCommitment } from "../../types";
import type { WarrantyProjectFacts } from "../hooks/useWarrantyDetail";

/**
 * The frame's second card. Projekt, Projektnamn, Kund, Kontaktperson kund,
 * Mobiltelefon, E-post and Start are the project's own; Garantiansvarig,
 * Godkänd and Garantitid are the commitment's, which nothing else in the app
 * supplies — a commitment created from the list has them empty and shows the
 * missing-value mark. Read-only, as agreed on the ticket.
 */
export function WarrantyInfoCard({ commitment, project }: { commitment: WarrantyCommitment; project: WarrantyProjectFacts }) {
	/* "5 år / 2030-09-01", or whichever half the commitment carries. */
	const period = [commitment.periodLabel, commitment.endDate].filter(Boolean).join(" / ");

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectWarrantySectionInfo}
			icon={<Info className="h-5 w-5 text-slate-700" aria-hidden />}
		>
			<dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
				<InfoField labelKey={localizationConstants.projectWarrantyFieldProject} value={project.projectNo} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldProjectName} value={project.projectName} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldCustomer} value={project.customer} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldCustomerContact} value={project.customerContact} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldResponsible} value={commitment.responsible} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldStart} value={project.startDate} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldApproved} value={commitment.approvedDate} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldPeriod} value={period} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldMobile} value={project.mobile} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldEmail} value={project.email} />
			</dl>
		</ProjectSectionCard>
	);
}

export default WarrantyInfoCard;
