"use client";

import { Folder } from "lucide-react";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants from "@/utils/translation/constants";
import type { ProjectRecordInfo } from "../../types";
import { paymentPlanUrls } from "../paymentPlanNav";
import { PlanCard } from "./PlanCard";
import { PlanCardHeaderAction } from "./PlanCardHeaderAction";

export interface PlanProjectInfoCardProps {
	projectId: string;
	info: ProjectRecordInfo | null;
}

/**
 * Projektinformation, read from the project record rather than copied onto the
 * plan, so the two can never disagree. Its pencil goes to the record's own
 * Projektinformation section, where these fields are edited.
 *
 * On wide screens the dates start a third row, as the frame lays them out.
 */
export function PlanProjectInfoCard({ projectId, info }: PlanProjectInfoCardProps) {
	const details = info?.details;

	return (
		<PlanCard
			titleKey={localizationConstants.sectionProjectInfo}
			icon={<Folder className="h-5 w-5 text-slate-700" aria-hidden />}
			action={
				<PlanCardHeaderAction
					labelKey={localizationConstants.projectPaymentPlanEditProjectInfo}
					href={paymentPlanUrls.projectInfo(projectId)}
				/>
			}
		>
			<dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3 xl:[&>div:nth-child(6)]:col-start-1">
				<InfoField labelKey={localizationConstants.lblProjektNr} value={details?.projectNo.replace(/^#/, "")} />
				<InfoField labelKey={localizationConstants.lblProjekt} value={details?.projectName} />
				<InfoField labelKey={localizationConstants.lblKvartersNamn} value={details?.blockName} />
				<InfoField labelKey={localizationConstants.lblBestallare} value={info?.customer.customer} />
				<InfoField labelKey={localizationConstants.lblKontraktsumma} value={details?.contractSum} />
				<InfoField labelKey={localizationConstants.lblStartDatum} value={details?.startDate} />
				<InfoField labelKey={localizationConstants.lblSlutDatum} value={details?.endDate} />
			</dl>
		</PlanCard>
	);
}

export default PlanProjectInfoCard;
