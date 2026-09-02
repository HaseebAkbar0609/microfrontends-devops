"use client";

import Link from "next/link";
import { Info, Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MOCK_PURCHASE_SUPPLIERS } from "../../data/purchaseSuppliers.mock";
import { PURCHASE_MODULE_BASE_URL } from "../../data/purchaseNav.config";
import { MOCK_PURCHASES } from "../../data/purchases.mock";
import type {
	PurchaseComplaintDetail,
	PurchaseComplaintRow,
} from "../../types/purchase.types";
import { PurchaseComplaintTypeLabel } from "../PurchaseBadges";
import { InfoField, InfoFieldGrid } from "../shared/InfoFieldGrid";
import { ComplaintAttachmentsCard } from "./ComplaintAttachmentsCard";

const LINK_CLASS =
	"text-sm text-slate-900 underline underline-offset-2 hover:text-slate-700";

export interface ComplaintInformationTabProps {
	complaint: PurchaseComplaintRow;
	detail: PurchaseComplaintDetail;
}

/**
 * The complaint record's Information section.
 *
 * The purchase and supplier fields are links, per the ticket's requirement that
 * linked items navigate to their own modules. Each href is built from an id
 * resolved against the known records — a value that does not resolve renders as
 * plain text rather than becoming a link to nowhere.
 */
export function ComplaintInformationTab({
	complaint,
	detail,
}: ComplaintInformationTabProps) {
	const { linkedPurchase } = detail;

	const purchase = MOCK_PURCHASES.find(
		(row) => row.id === linkedPurchase.purchaseId,
	);
	const supplier = linkedPurchase.supplierId
		? MOCK_PURCHASE_SUPPLIERS.find(
				(row) => row.id === linkedPurchase.supplierId,
			)
		: undefined;

	return (
		<div className="space-y-4">
			<InfoFieldGrid
				titleKey={localizationConstants.purchaseComplaintLinkedPurchase}
				icon={<Package className="h-5 w-5 text-slate-700" />}
			>
				<InfoField labelKey={localizationConstants.purchaseColNumber}>
					{purchase ? (
						<Link
							href={`${PURCHASE_MODULE_BASE_URL}/${encodeURIComponent(purchase.id)}`}
							className={LINK_CLASS}
						>
							{linkedPurchase.lineNo || purchase.purchaseNo}
						</Link>
					) : (
						linkedPurchase.lineNo || undefined
					)}
				</InfoField>
				<InfoField
					labelKey={localizationConstants.purchaseColName}
					value={linkedPurchase.name}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseSupplierColName}
				>
					{supplier ? (
						<Link
							href={`${PURCHASE_MODULE_BASE_URL}/suppliers/${encodeURIComponent(supplier.id)}`}
							className={LINK_CLASS}
						>
							{linkedPurchase.supplier || supplier.name}
						</Link>
					) : (
						linkedPurchase.supplier || undefined
					)}
				</InfoField>
				<InfoField
					labelKey={
						localizationConstants.purchaseComplaintPurchaseDate
					}
					value={linkedPurchase.purchaseDate}
				/>
				<InfoField
					labelKey={
						localizationConstants.purchaseComplaintSupplierDate
					}
					value={linkedPurchase.supplierDate}
				/>
				<InfoField
					labelKey={
						localizationConstants.purchaseLineColEstimatedDelivery
					}
					value={linkedPurchase.estimatedDelivery}
				/>
			</InfoFieldGrid>

			<InfoFieldGrid
				titleKey={localizationConstants.purchaseComplaintDetailsSection}
				icon={<Package className="h-5 w-5 text-slate-700" />}
			>
				<InfoField
					labelKey={localizationConstants.purchaseComplaintColType}
				>
					<PurchaseComplaintTypeLabel type={complaint.type} />
				</InfoField>
				<InfoField
					labelKey={
						localizationConstants.purchaseComplaintCreatedDate
					}
					value={detail.createdDate}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseComplaintCreatedBy}
					value={detail.createdBy}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseComplaintAssignedTo}
					value={detail.assignedTo}
				/>
			</InfoFieldGrid>

			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Info className="h-5 w-5 text-slate-700" aria-hidden />
						<Translate
							text={
								localizationConstants.purchaseGoodsColDescription
							}
						/>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<p className="text-sm leading-6 text-slate-700">
						{detail.description.trim() ? (
							detail.description
						) : (
							<Translate
								text={localizationConstants.purchaseInfoNone}
							/>
						)}
					</p>
				</CardContent>
			</Card>

			<ComplaintAttachmentsCard attachments={detail.attachments} />
		</div>
	);
}

export default ComplaintInformationTab;
