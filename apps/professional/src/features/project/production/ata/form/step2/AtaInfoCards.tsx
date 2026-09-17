"use client";

import { Info, Users } from "lucide-react";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { AtaClient, AtaProjectInfo } from "../../types";
import { AtaCollapsibleCard } from "./AtaCollapsibleCard";

const GRID = "grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3";

export interface AtaInfoCardsProps {
	client: AtaClient;
	info: AtaProjectInfo;
	meta: { createdBy: string; createdDate: string; revisedDate: string };
	/** "Projektinformation" on the project's own ÄTA, "ÄTA-information" on a supplier's. */
	infoTitleKey: TranslationKeys;
	/** A supplier's ÄTA leads its information card with who sent it. */
	supplierName?: string;
}

/**
 * The read-only Beställare and information cards, as the frames list them.
 * Rubrik and Underrubrik lead the second card — the frames omit them, but they
 * are what names an ÄTA.
 */
export function AtaInfoCards({ client, info, meta, infoTitleKey, supplierName }: AtaInfoCardsProps) {
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

			<AtaCollapsibleCard titleKey={infoTitleKey} icon={Info}>
				<dl className={GRID}>
					{supplierName !== undefined && (
						<InfoField labelKey={localizationConstants.createAtaColSupplier} value={supplierName} />
					)}
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

export default AtaInfoCards;
