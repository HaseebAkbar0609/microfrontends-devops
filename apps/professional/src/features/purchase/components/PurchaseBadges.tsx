"use client";

import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type {
	PurchaseCategory,
	PurchaseComplaintPriority,
	PurchaseComplaintStatus,
	PurchaseComplaintType,
	PurchaseGoodsCategory,
	PurchaseGoodsReceptionOrderType,
	PurchaseStatus,
	PurchaseType,
} from "../types/purchase.types";

const STATUS_STYLES: Record<PurchaseStatus, string> = {
	not_started: "bg-amber-100 text-amber-800",
	ongoing: "bg-green-100 text-green-700",
	delayed: "bg-red-100 text-red-700",
	completed: "bg-sky-100 text-sky-700",
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
	not_sent: "bg-sky-100 text-sky-700",
	sent: "bg-amber-100 text-amber-800",
	approved: "bg-green-100 text-green-700",
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

const COMPLAINT_PRIORITY_STYLES: Record<PurchaseComplaintPriority, string> = {
	high: "bg-red-100 text-red-700",
	medium: "bg-amber-100 text-amber-800",
	low: "bg-slate-100 text-slate-700",
};

const COMPLAINT_PRIORITY_LABELS: Record<
	PurchaseComplaintPriority,
	TranslationKeys
> = {
	high: localizationConstants.purchaseComplaintPriorityHigh,
	medium: localizationConstants.purchaseComplaintPriorityMedium,
	low: localizationConstants.purchaseComplaintPriorityLow,
};

/**
 * Priority is not in the Figma frame; the ticket's acceptance criteria call for
 * it, so it follows the status badge's shape with severity-ordered colours.
 */
export function PurchaseComplaintPriorityBadge({
	priority,
}: {
	priority: PurchaseComplaintPriority;
}) {
	return (
		<span
			className={`inline-flex items-center rounded-md px-3 py-0.5 text-xs font-medium ${COMPLAINT_PRIORITY_STYLES[priority]}`}
		>
			<Translate text={COMPLAINT_PRIORITY_LABELS[priority]} />
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

const GOODS_RECEPTION_ORDER_TYPE_LABELS: Record<
	PurchaseGoodsReceptionOrderType,
	TranslationKeys
> = {
	normal: localizationConstants.purchaseGoodsReceptionOrderTypeNormal,
	partial: localizationConstants.purchaseGoodsReceptionOrderTypePartial,
	backorder: localizationConstants.purchaseGoodsReceptionOrderTypeBackorder,
};

/** Plain text in the design, not a chip. */
export function PurchaseGoodsReceptionOrderTypeLabel({
	orderType,
}: {
	orderType: PurchaseGoodsReceptionOrderType;
}) {
	return <Translate text={GOODS_RECEPTION_ORDER_TYPE_LABELS[orderType]} />;
}

const GOODS_CATEGORY_LABELS: Record<PurchaseGoodsCategory, TranslationKeys> = {
	spare_parts: localizationConstants.purchaseGoodsCategorySpareParts,
	raw_materials: localizationConstants.purchaseGoodsCategoryRawMaterials,
	machinery: localizationConstants.purchaseGoodsCategoryMachinery,
};

/** The ticket's category badge, on the neutral chip the module already uses. */
export function PurchaseGoodsCategoryBadge({
	category,
}: {
	category: PurchaseGoodsCategory;
}) {
	return <PurchaseChip label={GOODS_CATEGORY_LABELS[category]} />;
}
