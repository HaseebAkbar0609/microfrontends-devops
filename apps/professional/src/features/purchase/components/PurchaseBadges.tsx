"use client";

import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type {
	PurchaseCategory,
	PurchaseComplaintStatus,
	PurchaseComplaintType,
	PurchaseStatus,
	PurchaseType,
} from "../types/purchase.types";

const STATUS_STYLES: Record<PurchaseStatus, string> = {
	not_started: "bg-[#FEF3C7] text-[#92400E]",
	ongoing: "bg-[#DCFCE7] text-[#15803D]",
	delayed: "bg-[#FEE2E2] text-[#B91C1C]",
	completed: "bg-[#E0F2FE] text-[#0369A1]",
};

const STATUS_LABELS: Record<PurchaseStatus, TranslationKeys> = {
	not_started: localizationConstants.purchaseStatusNotStarted,
	ongoing: localizationConstants.purchaseStatusOngoing,
	delayed: localizationConstants.purchaseStatusDelayed,
	completed: localizationConstants.purchaseStatusCompleted,
};

export function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
		>
			<Translate text={STATUS_LABELS[status]} />
		</span>
	);
}

const TYPE_LABELS: Record<PurchaseType, TranslationKeys> = {
	total: localizationConstants.purchaseTypeTotal,
	general: localizationConstants.purchaseTypeGeneral,
	running: localizationConstants.purchaseTypeRunning,
	collaboration: localizationConstants.purchaseTypeCollaboration,
};

const CATEGORY_LABELS: Record<PurchaseCategory, TranslationKeys> = {
	service: localizationConstants.purchaseCategoryService,
	contracting: localizationConstants.purchaseCategoryContracting,
	running: localizationConstants.purchaseCategoryRunning,
};

/** Neutral chip shared by the Type and Category columns. */
function PurchaseChip({ label }: { label: TranslationKeys }) {
	return (
		<span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50/80 px-3 py-0.5 text-xs font-medium text-slate-700">
			<Translate text={label} />
		</span>
	);
}

export function PurchaseTypeBadge({ type }: { type: PurchaseType }) {
	return <PurchaseChip label={TYPE_LABELS[type]} />;
}

export function PurchaseCategoryBadge({
	category,
}: {
	category: PurchaseCategory;
}) {
	return <PurchaseChip label={CATEGORY_LABELS[category]} />;
}

const COMPLAINT_STATUS_STYLES: Record<PurchaseComplaintStatus, string> = {
	not_sent: "bg-[#E0F2FE] text-[#0369A1]",
	sent: "bg-[#FEF3C7] text-[#92400E]",
	approved: "bg-[#DCFCE7] text-[#15803D]",
};

const COMPLAINT_STATUS_LABELS: Record<
	PurchaseComplaintStatus,
	TranslationKeys
> = {
	not_sent: localizationConstants.purchaseComplaintStatusNotSent,
	sent: localizationConstants.purchaseComplaintStatusSent,
	approved: localizationConstants.purchaseComplaintStatusApproved,
};

export function PurchaseComplaintStatusBadge({
	status,
}: {
	status: PurchaseComplaintStatus;
}) {
	return (
		<span
			className={`inline-flex items-center rounded-md px-3 py-0.5 text-xs font-medium ${COMPLAINT_STATUS_STYLES[status]}`}
		>
			<Translate text={COMPLAINT_STATUS_LABELS[status]} />
		</span>
	);
}

const COMPLAINT_TYPE_LABELS: Record<PurchaseComplaintType, TranslationKeys> = {
	damaged: localizationConstants.purchaseComplaintTypeDamaged,
	wrong_delivery: localizationConstants.purchaseComplaintTypeWrongDelivery,
};

/** Plain text in the design, not a chip. */
export function PurchaseComplaintTypeLabel({
	type,
}: {
	type: PurchaseComplaintType;
}) {
	return <Translate text={COMPLAINT_TYPE_LABELS[type]} />;
}
