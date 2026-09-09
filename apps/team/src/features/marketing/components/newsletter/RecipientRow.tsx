"use client";

import localizationConstants from "@/utils/translation/constants";
import { MARKETING_OPTIONS } from "../../constants/marketingFieldOptions";
import type { NewsletterRecipient } from "../../types";
import { MarketingBadge } from "../MarketingBadge";

const AUDIENCE_LABEL = {
	tradespeople: localizationConstants.marketingAudienceTradespeople,
	privateIndividuals: localizationConstants.marketingAudiencePrivate,
} as const;

export function RecipientRow({
	recipient,
}: {
	recipient: NewsletterRecipient;
}) {
	const status =
		MARKETING_OPTIONS[recipient.status as keyof typeof MARKETING_OPTIONS] ??
		null;

	return (
		<li className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-b-0">
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-slate-900">
					{recipient.name}
				</p>
				<p className="truncate text-sm text-slate-500">{recipient.email}</p>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<MarketingBadge
					option={{
						id: recipient.audience,
						labelKey: AUDIENCE_LABEL[recipient.audience],
					}}
				/>
				<MarketingBadge option={status} fallback={recipient.status} />
			</div>
		</li>
	);
}

export default RecipientRow;
