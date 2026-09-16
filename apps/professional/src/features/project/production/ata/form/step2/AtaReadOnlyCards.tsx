"use client";

import { Info, Users } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants from "@/utils/translation/constants";
import type { AtaFormValues } from "../ataFormSchema";
import { AtaCollapsibleCard } from "./AtaCollapsibleCard";

const GRID = "grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3";

export interface AtaReadOnlyCardsProps {
	control: Control<AtaFormValues>;
	meta: { createdBy: string; createdDate: string; revisedDate: string };
}

/**
 * Step 2's read-back of step 1: Beställare and Projektinformation as the frame
 * lists them, from the live draft. Rubrik and Underrubrik lead the second card —
 * the frame omits them, but they are what names the ÄTA.
 */
export function AtaReadOnlyCards({ control, meta }: AtaReadOnlyCardsProps) {
	const [client, info] = useWatch({ control, name: ["client", "info"] });

	return (
		<>
			<AtaCollapsibleCard titleKey={localizationConstants.projectAtaClient} icon={Users}>
				<dl className={GRID}>
					<InfoField labelKey={localizationConstants.projectAtaClient} value={client.client} />
					<InfoField labelKey={localizationConstants.createAtaOrdererName} value={client.name} />
					<InfoField labelKey={localizationConstants.createAtaAddress} value={client.address} />
					<InfoField labelKey={localizationConstants.projectAtaPostalCode} value={client.postalCode} />
					<InfoField labelKey={localizationConstants.createAtaCity} value={client.city} />
				</dl>
			</AtaCollapsibleCard>

			<AtaCollapsibleCard titleKey={localizationConstants.projectAtaProjectInfo} icon={Info}>
				<dl className={GRID}>
					<InfoField labelKey={localizationConstants.projectAtaHeading} value={info.heading} />
					<InfoField labelKey={localizationConstants.projectAtaSubheading} value={info.subheading} />
					<InfoField labelKey={localizationConstants.createAtaQualityStatus} value={info.qualityStatus} />
					<InfoField labelKey={localizationConstants.projectAtaEconomyStatus} value={info.economyStatus} />
					<InfoField labelKey={localizationConstants.createAtaColPosition} value={info.location} />
					<InfoField labelKey={localizationConstants.createAtaReason} value={info.reason} />
					<InfoField labelKey={localizationConstants.projectAtaCreatedBy} value={meta.createdBy} />
					<InfoField labelKey={localizationConstants.ataColDate} value={meta.createdDate} />
					<InfoField labelKey={localizationConstants.projectAtaRevisedDate} value={meta.revisedDate} />
					<InfoField labelKey={localizationConstants.createAtaDescription} value={info.description} />
					<InfoField labelKey={localizationConstants.projectAtaProposedAction} value={info.proposedAction} />
					<InfoField labelKey={localizationConstants.createAtaAction} value={info.action} />
				</dl>
			</AtaCollapsibleCard>
		</>
	);
}

export default AtaReadOnlyCards;
