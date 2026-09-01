"use client";

import { Calculator, CircleUserRound, Folder, Pencil } from "lucide-react";

import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { purchaseInformationFor } from "../../data/purchaseInformation.mock";
import { PurchaseStatusBadge } from "../PurchaseBadges";
import { InfoField, InfoFieldGrid } from "../shared/InfoFieldGrid";

export interface PurchaseInformationTabProps {
	purchaseId: string;
}

/**
 * The record's Information section: Calculation, Quote and Order.
 *
 * Read-only. The Order card's Edit action is drawn in the frame but no order
 * edit screen exists, so it renders disabled rather than doing nothing — and it
 * is gated on `EDIT_PURCHASE` regardless, so enabling it later cannot silently
 * skip the permission.
 */
export function PurchaseInformationTab({
	purchaseId,
}: PurchaseInformationTabProps) {
	const t = useTranslate();
	const information = purchaseInformationFor(purchaseId);

	if (!information) {
		return (
			<Card className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-none">
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.purchaseInfoNone} />
				</p>
			</Card>
		);
	}

	const { calculation, quote, order } = information;

	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
			<InfoFieldGrid
				titleKey={localizationConstants.calculation}
				icon={<Calculator className="h-5 w-5 text-slate-700" />}
			>
				<InfoField
					labelKey={localizationConstants.purchaseCreateInfoCalcNo}
					value={calculation.calculationNo}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseColOrderer}
					value={calculation.orderer}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseInfoQuoteDate}
					value={calculation.quoteDate}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseColType}
					value={calculation.type}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseInfoQuoteAmount}
					value={calculation.quoteAmount}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseColCategory}
					value={calculation.category}
				/>
				<InfoField labelKey={localizationConstants.statusLabel}>
					<PurchaseStatusBadge status={calculation.status} />
				</InfoField>
			</InfoFieldGrid>

			<InfoFieldGrid
				titleKey={localizationConstants.offer}
				icon={<CircleUserRound className="h-5 w-5 text-slate-700" />}
			>
				<InfoField
					labelKey={localizationConstants.purchaseInfoIdNo}
					value={quote.idNo}
				/>
				<InfoField
					labelKey={localizationConstants.job}
					value={quote.job}
				/>
				<InfoField
					labelKey={localizationConstants.date}
					value={quote.date}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseColType}
					value={quote.type}
				/>
				<InfoField
					labelKey={localizationConstants.request}
					value={quote.inquiry}
				/>
				<InfoField
					labelKey={localizationConstants.municipality}
					value={quote.municipality}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseColCategory}
					value={quote.category}
				/>
			</InfoFieldGrid>

			<InfoFieldGrid
				titleKey={localizationConstants.order}
				icon={<Folder className="h-5 w-5 text-slate-700" />}
				className="xl:col-span-2"
				action={
					<PermissionGate permission="EDIT_PURCHASE">
						{/* Drawn in the frame, but no order edit screen exists
						    yet — shown, and honestly disabled. */}
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled
							title={t(
								localizationConstants.purchaseOrderUnavailable,
							)}
							className="h-8 gap-1.5 border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Pencil className="h-3.5 w-3.5" aria-hidden />
							<Translate
								text={localizationConstants.actionEdit}
							/>
						</Button>
					</PermissionGate>
				}
			>
				<InfoField
					labelKey={localizationConstants.purchaseCreateOrderNo}
					value={order.orderNo}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseCreateOrderName}
					value={order.orderName}
				/>
				<InfoField
					labelKey={localizationConstants.orderKundLabel}
					value={order.customer}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseColType}
					value={order.type}
				/>
				<InfoField
					labelKey={localizationConstants.statusLabel}
					value={order.status}
				/>
				<InfoField
					labelKey={localizationConstants.orderTelefonLabel}
					value={order.telephone}
				/>
				<InfoField
					labelKey={localizationConstants.purchaseInfoOrderAmount}
					value={order.orderAmount}
				/>
				<InfoField
					labelKey={localizationConstants.orderProjectManager}
					value={order.projectManager}
				/>
				<InfoField
					labelKey={localizationConstants.orderStartDatumLabel}
					value={order.startDate}
				/>
				<InfoField
					labelKey={localizationConstants.orderSlutDatumLabel}
					value={order.endDate}
				/>
			</InfoFieldGrid>
		</div>
	);
}

export default PurchaseInformationTab;
