"use client";

import { Folder } from "lucide-react";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { ProjectRecordInfo } from "../../types";
import { PlanCard } from "./PlanCard";
import { PlanCardHeaderAction } from "./PlanCardHeaderAction";

export interface PlanProjectInfoCardProps {
	info: ProjectRecordInfo | null;
	/**
	 * The other party to the plan. Defaults to the project's own Beställare; a
	 * subcontractor's plan names the supplier instead.
	 */
	counterparty?: { labelKey: TranslationKeys; name: string };
	/** Where the project's fields are edited. Omit for a read-only card. */
	editHref?: string;
}

/**
 * Projektinformation, read from the project record rather than copied onto the
 * plan, so the two can never disagree. On the Beställare plan its pencil goes
 * to the record's own Projektinformation section, where these fields are
 * edited; a supplier's plan draws no pencil.
 *
 * On wide screens the dates start a third row, as the frame lays them out.
 */
export function PlanProjectInfoCard({ info, counterparty, editHref }: PlanProjectInfoCardProps) {
	const details = info?.details;
	const party = counterparty ?? {
		labelKey: localizationConstants.lblBestallare,
		name: info?.customer.customer ?? "",
	};

	return (
		<PlanCard
			titleKey={localizationConstants.sectionProjectInfo}
			icon={<Folder className="h-5 w-5 text-slate-700" aria-hidden />}
			action={
				editHref ? (
					<PlanCardHeaderAction
						labelKey={localizationConstants.projectPaymentPlanEditProjectInfo}
						href={editHref}
					/>
				) : undefined
			}
		>
			<dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3 xl:[&>div:nth-child(6)]:col-start-1">
				<InfoField labelKey={localizationConstants.lblProjektNr} value={details?.projectNo.replace(/^#/, "")} />
				<InfoField labelKey={localizationConstants.lblProjekt} value={details?.projectName} />
				<InfoField labelKey={localizationConstants.lblKvartersNamn} value={details?.blockName} />
				<InfoField labelKey={party.labelKey} value={party.name} />
				<InfoField labelKey={localizationConstants.lblKontraktsumma} value={details?.contractSum} />
				<InfoField labelKey={localizationConstants.lblStartDatum} value={details?.startDate} />
				<InfoField labelKey={localizationConstants.lblSlutDatum} value={details?.endDate} />
			</dl>
		</PlanCard>
	);
}

export default PlanProjectInfoCard;
