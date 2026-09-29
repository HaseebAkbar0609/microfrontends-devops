"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { OfferPartyStatus } from "../constants/offers";

const PARTY_STATUS_CONFIG: Record<OfferPartyStatus, { labelKey: TranslationKeys; className: string } | null> = {
	approved: { labelKey: localizationConstants.offerApprovedLabel, className: "bg-[#DCFCE7] text-[#16A34A]" },
	pending: { labelKey: localizationConstants.offerPendingLabel, className: "bg-[#FEF3C7] text-[#D97706]" },
	cancelled: { labelKey: localizationConstants.offerCancelLabel, className: "bg-[#FEE2E2] text-[#DC2626]" },
	"n/a": null,
};

export function PartyStatusCell({ status }: { status: OfferPartyStatus }) {
	const config = PARTY_STATUS_CONFIG[status];
	if (!config) {
		return <Translate text={localizationConstants.notApplicableLabel} />;
	}
	return (
		<span className={`inline-flex items-center rounded-[6px] px-2.5 py-1 text-xs font-semibold ${config.className}`}>
			<Translate text={config.labelKey} />
		</span>
	);
}
