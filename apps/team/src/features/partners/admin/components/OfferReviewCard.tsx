"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { PartyStatusCell } from "@/features/partners/dashboard/components/PartyStatusCell";
import {
	OFFER_CHANNEL_LABELS,
	OFFER_CHANNELS,
	type OfferActionStatus,
	type PartnerOfferRow,
} from "@/features/partners/dashboard/constants/offers";
import type { OfferChannel, OfferDecision } from "../constants/partnerOffers";

const OFFER_STATUS_LABELS: Record<OfferActionStatus, TranslationKeys> = {
	active: localizationConstants.activeLabel,
	closed: localizationConstants.adminStatusClosed,
};

type OfferReviewCardProps = {
	offer: PartnerOfferRow;
	onDecision: (channel: OfferChannel, decision: OfferDecision) => void;
};

/** One offer with its details and an approve / decline choice per sales channel. */
export function OfferReviewCard({ offer, onDecision }: OfferReviewCardProps) {
	const t = useTranslate();
	const details = [
		{ labelKey: localizationConstants.startDateLabel, value: offer.startDate },
		{ labelKey: localizationConstants.endDateLabel, value: offer.endDate },
		{ labelKey: localizationConstants.discountLabel, value: offer.discount || t(localizationConstants.notApplicableLabel) },
		{ labelKey: localizationConstants.statusLabel, value: t(OFFER_STATUS_LABELS[offer.status]) },
	];

	return (
		<div className="rounded-md border border-slate-200 p-4">
			<p className="text-sm font-semibold text-slate-900">{offer.offerName}</p>
			<dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
				{details.map((detail) => (
					<div key={detail.labelKey}>
						<dt className="text-xs text-slate-500">
							<Translate text={detail.labelKey} />
						</dt>
						<dd className="text-sm text-slate-900">{detail.value}</dd>
					</div>
				))}
			</dl>

			<div className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
				{OFFER_CHANNELS.map((channel) => {
					const channelStatus = offer[channel];

					return (
						<div key={channel} className="flex min-h-11 items-center gap-3 pt-2">
							<span className="w-10 text-sm font-medium text-slate-900">
								<Translate text={OFFER_CHANNEL_LABELS[channel]} />
							</span>
							<span className="text-sm text-slate-600">
								<PartyStatusCell status={channelStatus} />
							</span>
							{channelStatus !== "n/a" && (
								<div className="ml-auto flex gap-2">
									<Button
										size="sm"
										variant="outline"
										disabled={channelStatus === "approved"}
										onClick={() => onDecision(channel, "approved")}
									>
										<Translate text={localizationConstants.approveLabel} />
									</Button>
									<ConfirmDialog
										title={t(localizationConstants.partnerOfferDeclineConfirmTitle)}
										confirmText={t(localizationConstants.partnerDeclineButton)}
										cancelText={t(localizationConstants.cancelLabel)}
										confirmClassName="bg-red-600 hover:bg-red-700"
										onConfirm={() => onDecision(channel, "cancelled")}
										trigger={
											<Button size="sm" variant="outline" disabled={channelStatus === "cancelled"}>
												<Translate text={localizationConstants.partnerDeclineButton} />
											</Button>
										}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
