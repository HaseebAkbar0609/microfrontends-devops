"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PartnerOfferRow } from "@/features/partners/dashboard/constants/offers";
import type { PartnerApprovalStatus, PartnerRegisterRow } from "../constants/partners";
import type { OfferChannel, OfferDecision } from "../constants/partnerOffers";
import { ApprovalStatusBadge } from "./ApprovalStatusBadge";
import { OfferReviewCard } from "./OfferReviewCard";

type PartnerApprovalDialogProps = {
	partner: PartnerRegisterRow;
	offers: PartnerOfferRow[];
	onClose: () => void;
	onApprovalStatusChange: (approvalStatus: PartnerApprovalStatus) => void;
	onOfferDecision: (offerId: string, channel: OfferChannel, decision: OfferDecision) => void;
};

/** Lets a reviewer check a partner's offers and approve, decline or archive the partner. */
export function PartnerApprovalDialog({
	partner,
	offers,
	onClose,
	onApprovalStatusChange,
	onOfferDecision,
}: PartnerApprovalDialogProps) {
	const t = useTranslate();

	function changeStatus(approvalStatus: PartnerApprovalStatus) {
		onApprovalStatusChange(approvalStatus);
		showToast("success", t(localizationConstants.partnerApprovalUpdatedToast));
	}

	function decideOffer(offerId: string, channel: OfferChannel, decision: OfferDecision) {
		onOfferDecision(offerId, channel, decision);
		showToast("success", t(localizationConstants.partnerApprovalUpdatedToast));
	}

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-3">
						{partner.company}
						<ApprovalStatusBadge approvalStatus={partner.approvalStatus} />
					</DialogTitle>
					<DialogDescription>
						{[partner.category, partner.contact, partner.mobile, partner.type].join(" · ")}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3">
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.partnerOffersHeading} />
					</h3>
					<p className="text-sm text-slate-500">
						<Translate
							text={
								offers.length === 0
									? localizationConstants.partnerNoOffers
									: localizationConstants.partnerReviewDescription
							}
						/>
					</p>
					{offers.map((offer) => (
						<OfferReviewCard
							key={offer.id}
							offer={offer}
							onDecision={(channel, decision) => decideOffer(offer.id, channel, decision)}
						/>
					))}
				</div>

				<DialogFooter className="gap-2 sm:gap-2">
					<ConfirmDialog
						title={t(localizationConstants.partnerArchiveConfirmTitle)}
						confirmText={t(localizationConstants.archiveLabel)}
						cancelText={t(localizationConstants.cancelLabel)}
						onConfirm={() => changeStatus("archived")}
						trigger={
							<Button variant="outline" className="h-9" disabled={partner.approvalStatus === "archived"}>
								<Translate text={localizationConstants.archiveLabel} />
							</Button>
						}
					/>
					<ConfirmDialog
						title={t(localizationConstants.partnerDeclineConfirmTitle)}
						confirmText={t(localizationConstants.partnerDeclineButton)}
						cancelText={t(localizationConstants.cancelLabel)}
						confirmClassName="bg-red-600 hover:bg-red-700"
						onConfirm={() => changeStatus("declined")}
						trigger={
							<Button variant="outline" className="h-9" disabled={partner.approvalStatus === "declined"}>
								<Translate text={localizationConstants.partnerDeclineButton} />
							</Button>
						}
					/>
					<Button
						className="h-9 bg-[#18181B] text-white hover:bg-[#18181B]/90"
						disabled={partner.approvalStatus === "approved"}
						onClick={() => changeStatus("approved")}
					>
						<Translate text={localizationConstants.approveLabel} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
