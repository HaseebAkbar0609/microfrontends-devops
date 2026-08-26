"use client";

import { Building2 } from "lucide-react";

import { ModulePageHeader } from "@/components/layout/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PURCHASE_MODULE_BASE_URL,
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
} from "../data/purchaseNav.config";
import type { PurchaseSupplierRow } from "../types/purchase.types";

export interface PurchaseSupplierDetailPageProps {
	supplier: PurchaseSupplierRow;
}

/**
 * Read-only supplier record. No design exists for this page yet, so it stays
 * lean: the record header from the navigation guideline plus the row's own
 * fields.
 */
export function PurchaseSupplierDetailPage({
	supplier,
}: PurchaseSupplierDetailPageProps) {
	const rows: [TranslationKeys, string][] = [
		[localizationConstants.purchaseColOrderer, supplier.orderer],
		[localizationConstants.orderPostNrLabel, supplier.postalCode],
		[localizationConstants.orderCityLabel, supplier.city],
		[localizationConstants.orderMailLabel, supplier.email],
		[localizationConstants.orderTelefonLabel, supplier.phone],
	];

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				record={{
					title: supplier.name,
					backHref: `${PURCHASE_MODULE_BASE_URL}/suppliers`,
				}}
			/>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				<Card className="max-w-2xl rounded-lg border border-slate-200 bg-white pb-4 shadow-none">
					<CardHeader className="flex h-12 flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
						<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
							<Building2 className="h-5 w-5 text-slate-700" />
							<span>
								<Translate
									text={
										localizationConstants.purchaseSupplierGeneralInfo
									}
								/>
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="px-4 py-0">
						<dl className="divide-y divide-slate-100">
							{rows.map(([label, value]) => (
								<div
									key={label}
									className="flex items-baseline justify-between gap-4 py-3"
								>
									<dt className="text-sm font-medium text-slate-700">
										<Translate text={label} />
									</dt>
									<dd className="text-sm text-slate-900">
										{value}
									</dd>
								</div>
							))}
							<div className="flex items-baseline justify-between gap-4 py-3">
								<dt className="text-sm font-medium text-slate-700">
									<Translate
										text={localizationConstants.statusLabel}
									/>
								</dt>
								<dd className="text-sm text-slate-900">
									<Translate
										text={
											supplier.status === "active"
												? localizationConstants.activeStatus
												: localizationConstants.inactiveStatus
										}
									/>
								</dd>
							</div>
						</dl>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default PurchaseSupplierDetailPage;
